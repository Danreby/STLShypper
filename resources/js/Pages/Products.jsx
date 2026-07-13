import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertSuccess from '@/Components/AlertSuccess';
import StatCard from '@/Components/StatCard';
import { formatCurrency } from '@/Utils/format';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500';

const emptyForm = {
    name: '',
    printer_id: '',
    material_id: '',
    piece_weight_g: '',
    print_time_h: '',
    labor_cost: '',
    extra_fixed_costs: '',
    quantity: 1,
};

export default function Products({ products, printers, materials, totals }) {
    const { flash } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, patch, processing, errors, reset } = useForm(emptyForm);

    function startEdit(product) {
        setEditingId(product.id);
        setData({
            name: product.name,
            printer_id: product.printer_id ?? '',
            material_id: product.material_id ?? '',
            piece_weight_g: product.piece_weight_g,
            print_time_h: product.print_time_h,
            labor_cost: product.labor_cost,
            extra_fixed_costs: product.extra_fixed_costs,
            quantity: product.quantity,
        });
    }

    function cancelEdit() {
        setEditingId(null);
        reset();
    }

    function submit(e) {
        e.preventDefault();
        if (editingId) {
            patch(`/produtos/${editingId}`, { preserveScroll: true, onSuccess: () => cancelEdit() });
        } else {
            post('/produtos', { preserveScroll: true, onSuccess: () => reset() });
        }
    }

    function destroy(product) {
        if (!confirm(`Remover o produto "${product.name}"?`)) return;
        router.delete(`/produtos/${product.id}`, { preserveScroll: true });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-800">Tabela de Produtos</h2>}>
            <Head title="Produtos" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && <AlertSuccess message={flash.success} />}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard label="Receita total estimada" value={formatCurrency(totals.total_revenue)} accent />
                    <StatCard label="Lucro total estimado" value={formatCurrency(totals.total_profit)} accent />
                </div>

                <Card title={editingId ? 'Editar produto' : 'Novo produto'}>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <FormField label="Nome do produto" error={errors.name}>
                            <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </FormField>
                        <FormField label="Impressora" error={errors.printer_id}>
                            <select className={inputClass} value={data.printer_id} onChange={(e) => setData('printer_id', e.target.value)}>
                                <option value="">Selecione...</option>
                                {printers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Material" error={errors.material_id}>
                            <select className={inputClass} value={data.material_id} onChange={(e) => setData('material_id', e.target.value)}>
                                <option value="">Selecione...</option>
                                {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Quantidade" error={errors.quantity}>
                            <input type="number" min="1" className={inputClass} value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} />
                        </FormField>
                        <FormField label="Peso (g)" error={errors.piece_weight_g}>
                            <input type="number" step="0.01" className={inputClass} value={data.piece_weight_g} onChange={(e) => setData('piece_weight_g', e.target.value)} />
                        </FormField>
                        <FormField label="Tempo de impressão (h)" error={errors.print_time_h}>
                            <input type="number" step="0.01" className={inputClass} value={data.print_time_h} onChange={(e) => setData('print_time_h', e.target.value)} />
                        </FormField>
                        <FormField label="Mão de obra (R$)" error={errors.labor_cost}>
                            <input type="number" step="0.01" className={inputClass} value={data.labor_cost} onChange={(e) => setData('labor_cost', e.target.value)} />
                        </FormField>
                        <FormField label="Custos fixos extras (R$)" error={errors.extra_fixed_costs}>
                            <input type="number" step="0.01" className={inputClass} value={data.extra_fixed_costs} onChange={(e) => setData('extra_fixed_costs', e.target.value)} />
                        </FormField>
                        <div className="flex items-end gap-2 lg:col-span-4">
                            <button type="submit" disabled={processing} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
                                {editingId ? 'Salvar alterações' : 'Adicionar produto'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </Card>

                <Card title="Produtos cadastrados">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                    <th className="py-2 pr-4">Produto</th>
                                    <th className="py-2 pr-4">Impressora</th>
                                    <th className="py-2 pr-4">Material</th>
                                    <th className="py-2 pr-4">Qtd.</th>
                                    <th className="py-2 pr-4">Custo unitário</th>
                                    <th className="py-2 pr-4">Preço sugerido</th>
                                    <th className="py-2 pr-4">Lucro total</th>
                                    <th className="py-2 pr-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} className="border-b border-slate-100">
                                        <td className="py-2 pr-4 font-medium text-slate-800">{p.name}</td>
                                        <td className="py-2 pr-4 text-slate-500">{p.printer_name ?? '—'}</td>
                                        <td className="py-2 pr-4 text-slate-500">{p.material_name ?? '—'}</td>
                                        <td className="py-2 pr-4">{p.quantity}</td>
                                        <td className="py-2 pr-4">{formatCurrency(p.pricing.cost_with_losses)}</td>
                                        <td className="py-2 pr-4 font-semibold text-emerald-700">{formatCurrency(p.pricing.suggested_price_per_unit)}</td>
                                        <td className="py-2 pr-4">{formatCurrency(p.pricing.total_profit)}</td>
                                        <td className="py-2 pr-4 text-right">
                                            <button onClick={() => startEdit(p)} className="mr-3 text-slate-600 hover:underline">Editar</button>
                                            <button onClick={() => destroy(p)} className="text-red-600 hover:underline">Remover</button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr><td colSpan={8} className="py-4 text-center text-slate-400">Nenhum produto cadastrado ainda.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
