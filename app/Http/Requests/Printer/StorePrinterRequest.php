<?php

namespace App\Http\Requests\Printer;

use Illuminate\Foundation\Http\FormRequest;

class StorePrinterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'purchase_price' => ['required', 'numeric', 'min:0', 'max:500000'],
            'useful_life_hours' => ['required', 'integer', 'min:1', 'max:100000'],
            'power_w' => ['required', 'integer', 'min:1', 'max:20000'],
            'annual_maintenance' => ['required', 'numeric', 'min:0', 'max:100000'],
            'purchase_url' => ['nullable', 'url', 'max:2048'],
        ];
    }
}
