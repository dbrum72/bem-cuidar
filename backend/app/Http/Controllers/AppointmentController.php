<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AppointmentParticipant;
use App\Repositories\AppointmentRepository;
use App\Http\Requests\AppointmentSaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller {

    public function __construct(Appointment $appointment) {

        $this->appointment = $appointment;
    }   

    /************************************************************************************/
    public function index(Request $request) {

        $user = auth()->user();

        if($appointments = DB::table('appointments')
            ->join('dependents', 'appointments.dependent_id', '=', 'dependents.id')
            ->join('appintments_participants','appointments.id', '=', 'appointments_participants.appointment_id')
            ->join('users', 'users.id', '=', 'appointment_tutor.tutor_id')
            ->whereIn('appointment_participants.participant_id', $user->id)
            ->select('appointments.*', 'user.name as tutor')
            ->get()) {

            return response()->json([ 'appointments' => $appointments, 'errors' => []], 201);           
        }

        return response()->json(['errors' => ['error' => 'Nenhum registro localizado.']], 404);
    }

    /************************************************************************************/

    public function store(AppointmentSaveRequest $request) {

         DB::beginTransaction();

        try {

            if($appointment = $this->appointment->create($request->all())) {

                if ($appointment && $request->filled('participants')) {

                    foreach ($request->participants as $participant) {
                        AppointmentParticipant::create([
                            'appointment_id'   => $appointment->id,
                            'participant_id'   => $participant['participant_id'],
                            'share_percentage' => $participant['share_percentage'],
                            'payment_status'   => $participant['payment_status'] ?? 'pending',
                            'accepted_status'  => $participant['accepted_status'] ?? 'pending',
                        ]);
                    }
                }

                DB::commit();

                return response()->json([ 'appointment' => $appointment, 'errors' => [], 'msg' => 'Registro criado com sucesso!'], 201);
            }

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'errors' => ['error' => 'Erro ao criar o registro: ' . $e->getMessage()]
            ], 400);
        }        
    }

    /************************************************************************************/
    public function update(AppointmentSaveRequest $request, $id) {

        if($update = $this->appointment->find($id)) {

            if($update->update($request->all())) {

                return response()->json([ 'appointment' => $update, 'errors' => [], 'msg' => 'Registro atualizado com sucesso!'], 200);
            }       

            return response()->json(['errors' => ['error' => 'Erro ao gravar o registro']], 404);
        }

        return response()->json(['errors' => ['error' => 'O registro não foi localizado.']], 404);
    }

    /************************************************************************************/
    public function show($id) {

        if($appointment = $this->appointment->find($id)) {

            return response()->json(['appointment' => $appointment, 'errors' => []], 200);
        }

        return response()->json(['errors' => ['error' => 'O registro não foi localizado.']], 404);
    }

    /************************************************************************************/
    public function destroy($id) {

         if($appointment = $this->appointment->find($id)) {      
            
            if($appointment->delete()) {

                return response()->json(['msg' => 'Registro removido com sucesso!'], 200);
            }
            
            return response()->json([ 'errors' => ['error' => 'Erro ao excluir o registro']], 404);
        }

        return response()->json(['errors' => ['erro' => 'O registro não foi localizado.']], 404);
    }
}
