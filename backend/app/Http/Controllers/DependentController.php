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

        $nameUnico = null;

        // Upload da foto (não entra na transação)
        if ($request->hasFile('photo')) {
            $nameUnico = str_shuffle(time() . Str::random(10)) . '.' .
                        $request->photo->getClientOriginalExtension();

            $request->file('photo')->storeAs('dependents', $nameUnico, 'public');
        }

        // Prepara dados
        $data = $request->all();
        unset($data['photo']);
        $data['photo'] = $nameUnico;

        try {
            DB::beginTransaction();

            // 1) Cria o dependente
            $stored = $this->dependent->create($data);

            if (!$stored) {
                throw new \Exception("Erro ao criar o dependente.");
            }

            // 2) Vincula tutor criador
            if ($request->filled('created_by')) {
                $stored->tutors()->syncWithoutDetaching([
                    $request->input('created_by') => [
                        'relationship_type' => $request->input('relationship_type', null),
                        'status' => 'accepted',
                        'invite_token' => null,
                        'expires_at' => null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                ]);
            }

            DB::commit();

            $stored->load('tutors');

            return response()->json([
                'dependent' => $stored,
                'errors' => [],
                'msg' => 'Registro criado com sucesso!'
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();

            if ($nameUnico) {
                Storage::disk('public')->delete("dependents/$nameUnico");
            }

            return response()->json(['errors' => ['error' => 'Erro ao salvar dependente: ' . $e->getMessage()]], 500);
        }
    }


    /************************************************************************************/
    public function update(DependentSaveRequest $request, $id) {

        if($update = $this->dependent->find($id)) {

            $data = $request->all();
            $currentPhoto = $update->photo;
            $newPhotoName = $currentPhoto;

            // ---------------------------------------------------------
            // 1. SE O FRONTEND ENVIOU UM NOVO ARQUIVO DE FOTO
            // ---------------------------------------------------------
            if ($request->hasFile('photo')) {

                $newPhotoName = str_shuffle(time() . Str::random(10)) . '.' .
                $request->photo->getClientOriginalExtension();

                if ($currentPhoto && Storage::disk('public')->exists("dependents/{$currentPhoto}")) {
                    Storage::disk('public')->delete("dependents/{$currentPhoto}");
                }

                $request->file('photo')->storeAs('dependents', $newPhotoName, 'public');
            }
            else {
                // Manteve a mesma foto → não muda nada
                $newPhotoName = $currentPhoto;
            }
            
            $data['photo'] = $newPhotoName;
            unset($data['created_by']); // não atualizar esse campo diretamente

            // Atualiza dependente
            if ($update->update($data)) {

                $update->load('tutors');

                return response()->json([
                    'dependent' => $update,
                    'errors' => [],
                    'msg' => 'Registro atualizado com sucesso!'
                ], 200);
            }
        }
        
        return response()->json(['errors' => ['error' => 'Erro ao atualizar o registro']], 404);
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
