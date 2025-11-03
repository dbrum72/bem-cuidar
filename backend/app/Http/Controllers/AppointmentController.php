<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Repositories\AppointmentRepository;
use App\Http\Requests\AppointmentSaveRequest;
use Illuminate\Http\Request;

class AppointmentController extends Controller {

    public function __construct(Appointment $appointment) {

        $this->appointment = $appointment;
    }   

    /************************************************************************************/
    public function index(Request $request) {

        $appointmentRepository = new AppointmentRepository($this->appointment);

        if($request->has('with')) {

            $appointmentRepository->selectWith($request->with);
        }  

        if($request->has('filter')) {

            $appointmentRepository->filter($request->filter);
        }

        if($request->has('sort')) {

            $appointmentRepository->sort($request->sort);
        }

        if($appointment = $appointmentRepository->getResultado()) {

            return response()->json([ 'appointments' => $appointment, 'errors' => []], 201);           
        }

        return response()->json(['errors' => ['error' => 'Nenhum registro localizado.']], 404);
    }

    /************************************************************************************/

    public function store(AppointmentSaveRequest $request) {

        if($stored = $this->appointment->create($request->all())) {

            return response()->json([ 'appointment' => $stored, 'errors' => [], 'msg' => 'Registro criado com sucesso!'], 201);
        }

        return response()->json(['errors' => ['error' => 'Erro ao criar o registro']], 404);
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
}
