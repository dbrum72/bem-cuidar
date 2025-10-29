<?php

namespace App\Http\Controllers;

use App\Models\SharedCareEvent;
use App\Repositories\SharedCareEventRepository;
use App\Http\Requests\SharedCareEventSaveRequest;
use Illuminate\Http\Request;

class SharedCareEventController extends Controller {

    public function __construct(SharedCareEvent $sharedCareEvent) {

        $this->sharedCareEvent = $sharedCareEvent;
    }   

    /************************************************************************************/
    public function index(Request $request) {

        $sharedCareEventRepository = new SharedCareEventRepository($this->sharedCareEvent);

        if($request->has('with')) {

            $sharedCareEventRepository->selectWith($request->with);
        }  

        if($request->has('filter')) {

            $sharedCareEventRepository->filter($request->filter);
        }

        if($request->has('sort')) {

            $sharedCareEventRepository->sort($request->sort);
        }

        if($sharedCareEvent = $sharedCareEventRepository->getResultado()) {

            return response()->json([ 'sharedCareEvents' => $sharedCareEvent, 'errors' => []], 201);           
        }

        return response()->json(['errors' => ['error' => 'Nenhum registro localizado.']], 404);
    }

    /************************************************************************************/

    public function store(SharedCareEventSaveRequest $request) {

        if($stored = $this->sharedCareEvent->create($request->all())) {

            return response()->json([ 'sharedCareEvent' => $stored, 'errors' => [], 'msg' => 'Registro criado com sucesso!'], 201);
        }

        return response()->json(['errors' => ['error' => 'Erro ao criar o registro']], 404);
    }

    /************************************************************************************/
}
