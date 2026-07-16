import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import FormField from '@/Components/Form/FormField';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import Input from '@/Components/Form/Input';
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
import { Clock, Coins, ExternalLink, Gauge, Link2, Pencil, Plus, Printer as PrinterIcon, Tag, Trash2, Wrench } from 'lucide-react';

const emptyForm = {
    name: '',
    purchase_price: '',
    useful_life_hours: 8000,
    power_w: '',
    annual_maintenance: '',
    purchase_url: '',
};

const columns = [
    { key: 'name', header: 'Nome', sortable: true },
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

export default function Printers({ printers, filters, pagination }) {
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
            purchase_price: printer.purchase_price,
            useful_life_hours: printer.useful_life_hours,
            power_w: printer.power_w,
            annual_maintenance: printer.annual_maintenance,
            purchase_url: printer.purchase_url ?? '',
        }),
    });

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
                        <FormField label="Preço de compra (R$)" error={errors.purchase_price} icon={Coins} index={1}>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="500000"
                                value={data.purchase_price}
                                onChange={(e) => setData('purchase_price', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Vida útil (horas)" error={errors.useful_life_hours} icon={Clock} index={2}>
                            <Input
                                type="number"
                                min="1"
                                max="100000"
                                value={data.useful_life_hours}
                                onChange={(e) => setData('useful_life_hours', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Potência (W)" error={errors.power_w} icon={Gauge} index={3}>
                            <Input
                                type="number"
                                min="1"
                                max="20000"
                                value={data.power_w}
                                onChange={(e) => setData('power_w', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Manutenção anual (R$)" error={errors.annual_maintenance} icon={Wrench} index={4}>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100000"
                                value={data.annual_maintenance}
                                onChange={(e) => setData('annual_maintenance', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Link de compra (opcional)" error={errors.purchase_url} icon={Link2} index={5} className="sm:col-span-2">
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
