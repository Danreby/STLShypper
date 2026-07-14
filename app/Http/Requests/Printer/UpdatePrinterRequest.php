<?php

namespace App\Http\Requests\Printer;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePrinterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'useful_life_hours' => ['required', 'integer', 'min:1'],
            'power_w' => ['required', 'integer', 'min:1'],
            'annual_maintenance' => ['required', 'numeric', 'min:0'],
            'purchase_url' => ['nullable', 'url', 'max:2048'],
        ];
    }
}
