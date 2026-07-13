import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertError from '@/Components/AlertError';
import { formatCurrency, formatPercent, toPercentInput, fromPercentInput } from '@/Utils/format';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500';

export default function Calculator({ printers, materials, settings }) {
    const [form, setForm] = useState({
        printer_id: printers[0]?.id ?? '',
        material_id: materials[0]?.id ?? '',
        piece_weight_g: 50,
        print_time_h: 3,
        labor_cost: 5,
        extra_fixed_costs: 2,
        quantity: 1,
        extra_material_pct: toPercentInput(settings.extra_material_pct),
        failure_pct: toPercentInput(settings.failure_pct),
        tax_pct: toPercentInput(settings.tax_pct),
        fee_pct: toPercentInput(settings.fee_pct),
        margin_pct: toPercentInput(settings.margin_pct),
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function updateField(field) {
        return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
    }

    // Chamada axios (JSON) para a rota /calculadora/calcular — cálculo em
    // tempo real, sem navegação de página (diferente do Inertia, que é
    // usado para o restante da navegação do app).
    async function handleCalculate(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = {
                ...form,
                extra_material_pct: fromPercentInput(form.extra_material_pct),
                failure_pct: fromPercentInput(form.failure_pct),
                tax_pct: fromPercentInput(form.tax_pct),
                fee_pct: fromPercentInput(form.fee_pct),
                margin_pct: fromPercentInput(form.margin_pct),
            };
            const { data } = await axios.post('/calculadora/calcular', payload);
            setResult(data.result);
        } catch (err) {
            setError(err.response?.data?.message || 'Não foi possível calcular.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-800">Calculadora de Custo — 1 Peça</h2>}>
            <Head title="Calculadora" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <p className="text-sm text-slate-500">
                    Escolha a impressora e o material, preencha os campos e veja o resultado em tempo real (via axios, sem recarregar a página).
                </p>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card title="Dados da peça">
                        <form onSubmit={handleCalculate} className="space-y-4">
                            <AlertError message={error} />

                            <FormField label="Impressora">
                                <select required className={inputClass} value={form.printer_id} onChange={updateField('printer_id')}>
                                    <option value="" disabled>Selecione...</option>
                                    {printers.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </FormField>

                            <FormField label="Material">
                                <select required className={inputClass} value={form.material_id} onChange={updateField('material_id')}>
                                    <option value="" disabled>Selecione...</option>
                                    {materials.map((m) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </FormField>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Peso da peça (g)">
                                    <input type="number" step="0.01" required className={inputClass} value={form.piece_weight_g} onChange={updateField('piece_weight_g')} />
                                </FormField>
                                <FormField label="Tempo de impressão (h)">
                                    <input type="number" step="0.01" required className={inputClass} value={form.print_time_h} onChange={updateField('print_time_h')} />
                                </FormField>
                                <FormField label="Mão de obra (R$)">
                                    <input type="number" step="0.01" required className={inputClass} value={form.labor_cost} onChange={updateField('labor_cost')} />
                                </FormField>
                                <FormField label="Custos fixos extras (R$)">
                                    <input type="number" step="0.01" required className={inputClass} value={form.extra_fixed_costs} onChange={updateField('extra_fixed_costs')} />
                                </FormField>
                                <FormField label="Quantidade (orçamento)">
                                    <input type="number" min="1" className={inputClass} value={form.quantity} onChange={updateField('quantity')} />
                                </FormField>
                            </div>

                            <details className="rounded-md border border-slate-200 p-3">
                                <summary className="cursor-pointer text-sm font-medium text-slate-700">
                                    Sobrescrever parâmetros gerais (opcional)
                                </summary>
                                <div className="mt-3 grid grid-cols-2 gap-4">
                                    <FormField label="% material extra">
                                        <input type="number" step="0.01" className={inputClass} value={form.extra_material_pct} onChange={updateField('extra_material_pct')} />
                                    </FormField>
                                    <FormField label="% perdas/falhas">
                                        <input type="number" step="0.01" className={inputClass} value={form.failure_pct} onChange={updateField('failure_pct')} />
                                    </FormField>
                                    <FormField label="% impostos">
                                        <input type="number" step="0.01" className={inputClass} value={form.tax_pct} onChange={updateField('tax_pct')} />
                                    </FormField>
                                    <FormField label="% taxas/cartão">
                                        <input type="number" step="0.01" className={inputClass} value={form.fee_pct} onChange={updateField('fee_pct')} />
                                    </FormField>
                                    <FormField label="% margem de lucro">
                                        <input type="number" step="0.01" className={inputClass} value={form.margin_pct} onChange={updateField('margin_pct')} />
                                    </FormField>
                                </div>
                            </details>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                {loading ? 'Calculando...' : 'Calcular custo'}
                            </button>
                        </form>
                    </Card>

                    <Card title="Resultado do cálculo">
                        {!result ? (
                            <p className="text-sm text-slate-500">Preencha os dados e clique em calcular.</p>
                        ) : (
                            <div className="space-y-4">
                                <dl className="space-y-2 text-sm">
                                    <Row label="Custo do material" value={formatCurrency(result.material_cost)} />
                                    <Row label="Custo de energia" value={formatCurrency(result.energy_cost)} />
                                    <Row label="Custo de depreciação/manutenção" value={formatCurrency(result.machine_cost)} />
                                    <Row label="Mão de obra" value={formatCurrency(result.labor_cost)} />
                                    <Row label="Custos fixos extras" value={formatCurrency(result.extra_fixed_costs)} />
                                    <Row label="Subtotal de custos" value={formatCurrency(result.subtotal_cost)} strong />
                                    <Row label={`Perdas/falhas (${formatPercent(result.failure_pct)})`} value="" />
                                    <Row label="Custo total com perdas" value={formatCurrency(result.cost_with_losses)} strong />
                                </dl>

                                <div className="rounded-md bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Preço mínimo (custo + margem simples)</p>
                                    <p className="text-lg font-semibold text-slate-700">{formatCurrency(result.min_price_simple_markup)}</p>
                                </div>

                                <div className="rounded-md bg-emerald-50 p-4">
                                    <p className="text-xs uppercase tracking-wide text-emerald-700">
                                        Preço sugerido (markup c/ impostos e taxas)
                                    </p>
                                    <p className="text-2xl font-bold text-emerald-700">{formatCurrency(result.suggested_price_per_unit)}</p>
                                    <p className="mt-1 text-xs text-emerald-700">
                                        Impostos: {formatCurrency(result.tax_amount)} · Taxa: {formatCurrency(result.fee_amount)} · Lucro: {formatCurrency(result.profit_per_unit)}
                                    </p>
                                </div>

                                {result.denominator_warning && (
                                    <AlertError message="A soma de impostos + taxas + margem está igual ou acima de 100%. Ajuste os parâmetros." />
                                )}

                                {form.quantity > 1 && (
                                    <div className="rounded-md border border-slate-200 p-4">
                                        <p className="text-xs uppercase tracking-wide text-slate-500">
                                            Preço total do pedido ({result.quantity} un.)
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900">{formatCurrency(result.total_price)}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Row({ label, value, strong }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <dt className="text-slate-500">{label}</dt>
            <dd className={strong ? 'font-semibold text-slate-900' : 'text-slate-700'}>{value}</dd>
        </div>
    );
}
