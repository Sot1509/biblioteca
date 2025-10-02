<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
    return [
        'title' => ['sometimes','required','string','max:255'],
        'author'=> ['sometimes','required','string','max:255'],
        'genre' => ['sometimes','nullable','string','max:100'],
        'total_copies' => ['sometimes','required','integer','min:1'],
        'available_copies' => ['sometimes','required','integer','min:0','lte:total_copies'],
    ];
}

}
