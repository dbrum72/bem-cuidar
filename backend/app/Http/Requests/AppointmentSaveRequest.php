<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class AppointmentSaveRequest extends FormRequest {

    public function authorize(): bool {

        return true;
    }

    protected function prepareForValidation(): void {
            
        if ($this->user()) {
            $this->merge(['created_by' => $this->user()->id]);
        }

        if ($this->has('total_expense')) {
            $value = str_replace(',', '.', $this->total_expense);
            $this->merge([
                'total_expense' => $value
            ]);
        }
    }

    public function rules(): array {

        $appointmentId = $this->route('shared-care-events');        

        $rules = [
            //'id' => [Rule::unique('shared_care_events', 'id')->ignore($appointmentId)],
            'dependent_id' => ['required','exists:dependents,id'],
            'title' => ['required','min:3','max:255'],
            'description' => ['nullable'],
            'start_datetime' => ['required','date'],
            'end_datetime' => ['required','date','after_or_equal:start_date'],
            'location' => ['nullable','max:255'],
            'total_expense' => ['required','decimal:2'],
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
            'exists' => 'O valor informado é inválido.',
            'min' => 'Campo deve possuir no mínimo 3 caracteres.',
            'max' => 'Máximo 255 caracteres.',
            'datetime' => 'Data e hora inválida.',
            'after_or_equal' => 'A data e hora de término deve ser igual ou posterior à de início.',
            'decimal' => 'O valor deve ser um número decimal com até duas casas decimais.',
            'datetime' => 'Data inválida.',
            'unique' => 'O dado informado já existe.'            
        ];        
    }
}