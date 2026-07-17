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
        $isComposite = is_array($this->input('parts')) && count($this->input('parts')) > 0;

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
            'piece_weight_g' => [Rule::requiredIf(! $isComposite), 'nullable', 'numeric', 'min:0.01', 'max:50000'],
            'print_time_h' => [Rule::requiredIf(! $isComposite), 'nullable', 'numeric', 'min:0.01', 'max:1000'],
            'labor_cost' => ['required', 'numeric', 'min:0', 'max:100000'],
            'extra_fixed_costs' => ['required', 'numeric', 'min:0', 'max:100000'],
            'quantity' => ['required', 'integer', 'min:1', 'max:100000'],
            'extra_material_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'failure_pct' => ['nullable', 'numeric', 'min:0', 'max:0.9999'],
            'tax_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'fee_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'margin_pct' => ['nullable', 'numeric', 'min:0', 'max:1'],

            // Produto composto: várias impressões separadas (ex.: cabeça, pernas, braços).
            'parts' => ['nullable', 'array'],
            'parts.*.name' => ['required', 'string', 'max:255'],
            'parts.*.printer_id' => [
                'nullable', 'integer',
                Rule::exists('printers', 'id')->where('user_id', $userId),
            ],
            'parts.*.material_id' => [
                'nullable', 'integer',
                Rule::exists('materials', 'id')->where('user_id', $userId),
            ],
            'parts.*.piece_weight_g' => ['required', 'numeric', 'min:0.01', 'max:50000'],
            'parts.*.print_time_h' => ['required', 'numeric', 'min:0.01', 'max:1000'],
            'parts.*.quantity_per_unit' => ['nullable', 'integer', 'min:1', 'max:1000'],
        ];
    }
}
