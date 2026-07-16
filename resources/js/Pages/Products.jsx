import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import FormField from '@/Components/Form/FormField';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import StatCard from '@/Components/DataDisplay/StatCard';
import Autocomplete from '@/Components/Form/Autocomplete';
import Input from '@/Components/Form/Input';
import DataTable from '@/Components/DataDisplay/DataTable';
import DetailsModal from '@/Components/Overlays/DetailsModal';
import FilterBar from '@/Components/FilterBar';
import Modal from '@/Components/Overlays/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import PageHeading from '@/Components/DataDisplay/PageHeading';
import ExportExcel from '@/Components/ExportExcel';
import useDetailsModal from '@/Hooks/useDetailsModal';
import useResourceForm from '@/Hooks/useResourceForm';
import useSort from '@/Hooks/useSort';
import { formatCurrency } from '@/Utils/format';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    Clock,
    Coins,
    Hash,
    Layers,
    Package,
    Pencil,
    Plus,
    Printer as PrinterFieldIcon,
    Receipt,
    Tag,
    Trash2,
    TrendingUp,
    Users,
    Weight,
} from 'lucide-react';

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
    { key: 'name', header: 'Produto', sortable: true },
    {
        key: 'printer_name',
        header: 'Impressora',
        sortable: true,
        render: (p) => p.printer_name ?? '—',
        className: 'py-2.5 pr-4 text-slate-500 dark:text-slate-400',
    },
    {
        key: 'material_name',
        header: 'Material',
        sortable: true,
        render: (p) => p.material_name ?? '—',
        className: 'py-2.5 pr-4 text-slate-500 dark:text-slate-400',
    },
    { key: 'quantity', header: 'Qtd.', sortable: true },
    { key: 'cost', header: 'Custo unitário', sortable: true, render: (p) => formatCurrency(p.pricing.cost_with_losses) },
    {
        key: 'price',
        header: 'Preço sugerido',
        sortable: true,
        render: (p) =>
            p.pricing.denominator_warning ? (
                <span
                    title="Impostos + taxas + margem somam 100% ou mais. Ajuste os parâmetros gerais (ou os deste produto) para calcular um preço válido."
                    className="inline-flex items-center gap-1 text-red-600 dark:text-red-400"
                >
                    <AlertTriangle size={14} /> Ajustar parâmetros
                </span>
            ) : (
                formatCurrency(p.pricing.suggested_price_per_unit)
            ),
        className: 'py-2.5 pr-4 font-semibold text-emerald-600 dark:text-emerald-400',
    },
    { key: 'profit', header: 'Lucro total', sortable: true, render: (p) => formatCurrency(p.pricing.total_profit) },
];

export default function Products({ products, printers, materials, filters, pagination, totals }) {
    const { flash } = usePage().props;
    const { sort, direction, onSort } = useSort('products.index', filters);
    const details = useDetailsModal();
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
                                searchable: true,
                                options: printers.map((p) => ({ value: String(p.id), label: p.name })),
                            },
                            {
                                name: 'material_id',
                                label: 'Material',
                                allLabel: 'Todos os materiais',
                                searchable: true,
                                options: materials.map((m) => ({ value: String(m.id), label: m.name })),
                            },
                        ]}
                    />

                    <DataTable
                        columns={columns}
                        rows={products}
                        sort={sort}
                        direction={direction}
                        onSort={onSort}
                        emptyMessage="Nenhum produto encontrado."
                        onRowClick={details.view}
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

                    <Pagination routeName="products.index" filters={filters} pagination={pagination} />
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
                        <FormField label="Nome do produto" error={errors.name} icon={Tag} index={0} className="sm:col-span-2 lg:col-span-4">
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                        </FormField>
                        <FormField label="Impressora" error={errors.printer_id} icon={PrinterFieldIcon} index={1}>
                            <Autocomplete
                                value={data.printer_id}
                                onChange={(e) => setData('printer_id', e.target.value)}
                                placeholder="Buscar impressora..."
                            >
                                {printers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </Autocomplete>
                        </FormField>
                        <FormField label="Material" error={errors.material_id} icon={Layers} index={2}>
                            <Autocomplete
                                value={data.material_id}
                                onChange={(e) => setData('material_id', e.target.value)}
                                placeholder="Buscar material..."
                            >
                                {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </Autocomplete>
                        </FormField>
                        <FormField label="Quantidade" error={errors.quantity} icon={Hash} index={3}>
                            <Input type="number" min="1" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} />
                        </FormField>
                        <FormField
                            label="Peso unitário (g)"
                            // hint="Peso de 1 peça — o custo de material já escala automaticamente pela quantidade."
                            error={errors.piece_weight_g}
                            icon={Weight}
                            index={4}
                        >
                            <Input type="number" step="0.01" value={data.piece_weight_g} onChange={(e) => setData('piece_weight_g', e.target.value)} />
                        </FormField>
                        <FormField
                            label="Tempo de impressão (h)"
                            // hint="Tempo da mesa inteira, com todas as peças da quantidade abaixo. Dividimos automaticamente pela quantidade para o custo por peça."
                            error={errors.print_time_h}
                            icon={Clock}
                            index={5}
                        >
                            <Input type="number" step="0.01" value={data.print_time_h} onChange={(e) => setData('print_time_h', e.target.value)} />
                        </FormField>
                        <FormField label="Mão de obra (R$)" error={errors.labor_cost} icon={Users} index={6}>
                            <Input type="number" step="0.01" value={data.labor_cost} onChange={(e) => setData('labor_cost', e.target.value)} />
                        </FormField>
                        <FormField label="Custos fixos extras (R$)" error={errors.extra_fixed_costs} icon={Receipt} index={7}>
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

            <DetailsModal
                show={details.show}
                onClose={details.close}
                maxWidth="xl"
                icon={Package}
                title={details.row?.name}
                subtitle={details.row?.printer_name && details.row?.material_name ? `${details.row.printer_name} · ${details.row.material_name}` : undefined}
                onEdit={() => startEdit(details.row)}
                fields={
                    details.row && [
                        { label: 'Impressora', value: details.row.printer_name, icon: PrinterFieldIcon },
                        { label: 'Material', value: details.row.material_name, icon: Layers },
                        { label: 'Quantidade', value: details.row.quantity, icon: Hash },
                        { label: 'Peso unitário', value: `${details.row.piece_weight_g} g`, icon: Weight },
                        { label: 'Tempo de impressão', value: `${details.row.print_time_h} h`, icon: Clock },
                        { label: 'Mão de obra', value: formatCurrency(details.row.labor_cost), icon: Users },
                        { label: 'Custos fixos extras', value: formatCurrency(details.row.extra_fixed_costs), icon: Receipt },
                        { label: 'Custo unitário', value: formatCurrency(details.row.pricing.cost_with_losses), icon: Coins },
                        {
                            label: 'Preço sugerido',
                            icon: Coins,
                            value: details.row.pricing.denominator_warning ? (
                                <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                                    <AlertTriangle size={14} /> Ajustar parâmetros
                                </span>
                            ) : (
                                formatCurrency(details.row.pricing.suggested_price_per_unit)
                            ),
                        },
                        { label: 'Lucro total', value: formatCurrency(details.row.pricing.total_profit), icon: TrendingUp },
                    ]
                }
            />
        </>
    );
}

Products.layout = (page) => <AuthenticatedLayout header={<PageHeading title="Tabela de Produtos" icon={Package} />}>{page}</AuthenticatedLayout>;
