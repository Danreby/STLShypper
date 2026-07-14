import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertSuccess from '@/Components/AlertSuccess';
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
import { Layers, Pencil, Trash2 } from 'lucide-react';

const emptyForm = { name: '', type: 'Filamento', price_per_kg: '', notes: '' };

const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'type', header: 'Tipo' },
    { key: 'price_per_kg', header: 'Preço/kg', render: (m) => formatCurrency(m.price_per_kg) },
    { key: 'price_per_gram', header: 'Preço/g', render: (m) => formatCurrency(m.price_per_gram) },
    { key: 'notes', header: 'Observações', render: (m) => m.notes ?? '—' },
];

export default function Materials({ materials }) {
    const { flash } = usePage().props;
    const { data, setData, errors, processing, editingId, startEdit, cancelEdit, submit, destroy } = useResourceForm({
        emptyForm,
        storeUrl: '/materiais',
        updateUrl: (id) => `/materiais/${id}`,
        deleteUrl: (id) => `/materiais/${id}`,
        mapRowToForm: (material) => ({
            name: material.name,
            type: material.type,
            price_per_kg: material.price_per_kg,
            notes: material.notes ?? '',
        }),
    });

    return (
        <AuthenticatedLayout header={<PageHeading title="Materiais" icon={Layers} />}>
            <Head title="Materiais" />

            <div className="space-y-6">
                <AnimatePresence>{flash?.success && <AlertSuccess message={flash.success} />}</AnimatePresence>

                <Card title={editingId ? 'Editar material' : 'Novo material'}>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <FormField label="Nome" error={errors.name}>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
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
                        <div className="flex items-center gap-2 lg:col-span-4">
                            <PrimaryButton type="submit" disabled={processing}>
                                {editingId ? 'Salvar alterações' : 'Adicionar material'}
                            </PrimaryButton>
                            {editingId && <SecondaryButton onClick={cancelEdit}>Cancelar</SecondaryButton>}
                        </div>
                    </form>
                </Card>

                <Card title="Seus materiais" delay={0.05}>
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
        </AuthenticatedLayout>
    );
}
