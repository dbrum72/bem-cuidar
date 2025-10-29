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

}
