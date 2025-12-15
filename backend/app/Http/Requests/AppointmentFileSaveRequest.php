<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class AppointmentFileSaveRequest extends FormRequest {

    public function authorize(): bool {

        return true;
    }

    public function rules(): array {     
        
        return $rules = [
            'appointment_id' => 'exists:appointments,id',
            'attachments.*' => 'required|file|max:10240' // 10 MB
        ];    
    }

    public function messages(): array {       

        return [
            'required' => 'Este campo é obrigatório.',
            'exists' => 'O evento informado não existe.',
            'max' => 'Máximo 10 Mb.',
            'file' => 'Formato inválido. Apenas arquivos são aceitos.'
        ];        
    }
}