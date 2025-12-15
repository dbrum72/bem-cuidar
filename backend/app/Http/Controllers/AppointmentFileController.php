<?php

namespace App\Http\Controllers;

use App\Models\AppointmentFile;
use App\Models\Appointment;
use App\Http\Requests\AppointmentFileSaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AppointmentFileController extends Controller {

    /************************************************************************************/

    public function store(AppointmentFileSaveRequest $request) {

        $appointment = Appointment::find($request->appointment_id);

        if (!$appointment) {
            return response()->json(['error' => 'Agendamento não encontrado'], 404);
        }

        if (!$request->hasFile('attachments')) {
            return response()->json(['error' => 'Nenhum arquivo enviado'], 422);
        }

        $attachments = $request->file('attachments');

        // Normalização para array
        if (!is_array($attachments)) {
            $attachments = [$attachments];
        }

        foreach ($attachments as $file) {

            $filename = str_shuffle(time() . Str::random(10)) . '.' . $file->getClientOriginalExtension();

            // Armazena corretamente no disco "public"
            $file->storeAs('appointments', $filename, 'public');

            // Salva no banco com nome da coluna correto
            AppointmentFile::create([
                'appointment_id' => $appointment->id,
                'filename'       => $filename,
            ]);
        }

        return response()->json(['message' => 'uploaded'], 200);
    }
}