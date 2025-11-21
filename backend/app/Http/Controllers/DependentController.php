<?php

namespace App\Http\Controllers;

use App\Models\Dependent;
use App\Repositories\DependentRepository;
use App\Http\Requests\DependentSaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DependentController extends Controller {

    public function __construct(Dependent $dependent) {

        $this->dependent = $dependent;
    }

    /************************************************************************************/
    public function index(Request $request) {

        $user = auth()->user();

        $dependentRepository = new DependentRepository($this->dependent);

        $dependentRepository->extendedFilter('tutors,tutor_id:=:'.$user->id);

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

    public function store(DependentSaveRequest $request) {

        if ($request->hasFile('photo')) {

            $nameUnico = str_shuffle(time() . Str::random(10)) . '.' .
                        $request->photo->getClientOriginalExtension();

            $request->file('photo')->storeAs('dependents', $nameUnico, 'public');
        }

        $data = $request->all();
        unset($data['photo']);
        $data['photo'] = $nameUnico ?? null;

        // Cria o dependente
        if ($stored = $this->dependent->create($data)) {

            // Vincula tutor criador (quando enviado)
            if ($request->filled('created_by')) {
                try {
                    $stored->tutors()->syncWithoutDetaching([
                        $request->input('created_by') => [
                            'relationship_type' => $request->input('relationship_type', null),
                            'status' => 'accepted', // criador é tutor aceito por padrão
                            'invite_token' => null,
                            'expires_at' => null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    ]);
                } catch (\Throwable $e) {
                    $stored->delete();

                    return response()->json([
                        'errors' => [
                            'error' => 'Erro ao vincular tutor: ' . $e->getMessage()
                        ]
                    ], 500);
                }
            }

            $stored->load('tutors');

            return response()->json([
                'dependent' => $stored,
                'errors' => [],
                'msg' => 'Registro criado com sucesso!'
            ], 201);
        }

        return response()->json([
            'errors' => [
                'error' => 'Erro ao criar o registro'
            ]
        ], 404);
    }


    /************************************************************************************/
    public function update(DependentSaveRequest $request, $id) {

        $dependent = $this->dependent->find($id);

        if (!$dependent) {
            return response()->json(['errors' => ['error' => 'Registro não encontrado']], 404);
        }

        if($request->hasFile('photo')){

            $nameUnico = str_shuffle(time() . Str::random(10)) . '.' . $request->photo->getClientOriginalExtension();

            $photo = $request->file('photo')->storeAs('dependents', $nameUnico, 'public');
            
            $request->merge(['photo' => $nameUnico]);
        }

        // Atualiza o registro existente
        if ($dependent->update($request->all())) {

            // --- nova parte: sincroniza vínculo tutor-dependente ---
            if ($request->filled('created_by')) {
                try {
                    $dependent->tutors()->syncWithoutDetaching([
                        $request->input('created_by') => [
                            'relationship_type' => $request->input('relationship_type', null),
                            'status' => 'accepted',
                            'invite_token' => null,
                            'expires_at' => null,
                            'updated_at' => now(),
                        ],
                    ]);
                } catch (\Throwable $e) {
                    return response()->json([
                        'errors' => ['error' => 'Erro ao atualizar vínculo tutor: ' . $e->getMessage()],
                    ], 500);
                }
            }
            // --- fim da nova parte ---

            $dependent->load('tutors');

            return response()->json([
                'dependent' => $dependent,
                'errors' => [],
                'msg' => 'Registro atualizado com sucesso!',
            ]);
        }

        return response()->json(['errors' => ['error' => 'Erro ao atualizar o registro']], 500);
    }

    /************************************************************************************/
    public function show($id) {

        $user = auth()->user(); // tutor autenticado

        if($dependent = $this->dependent
            ->where('id', $id)
            ->whereHas('tutors', fn($q) => $q->where('tutor_id', $user->id))
            ->with(['tutors' => fn($q) => $q->where('tutor_id', $user->id)])
            ->first()) {
                return response()->json(['dependent' => $dependent, 'errors' => []], 200);
            }

            return response()->json(['errors' => ['error' => 'Registro não encontrado.']], 404);
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
