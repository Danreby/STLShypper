import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import FormField from '@/Components/Form/FormField';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import FilamentTypeChipPicker from '@/Components/Form/FilamentTypeChipPicker';
import Input from '@/Components/Form/Input';
import TechnologyToggle from '@/Components/Form/TechnologyToggle';
import DataTable from '@/Components/DataDisplay/DataTable';
import DetailsModal from '@/Components/Overlays/DetailsModal';
import FilterBar from '@/Components/FilterBar';
import Modal from '@/Components/Overlays/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import PageHeading from '@/Components/DataDisplay/PageHeading';
import useDetailsModal from '@/Hooks/useDetailsModal';
import useResourceForm from '@/Hooks/useResourceForm';
import useSort from '@/Hooks/useSort';
import { formatCurrency } from '@/Utils/format';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import {
    Clock,
    Coins,
    Droplets,
    ExternalLink,
    Gauge,
    Layers,
    Link2,
    Pencil,
    Plus,
    Printer as PrinterIcon,
    Tag,
    Trash2,
    Wrench,
} from 'lucide-react';

const emptyForm = {
    name: '',
    technology: 'fdm',
    filament_type_ids: [],
    purchase_price: '',
    useful_life_hours: 8000,
    power_w: '',
    annual_maintenance: '',
    purchase_url: '',
};

function TechnologyBadge({ technology, label }) {
    const Icon = technology === 'resin' ? Droplets : Layers;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                technology === 'resin'
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300'
                    : 'bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-accent-400'
            }`}
        >
            <Icon size={12} /> {label}
        </span>
    );
}

function FilamentTypeChips({ types }) {
    if (!types || types.length === 0) return <span className="text-slate-400 dark:text-slate-500">—</span>;
    const visible = types.slice(0, 3);
    const overflow = types.length - visible.length;
    return (
        <div className="flex flex-wrap items-center gap-1">
            {visible.map((type) => (
                <span
                    key={type.id}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-white/5 dark:text-slate-300"
                >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: type.color }} />
                    {type.name}
                </span>
            ))}
            {overflow > 0 && <span className="text-xs text-slate-400 dark:text-slate-500">+{overflow}</span>}
        </div>
    );
}

// Painel "hero" do modal de detalhes: mostra a tecnologia e a lista completa
// (sem truncar) de tipos de material aceitos, cada um com sua própria cor.
function TechnologyAndMaterialsPanel({ printer }) {
    const types = printer.filament_types ?? [];
    const isResin = printer.technology === 'resin';

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border p-4 ${
                isResin
                    ? 'border-violet-200/70 bg-linear-to-br from-violet-50 to-violet-100/40 dark:border-violet-500/20 dark:from-violet-500/10 dark:to-violet-500/5'
                    : 'border-brand-200/70 bg-linear-to-br from-brand-50 to-accent-400/10 dark:border-white/10 dark:from-brand-500/10 dark:to-accent-400/5'
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">Tecnologia</span>
                <TechnologyBadge technology={printer.technology} label={printer.technology_label} />
            </div>

            <div className="mt-3.5 border-t border-black/5 pt-3.5 dark:border-white/10">
                <span className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                    Materiais aceitos {types.length > 0 && `(${types.length})`}
                </span>
                {types.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Nenhum tipo configurado. Edite a impressora para adicionar.</p>
                ) : (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {types.map((type) => (
                            <span
                                key={type.id}
                                className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                            >
                                <span className="h-2 w-2 shrink-0 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/20" style={{ backgroundColor: type.color }} />
                                {type.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const columns = [
    { key: 'name', header: 'Nome', sortable: true },
    {
        key: 'technology',
        header: 'Tecnologia',
        sortable: true,
        render: (p) => <TechnologyBadge technology={p.technology} label={p.technology_label} />,
    },
    {
        key: 'filament_types',
        header: 'Materiais aceitos',
        render: (p) => <FilamentTypeChips types={p.filament_types} />,
    },
    { key: 'purchase_price', header: 'Preço', sortable: true, render: (p) => formatCurrency(p.purchase_price) },
    { key: 'useful_life_hours', header: 'Vida útil', sortable: true, render: (p) => `${p.useful_life_hours} h` },
    { key: 'power_w', header: 'Potência', sortable: true, render: (p) => `${p.power_w} W` },
    { key: 'annual_maintenance', header: 'Manutenção/ano', sortable: true, render: (p) => formatCurrency(p.annual_maintenance) },
    { key: 'depreciation_per_hour', header: 'Depreciação/h', sortable: true, render: (p) => formatCurrency(p.depreciation_per_hour) },
    { key: 'maintenance_per_hour', header: 'Manutenção/h', sortable: true, render: (p) => formatCurrency(p.maintenance_per_hour) },
    {
        key: 'total_cost_per_hour',
        header: 'Custo máquina/h',
        sortable: true,
        render: (p) => formatCurrency(p.total_cost_per_hour),
        className: 'py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-100',
    },
    {
        key: 'purchase_url',
        header: 'Link',
        render: (p) =>
            p.purchase_url ? (
                <a
                    href={p.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir link de compra"
                    onClick={(e) => e.stopPropagation()}
                    className="focus-ring inline-flex items-center gap-1 rounded-lg text-brand-600 hover:underline dark:text-accent-400"
                >
                    <ExternalLink size={14} /> Comprar
                </a>
            ) : (
                <span className="text-slate-400 dark:text-slate-500">—</span>
            ),
    },
];

export default function Printers({ printers, filters, pagination, filamentTypes }) {
    const { flash } = usePage().props;
    const { sort, direction, onSort } = useSort('printers.index', filters);
    const details = useDetailsModal();
    const { data, setData, errors, processing, editingId, showModal, openCreate, startEdit, closeModal, submit, destroy } = useResourceForm({
        emptyForm,
        storeUrl: '/impressoras',
        updateUrl: (id) => `/impressoras/${id}`,
        deleteUrl: (id) => `/impressoras/${id}`,
        mapRowToForm: (printer) => ({
            name: printer.name,
            technology: printer.technology,
            filament_type_ids: printer.filament_types.map((t) => t.id),
            purchase_price: printer.purchase_price,
            useful_life_hours: printer.useful_life_hours,
            power_w: printer.power_w,
            annual_maintenance: printer.annual_maintenance,
            purchase_url: printer.purchase_url ?? '',
        }),
    });

    const availableTypes = filamentTypes.filter((t) => t.technology === data.technology);

    function handleTechnologyChange(technology) {
        const allowedIds = filamentTypes.filter((t) => t.technology === technology).map((t) => t.id);
        setData((current) => ({
            ...current,
            technology,
            filament_type_ids: current.filament_type_ids.filter((id) => allowedIds.includes(id)),
        }));
    }

    return (
        <>
            <Head title="Impressoras" />

            <div className="space-y-6">
                <AnimatePresence>{flash?.success && <AlertSuccess message={flash.success} />}</AnimatePresence>

                <Card
                    title="Suas impressoras"
                    subtitle="Cadastro usado para calcular depreciação e custo de máquina por hora."
                    action={
                        <PrimaryButton onClick={openCreate}>
                            <Plus size={16} /> Nova impressora
                        </PrimaryButton>
                    }
                >
                    <FilterBar routeName="printers.index" filters={filters} searchPlaceholder="Buscar por nome..." />

                    <DataTable
                        columns={columns}
                        rows={printers}
                        sort={sort}
                        direction={direction}
                        onSort={onSort}
                        emptyMessage="Nenhuma impressora encontrada."
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
                                    onClick={() => destroy(p, `Remover a impressora "${p.name}"?`)}
                                    title="Remover"
                                    className="focus-ring rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        )}
                    />

                    <Pagination routeName="printers.index" filters={filters} pagination={pagination} />
                </Card>
            </div>

            <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {editingId ? 'Editar impressora' : 'Nova impressora'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {editingId ? 'Atualize os dados da impressora.' : 'Preencha os dados da sua impressora.'}
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Nome" error={errors.name} icon={Tag} index={0} className="sm:col-span-2">
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} maxLength={255} autoFocus />
                        </FormField>
                        <FormField label="Tecnologia" error={errors.technology} index={1} className="sm:col-span-2">
                            <TechnologyToggle value={data.technology} onChange={handleTechnologyChange} />
                        </FormField>
                        <FormField
                            label="Tipos de material aceitos"
                            hint="Selecione um ou mais tipos que esta impressora consegue usar"
                            error={errors.filament_type_ids}
                            icon={Layers}
                            index={2}
                            className="sm:col-span-2"
                        >
                            <FilamentTypeChipPicker
                                types={availableTypes}
                                value={data.filament_type_ids}
                                onChange={(ids) => setData('filament_type_ids', ids)}
                            />
                        </FormField>
                        <FormField label="Preço de compra (R$)" error={errors.purchase_price} icon={Coins} index={3}>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="500000"
                                value={data.purchase_price}
                                onChange={(e) => setData('purchase_price', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Vida útil (horas)" error={errors.useful_life_hours} icon={Clock} index={4}>
                            <Input
                                type="number"
                                min="1"
                                max="100000"
                                value={data.useful_life_hours}
                                onChange={(e) => setData('useful_life_hours', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Potência (W)" error={errors.power_w} icon={Gauge} index={5}>
                            <Input
                                type="number"
                                min="1"
                                max="20000"
                                value={data.power_w}
                                onChange={(e) => setData('power_w', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Manutenção anual (R$)" error={errors.annual_maintenance} icon={Wrench} index={6}>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100000"
                                value={data.annual_maintenance}
                                onChange={(e) => setData('annual_maintenance', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Link de compra (opcional)" error={errors.purchase_url} icon={Link2} index={7} className="sm:col-span-2">
                            <Input
                                type="url"
                                placeholder="https://..."
                                value={data.purchase_url}
                                onChange={(e) => setData('purchase_url', e.target.value)}
                                maxLength={2048}
                            />
                        </FormField>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {editingId ? 'Salvar alterações' : 'Adicionar impressora'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <DetailsModal
                show={details.show}
                onClose={details.close}
                icon={PrinterIcon}
                title={details.row?.name}
                onEdit={() => startEdit(details.row)}
                fields={
                    details.row && [
                        {
                            raw: true,
                            className: 'sm:col-span-2',
                            value: <TechnologyAndMaterialsPanel printer={details.row} />,
                        },
                        { label: 'Preço de compra', value: formatCurrency(details.row.purchase_price), icon: Coins },
                        { label: 'Vida útil', value: `${details.row.useful_life_hours} h`, icon: Clock },
                        { label: 'Potência', value: `${details.row.power_w} W`, icon: Gauge },
                        { label: 'Manutenção anual', value: formatCurrency(details.row.annual_maintenance), icon: Wrench },
                        { label: 'Depreciação/h', value: formatCurrency(details.row.depreciation_per_hour), icon: Coins },
                        { label: 'Manutenção/h', value: formatCurrency(details.row.maintenance_per_hour), icon: Wrench },
                        {
                            label: 'Custo máquina/h',
                            value: formatCurrency(details.row.total_cost_per_hour),
                            icon: Coins,
                            className: 'sm:col-span-2',
                        },
                        {
                            label: 'Link de compra',
                            icon: Link2,
                            value: details.row.purchase_url && (
                                <a
                                    href={details.row.purchase_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-accent-400"
                                >
                                    <ExternalLink size={14} /> Abrir link
                                </a>
                            ),
                            className: 'sm:col-span-2',
                        },
                    ]
                }
            />
        </>
    );
}

Printers.layout = (page) => <AuthenticatedLayout header={<PageHeading title="Impressoras" icon={PrinterIcon} />}>{page}</AuthenticatedLayout>;
