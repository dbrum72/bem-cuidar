<?php

namespace App\Http\Controllers;

use App\Models\Child;
use Illuminate\Http\Request;
use App\Repositories\ChildRepository;
use App\Http\Requests\ChildSaveRequest;
use Illuminate\Support\Facades\Storage;

class ChildController extends Controller {

    public function __construct(Child $child) {

        $this->child = $child;
    }

    /************************************************************************************/
    public function index(Request $request) {

        $childRepository = new ChildRepository($this->child);

        if($request->has('with')) {

            $childRepository->selectWith($request->with);
        }  

        if($request->has('filter')) {

            $childRepository->filter($request->filter);
        }

        if($request->has('sort')) {

            $childRepository->sort($request->sort);
        }

        if($children = $childRepository->getResultado()) {

            return response()->json([ 'children' => $children, 'errors' => []], 201);           
        }

        return response()->json(['errors' => ['error' => 'Nenhum registro localizado.']], 404);
    }

    /************************************************************************************/

    public function store(ChildSaveRequest $request){

        if($request->hasFile('photo')){
            $photo = $request->file('photo')->store('children','public');
            $request->merge(['photo' => $photo]);
        }

        $request->photo_url = $request->photo ? asset('storage/'.$request->photo) : null;

        if($stored = $this->child->create($request->all())) {

            return response()->json([ 'child' => $stored, 'errors' => [], 'msg' => 'Registro criado com sucesso!'], 201);
        }

        return response()->json(['errors' => ['error' => 'Erro ao criar o registro']], 404);
    }

    /************************************************************************************/
    public function show($id) {

        if($child = $this->child->find($id)) {

            return response()->json(['child' => $child, 'errors' => []], 200);
        }

        return response()->json(['errors' => ['error' => 'O registro não foi localizado.']], 404);
    }

    /************************************************************************************/
    public function update(ChildSaveRequest $request, $id) {

        if($update = $this->child->find($id)) {

            if($update->update($request->all())) {

                return response()->json([ 'child' => $update, 'errors' => [], 'msg' => 'Registro atualizado com sucesso!'], 200);
            }       

            return response()->json(['errors' => ['error' => 'Erro ao gravar o registro']], 404);
        }

        return response()->json(['errors' => ['error' => 'O registro não foi localizado.']], 404);
    }

    /************************************************************************************/
    public function destroy($id) {

         if($destroy = $this->child->find($id)) {      
            
            if($destroy->delete()) {

                return response()->json(['msg' => 'Registro removido com sucesso!'], 200);
            }
            
            return response()->json([ 'errors' => ['error' => 'Erro ao excluir o registro']], 404);
        }

        return response()->json(['errors' => ['erro' => 'O registro não foi localizado.']], 404);
    }

}
