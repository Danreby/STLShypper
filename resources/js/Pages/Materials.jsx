import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertSuccess from '@/Components/AlertSuccess';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import DataTable from '@/Components/DataTable';
import useResourceForm from '@/Hooks/useResourceForm';
import { formatCurrency } from '@/Utils/format';
import { Head, usePage } from '@inertiajs/react';

const emptyForm = { name: '', type: 'Filamento', price_per_kg: '', notes: '' };

const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'type', header: 'Tipo' },
    { key: 'price_per_kg', header: 'Preço/kg', render: (m) => formatCurrency(m.price_per_kg) },
    { key: 'price_per_gram', header: 'Preço/g', render: (m) => formatCurrency(m.price_per_gram) },
    { key: 'notes', header: 'Observações', render: (m) => m.notes, className: 'py-2 pr-4 text-slate-500' },
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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-800">Materiais</h2>}>
            <Head title="Materiais" />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && <AlertSuccess message={flash.success} />}

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
                        <div className="flex items-end gap-2 lg:col-span-4">
                            <button type="submit" disabled={processing} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
                                {editingId ? 'Salvar alterações' : 'Adicionar material'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </Card>

                <Card title="Seus materiais">
                    <DataTable
                        columns={columns}
                        rows={materials}
                        emptyMessage="Nenhum material cadastrado ainda."
                        actions={(m) => (
                            <>
                                <button onClick={() => startEdit(m)} className="mr-3 text-slate-600 hover:underline">Editar</button>
                                <button onClick={() => destroy(m, `Remover o material "${m.name}"?`)} className="text-red-600 hover:underline">Remover</button>
                            </>
                        )}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
