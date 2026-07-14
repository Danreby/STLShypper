import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import FormField from '@/Components/Form/FormField';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import StatCard from '@/Components/DataDisplay/StatCard';
import Input from '@/Components/Form/Input';
import Select from '@/Components/Form/Select';
import DataTable from '@/Components/DataDisplay/DataTable';
import FilterBar from '@/Components/FilterBar';
import Modal from '@/Components/Overlays/Modal';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import PageHeading from '@/Components/DataDisplay/PageHeading';
import ExportExcel from '@/Components/ExportExcel';
import useResourceForm from '@/Hooks/useResourceForm';
import { formatCurrency } from '@/Utils/format';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';

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

export default function Products({ products, printers, materials, filters, totals }) {
    const { flash } = usePage().props;
    const { data, setData, errors, processing, editingId, showModal, openCreate, startEdit, closeModal, submit, destroy } = useResourceForm({
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
        <>
            <Head title="Produtos" />

            <div className="space-y-6">
                <AnimatePresence>{flash?.success && <AlertSuccess message={flash.success} />}</AnimatePresence>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                        <StatCard label="Receita total estimada" value={totals.total_revenue} format={formatCurrency} accent />
                        <StatCard label="Lucro total estimado" value={totals.total_profit} format={formatCurrency} accent delay={0.05} />
                    </div>
                    <div className="flex items-center justify-end sm:justify-center">
                        <ExportExcel />
                    </div>
                </div>

                <Card
                    title="Produtos cadastrados"
                    subtitle="Custo e preço sugerido calculados automaticamente para cada produto."
                    action={
                        <PrimaryButton onClick={openCreate}>
                            <Plus size={16} /> Novo produto
                        </PrimaryButton>
                    }
                >
                    <FilterBar
                        routeName="products.index"
                        filters={filters}
                        searchPlaceholder="Buscar por nome..."
                        selects={[
                            {
                                name: 'printer_id',
                                label: 'Impressora',
                                allLabel: 'Todas as impressoras',
                                options: printers.map((p) => ({ value: String(p.id), label: p.name })),
                            },
                            {
                                name: 'material_id',
                                label: 'Material',
                                allLabel: 'Todos os materiais',
                                options: materials.map((m) => ({ value: String(m.id), label: m.name })),
                            },
                        ]}
                    />

                    <DataTable
                        columns={columns}
                        rows={products}
                        emptyMessage="Nenhum produto encontrado."
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

            <Modal show={showModal} onClose={closeModal} maxWidth="3xl">
                <form onSubmit={submit} className="p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {editingId ? 'Editar produto' : 'Novo produto'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {editingId ? 'Atualize os dados do produto.' : 'Preencha os dados do novo produto.'}
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <FormField label="Nome do produto" error={errors.name} className="sm:col-span-2 lg:col-span-4">
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
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
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {editingId ? 'Salvar alterações' : 'Adicionar produto'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}

Products.layout = (page) => <AuthenticatedLayout header={<PageHeading title="Tabela de Produtos" icon={Package} />}>{page}</AuthenticatedLayout>;
