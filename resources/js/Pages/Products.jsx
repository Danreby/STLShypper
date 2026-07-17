import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import FormField from '@/Components/Form/FormField';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import AlertWarning from '@/Components/Feedback/AlertWarning';
import StatCard from '@/Components/DataDisplay/StatCard';
import Autocomplete from '@/Components/Form/Autocomplete';
import Input from '@/Components/Form/Input';
import ProductPartsEditor from '@/Components/Form/ProductPartsEditor';
import SegmentedToggle from '@/Components/Form/SegmentedToggle';
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
    Blocks,
    Clock,
    Coins,
    FileDown,
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

const emptyPart = () => ({ name: '', printer_id: '', material_id: '', piece_weight_g: '', print_time_h: '', quantity_per_unit: 1 });

const emptyForm = {
    name: '',
    printer_id: '',
    material_id: '',
    piece_weight_g: '',
    print_time_h: '',
    labor_cost: '',
    extra_fixed_costs: '',
    quantity: 1,
    parts: [],
};

const PRODUCT_MODE_OPTIONS = [
    { value: 'simple', label: 'Peça única', hint: '1 impressão', description: 'Uma impressora, um material, uma impressão.', icon: Package },
    {
        value: 'composite',
        label: 'Produto composto',
        hint: 'Várias peças',
        description: 'Várias impressões separadas (ex.: cabeça, pernas, braços).',
        icon: Blocks,
    },
];

function ProductPartsPanel({ parts }) {
    return (
        <div className="rounded-2xl border border-brand-200/70 bg-linear-to-br from-brand-50 to-accent-400/10 p-4 dark:border-white/10 dark:from-brand-500/10 dark:to-accent-400/5">
            <span className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                Partes da impressão ({parts.length})
            </span>
            <div className="mt-2.5 space-y-2">
                {parts.map((part) => (
                    <div
                        key={part.id}
                        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border border-black/5 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/10"
                    >
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {part.name} {part.quantity_per_unit > 1 && <span className="text-slate-400">×{part.quantity_per_unit}</span>}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {part.printer_name ?? '—'} · {part.material_name ?? '—'} · {part.piece_weight_g} g · {part.print_time_h} h
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const columns = [
    { key: 'name', header: 'Produto', sortable: true },
    {
        key: 'printer_name',
        header: 'Impressora',
        sortable: true,
        render: (p) => (p.is_composite ? <span className="text-xs italic">{p.parts.length} partes</span> : (p.printer_name ?? '—')),
        className: 'py-2.5 pr-4 text-slate-500 dark:text-slate-400',
    },
    {
        key: 'material_name',
        header: 'Material',
        sortable: true,
        render: (p) => (p.is_composite ? '—' : (p.material_name ?? '—')),
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
            parts: product.parts.map((part) => ({
                name: part.name,
                printer_id: part.printer_id ?? '',
                material_id: part.material_id ?? '',
                piece_weight_g: part.piece_weight_g,
                print_time_h: part.print_time_h,
                quantity_per_unit: part.quantity_per_unit,
            })),
        }),
    });

    const mode = data.parts.length > 0 ? 'composite' : 'simple';

    function handleModeChange(newMode) {
        if (newMode === 'composite' && data.parts.length === 0) {
            setData('parts', [emptyPart()]);
        } else if (newMode === 'simple') {
            setData('parts', []);
        }
    }

    return (
        <>
            <Head title="Produtos" />

            <div className="space-y-6">
                <AnimatePresence>{flash?.success && <AlertSuccess message={flash.success} />}</AnimatePresence>
                <AnimatePresence>{flash?.warning && <AlertWarning message={flash.warning} />}</AnimatePresence>

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
                                <a
                                    href={`/produtos/${p.id}/pdf`}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Exportar orçamento em PDF"
                                    className="focus-ring rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-accent-400"
                                >
                                    <FileDown size={15} />
                                </a>
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
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} maxLength={255} autoFocus />
                        </FormField>

                        <FormField label="Tipo de produto" index={1} className="sm:col-span-2 lg:col-span-4">
                            <SegmentedToggle options={PRODUCT_MODE_OPTIONS} value={mode} onChange={handleModeChange} layoutId="product-mode-active" />
                        </FormField>

                        {mode === 'simple' ? (
                            <>
                                <FormField label="Impressora" error={errors.printer_id} icon={PrinterFieldIcon} index={2}>
                                    <Autocomplete
                                        value={data.printer_id}
                                        onChange={(e) => setData('printer_id', e.target.value)}
                                        placeholder="Buscar impressora..."
                                    >
                                        {printers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </Autocomplete>
                                </FormField>
                                <FormField label="Material" error={errors.material_id} icon={Layers} index={3}>
                                    <Autocomplete
                                        value={data.material_id}
                                        onChange={(e) => setData('material_id', e.target.value)}
                                        placeholder="Buscar material..."
                                    >
                                        {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </Autocomplete>
                                </FormField>
                                <FormField label="Peso unitário (g)" error={errors.piece_weight_g} icon={Weight} index={4}>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max="50000"
                                        value={data.piece_weight_g}
                                        onChange={(e) => setData('piece_weight_g', e.target.value)}
                                    />
                                </FormField>
                                <FormField label="Tempo de impr. (h)" error={errors.print_time_h} icon={Clock} index={5}>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max="1000"
                                        value={data.print_time_h}
                                        onChange={(e) => setData('print_time_h', e.target.value)}
                                    />
                                </FormField>
                            </>
                        ) : (
                            <div className="sm:col-span-2 lg:col-span-4">
                                <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-500/10 text-brand-600 dark:bg-accent-400/10 dark:text-accent-400">
                                        <Blocks size={12} />
                                    </span>
                                    Partes da impressão
                                </span>
                                <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                                    Cada parte é impressa separadamente. O tempo de cada parte é o total da(s) mesa(s) para a quantidade
                                    pedida abaixo — dividimos automaticamente pela quantidade para o custo por unidade.
                                </p>
                                <ProductPartsEditor
                                    parts={data.parts}
                                    onChange={(parts) => setData('parts', parts)}
                                    printers={printers}
                                    materials={materials}
                                    errors={errors}
                                />
                            </div>
                        )}

                        <FormField label="Quantidade" error={errors.quantity} icon={Hash} index={6}>
                            <Input
                                type="number"
                                min="1"
                                max="100000"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Mão de obra (R$)" error={errors.labor_cost} icon={Users} index={6}>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100000"
                                value={data.labor_cost}
                                onChange={(e) => setData('labor_cost', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Custos extras (R$)" error={errors.extra_fixed_costs} icon={Receipt} index={7}>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100000"
                                value={data.extra_fixed_costs}
                                onChange={(e) => setData('extra_fixed_costs', e.target.value)}
                            />
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
                extraActions={
                    details.row && (
                        <a
                            href={`/produtos/${details.row.id}/pdf`}
                            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                        >
                            <FileDown size={15} /> Exportar PDF
                        </a>
                    )
                }
                fields={
                    details.row && [
                        details.row.is_composite
                            ? { raw: true, className: 'sm:col-span-2', value: <ProductPartsPanel parts={details.row.parts} /> }
                            : { label: 'Impressora', value: details.row.printer_name, icon: PrinterFieldIcon },
                        ...(details.row.is_composite
                            ? []
                            : [
                                  { label: 'Material', value: details.row.material_name, icon: Layers },
                                  { label: 'Peso unitário', value: `${details.row.piece_weight_g} g`, icon: Weight },
                                  { label: 'Tempo de impressão', value: `${details.row.print_time_h} h`, icon: Clock },
                              ]),
                        { label: 'Quantidade', value: details.row.quantity, icon: Hash },
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
