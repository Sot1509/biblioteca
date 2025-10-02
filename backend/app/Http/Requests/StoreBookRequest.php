<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
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
    'title' => ['required','string','max:255'],
    'author'=> ['required','string','max:255'],
    'genre' => ['nullable','string','max:100'],
    'total_copies' => ['required','integer','min:1'],
    'available_copies' => ['required','integer','min:0','lte:total_copies'],
  ];
}

}
