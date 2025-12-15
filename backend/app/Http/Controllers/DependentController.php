<?php

namespace App\Http\Controllers;

use App\Models\Dependent;
use App\Repositories\DependentRepository;
use App\Http\Requests\DependentSaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DependentController extends Controller {

    public function __construct(Dependent $dependent) {

        $this->dependent = $dependent;
    }

    /************************************************************************************/
    public function index(Request $request) {

        $user = auth()->user();

        if($dependents = DB::table('dependents')
            ->join('dependent_tutor', 'dependents.id', '=', 'dependent_tutor.dependent_id')
            ->where('dependent_tutor.tutor_id', $user->id)
            ->select('dependents.*', 'dependent_tutor.photo','dependent_tutor.id as relationship_id', 'dependent_tutor.relationship_type', 'dependent_tutor.status')
            ->get()) {

            return response()->json([ 'dependents' => $dependents, 'errors' => []], 201);           
        }

        return response()->json(['errors' => ['error' => 'Nenhum registro localizado.']], 404);
    }

    /************************************************************************************/
    public function store(DependentSaveRequest $request) {

        DB::beginTransaction();

        try {

            // 1) Cria o dependente
            $dependent = $this->dependent->create($request->all());

            // 2) Vincula tutor criador (se enviado)
            if ($request->filled('created_by')) {
                $dependent->tutors()->syncWithoutDetaching([
                    $request->created_by => [
                        'relationship_type' => $request->relationship_type,
                        'status'            => 'aceito',
                        'invite_token'      => null,
                        'expires_at'        => null,
                    ]
                ]);
            }

            DB::commit();

            return response()->json([
                'dependent' => $dependent->load('tutors'),
                'errors'    => [],
                'msg'       => 'Registro criado com sucesso!'
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'errors' => ['error' => 'Erro ao criar o registro: ' . $e->getMessage()]
            ], 400);
        }
    }



    /************************************************************************************/
    public function update(DependentSaveRequest $request, $id) {

        $user = auth()->user(); // tutor autenticado

        DB::beginTransaction();

        try {

            // 1) Encontra o dependente vinculado ao tutor logado
            $dependent = $this->dependent
                ->where('id', $id)
                ->whereHas('tutors', fn($q) => $q->where('tutor_id', $user->id))
                ->firstOrFail();

            // 2) Atualiza apenas os dados do dependente
            $dependent->update($request->validated());

            // 3) Atualiza SOMENTE relationship_type na pivot
            if ($request->filled('relationship_type')) {
                $dependent->tutors()->updateExistingPivot(
                    $user->id,
                    ['relationship_type' => $request->relationship_type]
                );
            }

            DB::commit();

            return response()->json([
                'dependent' => $dependent->load('tutors'),
                'errors'    => [],
                'msg'       => 'Registro atualizado com sucesso!'
            ], 200);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'errors' => ['error' => 'Erro ao atualizar o registro: ' . $e->getMessage()]
            ], 400);
        }
    }


    /************************************************************************************/
    public function show($id) {

        $user = auth()->user(); // tutor autenticado

        if ($dependent = $this->dependent
            ->where('id', $id)
            ->whereHas('tutors', fn($q) => $q->where('tutor_id', $user->id))
            ->with([
                'tutors' => function ($q) use ($user) {
                    $q->where('tutor_id', $user->id)
                    ->withPivot('relationship_type'); // <-- adiciona relation_ship
                }
            ])
            ->first()
        ) {
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