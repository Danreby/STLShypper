import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import FormField from '@/Components/Form/FormField';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import Input from '@/Components/Form/Input';
import Select from '@/Components/Form/Select';
import DataTable from '@/Components/DataDisplay/DataTable';
import Modal from '@/Components/Overlays/Modal';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import PageHeading from '@/Components/DataDisplay/PageHeading';
import useResourceForm from '@/Hooks/useResourceForm';
import { formatCurrency } from '@/Utils/format';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { ExternalLink, Layers, Pencil, Plus, Trash2 } from 'lucide-react';

const emptyForm = { name: '', type: 'Filamento', price_per_kg: '', notes: '', purchase_url: '' };

const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'type', header: 'Tipo' },
    { key: 'price_per_kg', header: 'Preço/kg', render: (m) => formatCurrency(m.price_per_kg) },
    { key: 'price_per_gram', header: 'Preço/g', render: (m) => formatCurrency(m.price_per_gram) },
    { key: 'notes', header: 'Observações', render: (m) => m.notes ?? '—' },
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
                    className="focus-ring inline-flex items-center gap-1 rounded-lg text-brand-600 hover:underline dark:text-accent-400"
                >
                    <ExternalLink size={14} /> Comprar
                </a>
            ) : (
                <span className="text-slate-400 dark:text-slate-500">—</span>
            ),
    },
];

export default function Materials({ materials }) {
    const { flash } = usePage().props;
    const { data, setData, errors, processing, editingId, showModal, openCreate, startEdit, closeModal, submit, destroy } = useResourceForm({
        emptyForm,
        storeUrl: '/materiais',
        updateUrl: (id) => `/materiais/${id}`,
        deleteUrl: (id) => `/materiais/${id}`,
        mapRowToForm: (material) => ({
            name: material.name,
            type: material.type,
            price_per_kg: material.price_per_kg,
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
                    <DataTable
                        columns={columns}
                        rows={materials}
                        emptyMessage="Nenhum material cadastrado ainda."
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
                        <FormField label="Nome" error={errors.name}>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                        </FormField>
                        <FormField label="Tipo" error={errors.type}>
                            <Select value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                <option>Filamento</option>
                                <option>Resina</option>
                                <option>Outro</option>
                            </Select>
                        </FormField>
                        <FormField label="Preço por kg (R$)" error={errors.price_per_kg}>
                            <Input type="number" step="0.01" value={data.price_per_kg} onChange={(e) => setData('price_per_kg', e.target.value)} />
                        </FormField>
                        <FormField label="Observações" error={errors.notes}>
                            <Input value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        </FormField>
                        <FormField label="Link de compra (opcional)" error={errors.purchase_url} className="sm:col-span-2">
                            <Input
                                type="url"
                                placeholder="https://..."
                                value={data.purchase_url}
                                onChange={(e) => setData('purchase_url', e.target.value)}
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
        </>
    );
}

Materials.layout = (page) => <AuthenticatedLayout header={<PageHeading title="Materiais" icon={Layers} />}>{page}</AuthenticatedLayout>;
