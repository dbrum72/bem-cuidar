<?php

namespace App\Http\Controllers;

use App\Models\Dependent;
use Illuminate\Http\Request;
use App\Repositories\DependentRepository;
use App\Http\Requests\DependentSaveRequest;
use Illuminate\Support\Facades\Storage;

class DependentController extends Controller {

    public function __construct(Dependent $dependent) {

        $this->dependent = $dependent;
    }

    /************************************************************************************/
    public function index(Request $request) {

        $dependentRepository = new DependentRepository($this->dependent);

        if($request->has('with')) {

            $dependentRepository->selectWith($request->with);
        }  

        if($request->has('filter')) {

            $dependentRepository->filter($request->filter);
        }

        if($request->has('sort')) {

            $dependentRepository->sort($request->sort);
        }

        if($dependents = $dependentRepository->getResultado()) {

            return response()->json([ 'dependents' => $dependents, 'errors' => []], 201);           
        }

        return response()->json(['errors' => ['error' => 'Nenhum registro localizado.']], 404);
    }

    /************************************************************************************/

    public function store(DependentSaveRequest $request){

        if($request->hasFile('photo')){
            $photo = $request->file('photo')->store('dependents','public');
            $request->merge(['photo' => $photo]);
        }

        $request->photo_url = $request->photo ? asset('storage/'.$request->photo) : null;

        if($stored = $this->dependent->create($request->all())) {

            return response()->json([ 'dependent' => $stored, 'errors' => [], 'msg' => 'Registro criado com sucesso!'], 201);
        }

        return response()->json(['errors' => ['error' => 'Erro ao criar o registro']], 404);
    }

    /************************************************************************************/
    public function show($id) {

        if($dependent = $this->dependent->find($id)) {

            return response()->json(['dependent' => $dependent, 'errors' => []], 200);
        }

        return response()->json(['errors' => ['error' => 'O registro não foi localizado.']], 404);
    }

    /************************************************************************************/
    public function update(DependentSaveRequest $request, $id) {

        if($update = $this->dependent->find($id)) {

            if($update->update($request->all())) {

                return response()->json([ 'dependent' => $update, 'errors' => [], 'msg' => 'Registro atualizado com sucesso!'], 200);
            }       

            return response()->json(['errors' => ['error' => 'Erro ao gravar o registro']], 404);
        }

        return response()->json(['errors' => ['error' => 'O registro não foi localizado.']], 404);
    }

    /************************************************************************************/
    public function destroy($id) {

         if($destroy = $this->dependent->find($id)) {      
            
            if($destroy->delete()) {

                return response()->json(['msg' => 'Registro removido com sucesso!'], 200);
            }
            
            return response()->json([ 'errors' => ['error' => 'Erro ao excluir o registro']], 404);
        }

        return response()->json(['errors' => ['erro' => 'O registro não foi localizado.']], 404);
    }

}
