<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class TutorInviteCreateRequest extends FormRequest {

    public function authorize(): bool {

        return true;
    }

    public function rules(): array {

        $rules = [            
            'email' => ['required','email'],
            'message' => ['nullable','string','max:1000']
        ];

        return $rules;
    }

    public function messages(): array {       

        return [
            'required' => 'Este campo é obrigatório.',
            'email' => 'Email inválido.',
            'max' => 'O campo deve ter no máximo 1000 caracteres.'          
        ];        
    }
}
