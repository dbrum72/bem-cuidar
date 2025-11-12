<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserSaveRequest;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;

class UserController extends Controller {

    protected $user;

    public function __construct(User $user) {

        $this->user = $user;
    }

    /************************************************************************************/
    public function index(Request $request) {

        $userRepository = new UserRepository($this->user);

        if($request->has('with')) {

            $userRepository->selectWith($request->with);
        }  

        if($request->has('filter')) {

            $userRepository->filter($request->filter);
        }

        if($request->has('sort')) {

            $userRepository->sort($request->sort);
        }

        if($users = $userRepository->getResultado()) {

            return response()->json([ 'users' => $users, 'errors' => []], 201);           
        }

        return response()->json(['errors' => ['error' => 'Nenhum registro localizado.']], 404);
    }

    /************************************************************************************/
    public function show($id) {

        if($user = $this->user->find($id)) {

            return response()->json(['user' => $user, 'errors' => []], 200);
        }

        return response()->json(['errors' => ['error' => 'O registro não foi localizado.']], 404);
    }

    /************************************************************************************/
    public function store(UserSaveRequest $request){

        if($stored = $this->user->create($request->all())) {

            return response()->json([ 'user' => $stored, 'errors' => [], 'msg' => 'Registro criado com sucesso!'], 201);
        }

        return response()->json(['errors' => ['error' => 'Erro ao criar o registro']], 404);
    }

    /************************************************************************************/
    public function update(UserSaveRequest $request, $id) {

        if($update = $this->user->find($id)) {

            if($update->update($request->all())) {

                return response()->json([ 'user' => $update, 'errors' => [], 'msg' => 'Registro atualizado com sucesso!'], 200);
            }       

            return response()->json(['errors' => ['error' => 'Erro ao gravar o registro']], 404);
        }

        return response()->json(['errors' => ['error' => 'O registro não foi localizado.']], 404);
    }

    /************************************************************************************/
    public function destroy($id) {

         if($destroy = $this->user->find($id)) {      
            
            if($destroy->delete()) {

                return response()->json(['msg' => 'Registro removido com sucesso!'], 200);
            }
            
            return response()->json([ 'errors' => ['error' => 'Erro ao excluir o registro']], 404);
        }

        return response()->json(['errors' => ['erro' => 'O registro não foi localizado.']], 404);
    }
}
