import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import FormField from '@/Components/Form/FormField';
import AlertError from '@/Components/Feedback/AlertError';
import Input from '@/Components/Form/Input';
import Select from '@/Components/Form/Select';
import PageHeading from '@/Components/DataDisplay/PageHeading';
import { formatCurrency, formatPercent, toPercentInput, fromPercentInput } from '@/Utils/format';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calculator as CalculatorIcon, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

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
    const [showAdvanced, setShowAdvanced] = useState(false);

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
        <AuthenticatedLayout header={<PageHeading title="Calculadora de Custo — 1 Peça" icon={CalculatorIcon} />}>
            <Head title="Calculadora" />

            <div className="space-y-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Escolha a impressora e o material, preencha os campos e veja o resultado em tempo real, sem recarregar a página.
                </p>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card title="Dados da peça">
                        <form onSubmit={handleCalculate} className="space-y-4">
                            <AlertError message={error} />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField label="Impressora">
                                    <Select required value={form.printer_id} onChange={updateField('printer_id')}>
                                        <option value="" disabled>Selecione...</option>
                                        {printers.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField label="Material">
                                    <Select required value={form.material_id} onChange={updateField('material_id')}>
                                        <option value="" disabled>Selecione...</option>
                                        {materials.map((m) => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField label="Peso da peça (g)">
                                    <Input type="number" step="0.01" required value={form.piece_weight_g} onChange={updateField('piece_weight_g')} />
                                </FormField>
                                <FormField label="Tempo de impressão (h)">
                                    <Input type="number" step="0.01" required value={form.print_time_h} onChange={updateField('print_time_h')} />
                                </FormField>
                                <FormField label="Mão de obra (R$)">
                                    <Input type="number" step="0.01" required value={form.labor_cost} onChange={updateField('labor_cost')} />
                                </FormField>
                                <FormField label="Custos fixos extras (R$)">
                                    <Input type="number" step="0.01" required value={form.extra_fixed_costs} onChange={updateField('extra_fixed_costs')} />
                                </FormField>
                                <FormField label="Quantidade (orçamento)">
                                    <Input type="number" min="1" value={form.quantity} onChange={updateField('quantity')} />
                                </FormField>
                            </div>

                            <div className="rounded-xl border border-slate-200 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowAdvanced((v) => !v)}
                                    className="focus-ring flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Sobrescrever parâmetros gerais (opcional)
                                    <motion.span animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                        <ChevronDown size={16} />
                                    </motion.span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {showAdvanced && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 gap-4 border-t border-slate-200 p-3.5 sm:grid-cols-2 dark:border-white/10">
                                                <FormField label="% material extra">
                                                    <Input type="number" step="0.01" value={form.extra_material_pct} onChange={updateField('extra_material_pct')} />
                                                </FormField>
                                                <FormField label="% perdas/falhas">
                                                    <Input type="number" step="0.01" value={form.failure_pct} onChange={updateField('failure_pct')} />
                                                </FormField>
                                                <FormField label="% impostos">
                                                    <Input type="number" step="0.01" value={form.tax_pct} onChange={updateField('tax_pct')} />
                                                </FormField>
                                                <FormField label="% taxas/cartão">
                                                    <Input type="number" step="0.01" value={form.fee_pct} onChange={updateField('fee_pct')} />
                                                </FormField>
                                                <FormField label="% margem de lucro">
                                                    <Input type="number" step="0.01" value={form.margin_pct} onChange={updateField('margin_pct')} />
                                                </FormField>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={loading ? {} : { y: -1 }}
                                whileTap={loading ? {} : { scale: 0.98 }}
                                className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-600 to-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors hover:from-brand-500 hover:to-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? 'Calculando...' : 'Calcular custo'}
                            </motion.button>
                        </form>
                    </Card>

                    <Card title="Resultado do cálculo">
                        <AnimatePresence mode="wait">
                            {!result ? (
                                <motion.p
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-sm text-slate-500 dark:text-slate-400"
                                >
                                    Preencha os dados e clique em calcular.
                                </motion.p>
                            ) : (
                                <motion.div
                                    key={JSON.stringify(result)}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-4"
                                >
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

                                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/5">
                                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            Preço mínimo (custo + margem simples)
                                        </p>
                                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                            {formatCurrency(result.min_price_simple_markup)}
                                        </p>
                                    </div>

                                    <motion.div
                                        initial={{ scale: 0.97 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="relative overflow-hidden rounded-xl bg-linear-to-br from-emerald-50 to-emerald-100/50 p-4 dark:from-emerald-500/10 dark:to-emerald-500/5"
                                    >
                                        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                                            <Sparkles size={13} /> Preço sugerido (markup c/ impostos e taxas)
                                        </p>
                                        <p className="text-2xl font-bold text-emerald-700 sm:text-3xl dark:text-emerald-300">
                                            {formatCurrency(result.suggested_price_per_unit)}
                                        </p>
                                        <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">
                                            Impostos: {formatCurrency(result.tax_amount)} · Taxa: {formatCurrency(result.fee_amount)} · Lucro:{' '}
                                            {formatCurrency(result.profit_per_unit)}
                                        </p>
                                    </motion.div>

                                    {result.denominator_warning && (
                                        <AlertError message="A soma de impostos + taxas + margem está igual ou acima de 100%. Ajuste os parâmetros." />
                                    )}

                                    {form.quantity > 1 && (
                                        <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                                            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                Preço total do pedido ({result.quantity} un.)
                                            </p>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {formatCurrency(result.total_price)}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Row({ label, value, strong }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/5">
            <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
            <dd className={strong ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}>{value}</dd>
        </div>
    );
}
