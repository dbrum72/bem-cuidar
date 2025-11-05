<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class ChildSaveRequest extends FormRequest {

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {

        return true;
    }

    protected function prepareForValidation(): void {
            
        if ($this->user()) {
            $this->merge(['created_by' => $this->user()->id]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {

        $childId = $this->route('child');        

        $rules = [
            'name' => ['required','string','min:3','max:255',Rule::unique('children', 'name')->ignore($childId)],
            'birth_date' => ['required','date'],
            'notes' => ['nullable','string'],
            'created_by' => ['required','exists:users,id']
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
            'min' => 'Campo deve possuir no mínimo 3 caracteres.',
            'max' => 'Máximo 255 caracteres.',
            'date' => 'Data inválida.',
            'unique' => 'O dado informado já existe.'            
        ];        
    }
}