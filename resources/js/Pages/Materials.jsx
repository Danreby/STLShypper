import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AutoGrowTextarea from '@/Components/Form/AutoGrowTextarea';
import Card from '@/Components/DataDisplay/Card';
import ColorSwatchPicker from '@/Components/Form/ColorSwatchPicker';
import FormField from '@/Components/Form/FormField';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import Input from '@/Components/Form/Input';
import Select from '@/Components/Form/Select';
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
import { Coins, ExternalLink, FileText, Layers, Link2, Package, Palette, Pencil, Plus, Tag, Trash2 } from 'lucide-react';

const emptyForm = { name: '', type: 'Filamento', color: '', price_per_kg: '', qtd: 0, notes: '', purchase_url: '' };

function StockBadge({ qtd }) {
    const value = Number(qtd);
    if (value <= 0) {
        return (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">
                Esgotado
            </span>
        );
    }
    return <span>{value.toLocaleString('pt-BR')} g</span>;
}

function ColorDot({ color }) {
    if (!color) return <span className="text-slate-400 dark:text-slate-500">—</span>;
    return (
        <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/15" style={{ backgroundColor: color }} />
        </span>
    );
}

const columns = [
    { key: 'name', header: 'Nome', sortable: true },
    { key: 'color', header: 'Cor', render: (m) => <ColorDot color={m.color} /> },
    { key: 'type', header: 'Tipo', sortable: true },
    { key: 'price_per_kg', header: 'Preço/kg', sortable: true, render: (m) => formatCurrency(m.price_per_kg) },
    { key: 'price_per_gram', header: 'Preço/g', sortable: true, render: (m) => formatCurrency(m.price_per_gram) },
    { key: 'qtd', header: 'Estoque', sortable: true, render: (m) => <StockBadge qtd={m.qtd} /> },
    {
        key: 'purchase_url',
        header: 'Link',
        render: (m) =>
            m.purchase_url ? (
                <a
                    href={m.purchase_url}
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

export default function Materials({ materials, types, filters, pagination }) {
    const { flash } = usePage().props;
    const { sort, direction, onSort } = useSort('materials.index', filters);
    const details = useDetailsModal();
    const { data, setData, errors, processing, editingId, showModal, openCreate, startEdit, closeModal, submit, destroy } = useResourceForm({
        emptyForm,
        storeUrl: '/materiais',
        updateUrl: (id) => `/materiais/${id}`,
        deleteUrl: (id) => `/materiais/${id}`,
        mapRowToForm: (material) => ({
            name: material.name,
            type: material.type,
            color: material.color ?? '',
            price_per_kg: material.price_per_kg,
            qtd: material.qtd,
            notes: material.notes ?? '',
            purchase_url: material.purchase_url ?? '',
        }),
    });

    return (
        <>
            <Head title="Materiais" />

            <div className="space-y-6">
                <AnimatePresence>{flash?.success && <AlertSuccess message={flash.success} />}</AnimatePresence>

                <Card
                    title="Seus materiais"
                    subtitle="Filamentos e resinas usados nos seus cálculos de custo."
                    action={
                        <PrimaryButton onClick={openCreate}>
                            <Plus size={16} /> Novo material
                        </PrimaryButton>
                    }
                >
                    <FilterBar
                        routeName="materials.index"
                        filters={filters}
                        searchPlaceholder="Buscar por nome..."
                        selects={[
                            {
                                name: 'type',
                                label: 'Tipo',
                                allLabel: 'Todos os tipos',
                                options: types.map((type) => ({ value: type, label: type })),
                            },
                        ]}
                    />

                    <DataTable
                        columns={columns}
                        rows={materials}
                        sort={sort}
                        direction={direction}
                        onSort={onSort}
                        emptyMessage="Nenhum material encontrado."
                        onRowClick={details.view}
                        actions={(m) => (
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    onClick={() => startEdit(m)}
                                    title="Editar"
                                    className="focus-ring rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-accent-400"
                                >
                                    <Pencil size={15} />
                                </button>
                                <button
                                    onClick={() => destroy(m, `Remover o material "${m.name}"?`)}
                                    title="Remover"
                                    className="focus-ring rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        )}
                    />

                    <Pagination routeName="materials.index" filters={filters} pagination={pagination} />
                </Card>
            </div>

            <Modal show={showModal} onClose={closeModal} maxWidth="xl">
                <form onSubmit={submit} className="p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {editingId ? 'Editar material' : 'Novo material'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {editingId ? 'Atualize os dados do material.' : 'Preencha os dados do material que você usa.'}
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Nome" error={errors.name} icon={Tag} index={0}>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} maxLength={255} autoFocus />
                        </FormField>
                        <FormField label="Tipo" error={errors.type} icon={Layers} index={1}>
                            <Select value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                <option>Filamento</option>
                                <option>Resina</option>
                                <option>Outro</option>
                            </Select>
                        </FormField>
                        <FormField label="Cor (opcional)" error={errors.color} icon={Palette} index={2} className="sm:col-span-2">
                            <ColorSwatchPicker value={data.color} onChange={(hex) => setData('color', hex)} />
                        </FormField>
                        <FormField label="Preço por kg (R$)" error={errors.price_per_kg} icon={Coins} index={3}>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100000"
                                value={data.price_per_kg}
                                onChange={(e) => setData('price_per_kg', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Estoque (g)" error={errors.qtd} icon={Package} index={4}>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1000000"
                                value={data.qtd}
                                onChange={(e) => setData('qtd', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Observações" error={errors.notes} icon={FileText} index={5} className="sm:col-span-2">
                            <AutoGrowTextarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} maxLength={255} />
                        </FormField>
                        <FormField label="Link de compra (opcional)" error={errors.purchase_url} icon={Link2} index={6} className="sm:col-span-2">
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
                            {editingId ? 'Salvar alterações' : 'Adicionar material'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <DetailsModal
                show={details.show}
                onClose={details.close}
                icon={Layers}
                title={details.row?.name}
                subtitle={details.row?.type}
                accentColor={details.row?.color}
                onEdit={() => startEdit(details.row)}
                fields={
                    details.row && [
                        { label: 'Preço por kg', value: formatCurrency(details.row.price_per_kg), icon: Coins },
                        { label: 'Preço por grama', value: formatCurrency(details.row.price_per_gram), icon: Coins },
                        { label: 'Estoque', value: <StockBadge qtd={details.row.qtd} />, icon: Package },
                        { label: 'Cor', value: <ColorDot color={details.row.color} />, icon: Palette },
                        { label: 'Observações', value: details.row.notes, icon: FileText, className: 'sm:col-span-2' },
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

Materials.layout = (page) => <AuthenticatedLayout header={<PageHeading title="Materiais" icon={Layers} />}>{page}</AuthenticatedLayout>;
