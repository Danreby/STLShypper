import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertSuccess from '@/Components/AlertSuccess';
import StatCard from '@/Components/StatCard';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PageHeading from '@/Components/PageHeading';
import useResourceForm from '@/Hooks/useResourceForm';
import { formatCurrency } from '@/Utils/format';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { Package, Pencil, Trash2 } from 'lucide-react';

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
    { key: 'printer_name', header: 'Impressora', render: (p) => p.printer_name ?? '—', className: 'py-2.5 pr-4 text-slate-500 dark:text-slate-400' },
    { key: 'material_name', header: 'Material', render: (p) => p.material_name ?? '—', className: 'py-2.5 pr-4 text-slate-500 dark:text-slate-400' },
    { key: 'quantity', header: 'Qtd.' },
    { key: 'cost', header: 'Custo unitário', render: (p) => formatCurrency(p.pricing.cost_with_losses) },
    {
        key: 'price',
        header: 'Preço sugerido',
        render: (p) => formatCurrency(p.pricing.suggested_price_per_unit),
        className: 'py-2.5 pr-4 font-semibold text-emerald-600 dark:text-emerald-400',
    },
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
        <AuthenticatedLayout header={<PageHeading title="Tabela de Produtos" icon={Package} />}>
            <Head title="Produtos" />

            <div className="space-y-6">
                <AnimatePresence>{flash?.success && <AlertSuccess message={flash.success} />}</AnimatePresence>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard label="Receita total estimada" value={totals.total_revenue} format={formatCurrency} accent />
                    <StatCard label="Lucro total estimado" value={totals.total_profit} format={formatCurrency} accent delay={0.05} />
                </div>

                <Card title={editingId ? 'Editar produto' : 'Novo produto'} delay={0.05}>
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
                        <div className="flex items-center gap-2 lg:col-span-4">
                            <PrimaryButton type="submit" disabled={processing}>
                                {editingId ? 'Salvar alterações' : 'Adicionar produto'}
                            </PrimaryButton>
                            {editingId && <SecondaryButton onClick={cancelEdit}>Cancelar</SecondaryButton>}
                        </div>
                    </form>
                </Card>

                <Card title="Produtos cadastrados" delay={0.1}>
                    <DataTable
                        columns={columns}
                        rows={products}
                        emptyMessage="Nenhum produto cadastrado ainda."
                        actions={(p) => (
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    onClick={() => startEdit(p)}
                                    title="Editar"
                                    className="focus-ring rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-accent-400"
                                >
                                    <Pencil size={15} />
                                </button>
                                <button
                                    onClick={() => destroy(p, `Remover o produto "${p.name}"?`)}
                                    title="Remover"
                                    className="focus-ring rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        )}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
