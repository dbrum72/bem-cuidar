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

    public function store(DependentSaveRequest $request){

    if($request->hasFile('photo')){
        $photo = $request->file('photo')->store('dependents','public');
        $request->merge(['photo' => $photo]);
    }

    $request->photo_url = $request->photo ? asset('storage/'.$request->photo) : null;

    // cria o dependente como já fazia
    if($stored = $this->dependent->create($request->all())) {

        // --- nova parte: vincular o tutor criador na pivot dependent_tutor ---
        // o DependentSaveRequest já seta created_by => id do usuário autenticado.
        // mantemos relationship_type nulo (ou use $request->relationship_type se quiser)
        if ($request->filled('created_by')) {
            try {
                // usamos syncWithoutDetaching para não quebrar caso já exista vínculo
                $stored->tutors()->syncWithoutDetaching([
                    $request->input('created_by') => [
                        'relationship_type' => $request->input('relationship_type', null),
                        'status' => 'accepted',      // criador é tutor aceito por padrão
                        'invite_token' => null,
                        'expires_at' => null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                ]);
            } catch (\Throwable $e) {
                // em caso de erro no pivot, removemos o registro recém-criado e retornamos erro
                // (opcional — se preferir, apenas logue e continue)
                $stored->delete();
                return response()->json(['errors' => ['error' => 'Erro ao vincular tutor: '.$e->getMessage()]], 500);
            }
        }
        // --- fim da nova parte ---

        // devolve dependente (já criado)
        // carregamos tutores para o frontend ter a informação completa
        $stored->load('tutors');

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

        $dependent = $this->dependent->find($id);

        if (!$dependent) {
            return response()->json(['errors' => ['error' => 'Registro não encontrado']], 404);
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo')->store('dependents', 'public');
            $request->merge(['photo' => $photo]);
        }

        $request->photo_url = $request->photo ? asset('storage/' . $request->photo) : null;

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
