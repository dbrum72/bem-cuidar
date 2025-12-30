<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class UserSaveRequest extends FormRequest {

    public function authorize(): bool {

        return true;
    }

    public function rules(): array {

        $userId = $this->route('id');

        $rules = [
            'name' => ['required','string','max:255'],
            'email' => ['required','email',Rule::unique('users', 'email')->ignore($userId)],
            'password' => $userId ? ['nullable','string','min:8'] : ['required','string','min:8'],
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
            'min' => 'Campo deve possuir no mínimo 8 caracteres.',
            'email' => 'Email inválido.',
            'unique' => 'O dado informado já existe.'            
        ];        
    }
}
