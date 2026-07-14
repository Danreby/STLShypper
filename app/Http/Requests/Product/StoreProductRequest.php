<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'printer_id' => [
                'nullable', 'integer',
                Rule::exists('printers', 'id')->where('user_id', $userId),
            ],
            'material_id' => [
                'nullable', 'integer',
                Rule::exists('materials', 'id')->where('user_id', $userId),
            ],
            'piece_weight_g' => ['required', 'numeric', 'min:0'],
            'print_time_h' => ['required', 'numeric', 'min:0'],
            'labor_cost' => ['required', 'numeric', 'min:0'],
            'extra_fixed_costs' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:1'],
            'extra_material_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'failure_pct' => ['nullable', 'numeric', 'min:0', 'max:0.9999'],
            'tax_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'fee_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'margin_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
        ];
    }
}
