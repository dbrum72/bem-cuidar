<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class RelationshipSaveRequest extends FormRequest {

    public function authorize(): bool {

        return true;
    }

    public function rules(): array {     
        
        $rules = [
            'photo' => ['nullable','file','mimes:jpg,jpeg,png','max:2048'],
        ];

        if($this->method() === 'PATCH') {

            $dinamicRules = [];            

            foreach($rules as $input => $rule) {

                if(array_key_exists($input, $this->request->all())) {

                    $dinamicRules[$input] = $rule;
                }
            }

            return $dinamicRules;
        }

        return $rules;      
    }

    public function messages(): array {       

        return [
            'required' => 'Este campo é obrigatório.',
            'max' => 'Máximo 2048 bytes.',
            'mime' => 'Formato inválido. Apenas jpg, jpeg e png são aceitos.',
            'file' => 'O campo deve ser um arquivo.'
        ];        
    }
}