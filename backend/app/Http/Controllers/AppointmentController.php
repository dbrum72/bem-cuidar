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

        // Buscar appointments que o usuário participa
        $appointments = DB::table('appointments')
            ->join('dependents', 'appointments.dependent_id', '=', 'dependents.id')
            ->join('appointment_participants', 'appointments.id', '=', 'appointment_participants.appointment_id')
            ->where('appointment_participants.participant_id', $user->id)
            ->select('appointments.*', 'dependents.name as dependent_name')
            ->distinct()
            ->get();

        if ($appointments->isEmpty()) {
            return response()->json([
                'errors' => ['Nenhum registro localizado.']
            ], 404);
        }

        // Buscar todos os participants desses appointments
        $participants = DB::table('appointment_participants')
            ->join('users', 'appointment_participants.participant_id', '=', 'users.id')
            ->whereIn('appointment_id', $appointments->pluck('id'))
            ->select('appointment_participants.id','appointment_id', 'users.name', 'share_percentage', 'payment_status', 'aceito_status')
            ->get();

        // Anexar participants ao appointment correspondente
        $appointments = $appointments->map(function ($appt) use ($participants) {
            $appt->participants = $participants
                ->where('appointment_id', $appt->id)
                ->values(); // reorganiza índices
            return $appt;
        });

        return response()->json([
            'appointments' => $appointments,
            'errors' => []
        ], 200);
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
                            'payment_status'   => $participant['payment_status'] ?? 'pendente',
                            'aceito_status'  => $participant['aceito_status'] ?? 'pendente',
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

        if ($appointment = $this->appointment->with(['participants', 'dependent'])->find($id)) {;

            return response()->json(['appointment' => $appointment, 'errors' => []], 200);
        }

        return response()->json(['errors' => ['error' => 'Registro não encontrado.']], 404);
    }
    

    /************************************************************************************/
    public function destroy($id) {

         if($appointment = $this->appointment->find($id)) {      
            
            if($appointment->delete()) {

                return response()->json(['msg' => 'Registro removido com sucesso!'], 200);
            }
            
            return response()->json([ 'errors' => ['error' => 'Erro ao excluir o registro']], 404);
        }

        return response()->json(['errors' => ['error' => 'Registro não encontrado.']], 404);
    }
}
