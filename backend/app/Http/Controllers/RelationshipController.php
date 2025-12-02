<?php

namespace App\Http\Controllers;

use App\Models\Relationship;
use App\Repositories\RelationshipRepository;
use App\Http\Requests\RelationshipSaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RelationshipController extends Controller {

    public function __construct(Relationship $relationship) {

        $this->relationship = $relationship;
    }

    /************************************************************************************
    public function index(Request $request) {

        $user = auth()->user();

        $relationshipRepository = new RelationshipRepository($this->relationship);

        $relationshipRepository->extendedFilter('tutors,tutor_id:=:'.$user->id);

        if($request->has('with')) {

            $relationshipRepository->selectWith($request->with);
        }  

        if($request->has('filter')) {

            $relationshipRepository->filter($request->filter);
        }

        if($request->has('sort')) {

            $relationshipRepository->sort($request->sort);
        }

        if($relationships = $relationshipRepository->getResultado()) {

            return response()->json([ 'relationships' => $relationships, 'errors' => []], 201);           
        }

        return response()->json(['errors' => ['error' => 'Nenhum registro localizado.']], 404);
    }

    /************************************************************************************

    public function store(RelationshipSaveRequest $request) {

        $nameUnico = null;

        // Upload da foto (não entra na transação)
        if ($request->hasFile('photo')) {
            $nameUnico = str_shuffle(time() . Str::random(10)) . '.' .
                        $request->photo->getClientOriginalExtension();

            $request->file('photo')->storeAs('relationships', $nameUnico, 'public');
        }

        // Prepara dados
        $data = $request->all();
        unset($data['photo']);
        $data['photo'] = $nameUnico;

        try {
            DB::beginTransaction();

            // 1) Cria o relationshipe
            $stored = $this->relationship->create($data);

            if (!$stored) {
                throw new \Exception("Erro ao criar o relationshipe.");
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
                'relationship' => $stored,
                'errors' => [],
                'msg' => 'Registro criado com sucesso!'
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();

            if ($nameUnico) {
                Storage::disk('public')->delete("relationships/$nameUnico");
            }

            return response()->json(['errors' => ['error' => 'Erro ao salvar relationshipe: ' . $e->getMessage()]], 500);
        }
    }


    /************************************************************************************/
    public function update(RelationshipSaveRequest $request, $id) {

        if (!$relationship = $this->relationship->find($id)) {
            return response()->json(['errors' => ['error' => 'Registro não encontrado']], 404);
        }

        $data = $request->except('photo');
        $currentPhoto = $relationship->photo;
        $newPhoto = $currentPhoto;

        try {

            DB::beginTransaction();

            if ($request->hasFile('photo')) {

                $newPhoto = str_shuffle(time() . Str::random(10)) . '.' .$request->file('photo')->getClientOriginalExtension();

                $request->file('photo')
                    ->storeAs('dependents', $newPhoto, 'public');

                $data['photo'] = $newPhoto;
            }

            $relationship->update($data);

            DB::commit();

        } catch (\Throwable $e) {

            DB::rollBack();

            if ($newPhoto !== $currentPhoto && Storage::disk('public')->exists("dependents/{$newPhoto}")) {
                Storage::disk('public')->delete("dependents/{$newPhoto}");
            }

            return response()->json([
                'errors' => ['exception' => $e->getMessage()],
                'msg' => 'Erro ao atualizar o registro'
            ], 500);
        }

        if ($request->hasFile('photo') && $currentPhoto && Storage::disk('public')->exists("dependents/{$currentPhoto}")) {
            Storage::disk('public')->delete("dependents/{$currentPhoto}");
        }

        $relationship->refresh();

        return response()->json([
            'relationship' => $relationship,
            'errors' => [],
            'msg' => 'Registro atualizado com sucesso!'
        ], 200);
    }


    /************************************************************************************/
    public function show($id) {

        if ($relationship = $this->relationship->with('dependent')->with('tutor')->find($id)) {

            return response()->json(['relationship' => $relationship, 'errors' => []], 200);
        }

        return response()->json(['errors' => ['error' => 'Registro não encontrado.']], 404);
    }


    /************************************************************************************/
    public function destroy($id) {

         if($destroy = $this->relationship->find($id)) {      
            
            if($destroy->delete()) {

                return response()->json(['msg' => 'Registro removido com sucesso!'], 200);
            }
            
            return response()->json([ 'errors' => ['error' => 'Erro ao excluir o registro']], 404);
        }

        return response()->json(['errors' => ['erro' => 'O registro não foi localizado.']], 404);
    }

}
