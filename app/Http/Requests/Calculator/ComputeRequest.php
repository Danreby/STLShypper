<?php

namespace App\Http\Requests\Calculator;

use Illuminate\Foundation\Http\FormRequest;

class ComputeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'piece_weight_g' => ['required', 'numeric', 'min:0'],
            'print_time_h' => ['required', 'numeric', 'min:0'],
            'labor_cost' => ['nullable', 'numeric', 'min:0'],
            'extra_fixed_costs' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'printer_id' => ['nullable', 'integer'],
            'material_id' => ['nullable', 'integer'],
            'extra_material_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'failure_pct' => ['nullable', 'numeric', 'min:0', 'max:0.9999'],
            'tax_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'fee_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'margin_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
        ];
    }
}
