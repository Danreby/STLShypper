<?php

namespace App\Http\Requests\Setting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kwh_price' => ['required', 'numeric', 'min:0'],
            'labor_rate' => ['required', 'numeric', 'min:0'],
            'failure_pct' => ['required', 'numeric', 'min:0', 'max:0.9999'],
            'extra_material_pct' => ['required', 'numeric', 'min:0', 'max:1'],
            'tax_pct' => ['required', 'numeric', 'min:0', 'max:1'],
            'fee_pct' => ['required', 'numeric', 'min:0', 'max:1'],
            'margin_pct' => ['required', 'numeric', 'min:0', 'max:1'],
            'hours_per_year' => ['required', 'integer', 'min:1'],
        ];
    }
}
