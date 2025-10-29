<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FileStoreRequest extends FormRequest {

    public function authorize(): bool {

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        
        return [
            'file' => ['required','mimes:jpeg,png,avif'],
        ];
    }

     /********************************************************************************************************/

    public function messages(): array {

        return [
            'required' => 'Este campo é obrigatório.',
            'mimes' => 'Este campo deve ser um arquivo do tipo: jpg, jpeg, png ou avif.'
        ];        
    }
}
