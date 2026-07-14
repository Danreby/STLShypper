import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertSuccess from '@/Components/AlertSuccess';
import StatCard from '@/Components/StatCard';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import DataTable from '@/Components/DataTable';
import useResourceForm from '@/Hooks/useResourceForm';
import { formatCurrency } from '@/Utils/format';
import { Head, usePage } from '@inertiajs/react';

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

const columns = [
    { key: 'name', header: 'Produto' },
    { key: 'printer_name', header: 'Impressora', render: (p) => p.printer_name ?? '—', className: 'py-2 pr-4 text-slate-500' },
    { key: 'material_name', header: 'Material', render: (p) => p.material_name ?? '—', className: 'py-2 pr-4 text-slate-500' },
    { key: 'quantity', header: 'Qtd.' },
    { key: 'cost', header: 'Custo unitário', render: (p) => formatCurrency(p.pricing.cost_with_losses) },
    { key: 'price', header: 'Preço sugerido', render: (p) => formatCurrency(p.pricing.suggested_price_per_unit), className: 'py-2 pr-4 font-semibold text-emerald-700' },
    { key: 'profit', header: 'Lucro total', render: (p) => formatCurrency(p.pricing.total_profit) },
];

export default function Products({ products, printers, materials, totals }) {
    const { flash } = usePage().props;
    const { data, setData, errors, processing, editingId, startEdit, cancelEdit, submit, destroy } = useResourceForm({
        emptyForm,
        storeUrl: '/produtos',
        updateUrl: (id) => `/produtos/${id}`,
        deleteUrl: (id) => `/produtos/${id}`,
        mapRowToForm: (product) => ({
            name: product.name,
            printer_id: product.printer_id ?? '',
            material_id: product.material_id ?? '',
            piece_weight_g: product.piece_weight_g,
            print_time_h: product.print_time_h,
            labor_cost: product.labor_cost,
            extra_fixed_costs: product.extra_fixed_costs,
            quantity: product.quantity,
        }),
    });

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
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </FormField>
                        <FormField label="Impressora" error={errors.printer_id}>
                            <Select value={data.printer_id} onChange={(e) => setData('printer_id', e.target.value)}>
                                <option value="">Selecione...</option>
                                {printers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </Select>
                        </FormField>
                        <FormField label="Material" error={errors.material_id}>
                            <Select value={data.material_id} onChange={(e) => setData('material_id', e.target.value)}>
                                <option value="">Selecione...</option>
                                {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </Select>
                        </FormField>
                        <FormField label="Quantidade" error={errors.quantity}>
                            <Input type="number" min="1" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} />
                        </FormField>
                        <FormField label="Peso (g)" error={errors.piece_weight_g}>
                            <Input type="number" step="0.01" value={data.piece_weight_g} onChange={(e) => setData('piece_weight_g', e.target.value)} />
                        </FormField>
                        <FormField label="Tempo de impressão (h)" error={errors.print_time_h}>
                            <Input type="number" step="0.01" value={data.print_time_h} onChange={(e) => setData('print_time_h', e.target.value)} />
                        </FormField>
                        <FormField label="Mão de obra (R$)" error={errors.labor_cost}>
                            <Input type="number" step="0.01" value={data.labor_cost} onChange={(e) => setData('labor_cost', e.target.value)} />
                        </FormField>
                        <FormField label="Custos fixos extras (R$)" error={errors.extra_fixed_costs}>
                            <Input type="number" step="0.01" value={data.extra_fixed_costs} onChange={(e) => setData('extra_fixed_costs', e.target.value)} />
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
                    <DataTable
                        columns={columns}
                        rows={products}
                        emptyMessage="Nenhum produto cadastrado ainda."
                        actions={(p) => (
                            <>
                                <button onClick={() => startEdit(p)} className="mr-3 text-slate-600 hover:underline">Editar</button>
                                <button onClick={() => destroy(p, `Remover o produto "${p.name}"?`)} className="text-red-600 hover:underline">Remover</button>
                            </>
                        )}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
