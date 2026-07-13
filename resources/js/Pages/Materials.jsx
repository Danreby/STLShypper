import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertSuccess from '@/Components/AlertSuccess';
import { formatCurrency } from '@/Utils/format';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500';

const emptyForm = { name: '', type: 'Filamento', price_per_kg: '', notes: '' };

export default function Materials({ materials }) {
    const { flash } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, patch, processing, errors, reset } = useForm(emptyForm);

    function startEdit(material) {
        setEditingId(material.id);
        setData({
            name: material.name,
            type: material.type,
            price_per_kg: material.price_per_kg,
            notes: material.notes ?? '',
        });
    }

    function cancelEdit() {
        setEditingId(null);
        reset();
    }

    function submit(e) {
        e.preventDefault();
        if (editingId) {
            patch(`/materiais/${editingId}`, { preserveScroll: true, onSuccess: () => cancelEdit() });
        } else {
            post('/materiais', { preserveScroll: true, onSuccess: () => reset() });
        }
    }

    function destroy(material) {
        if (!confirm(`Remover o material "${material.name}"?`)) return;
        router.delete(`/materiais/${material.id}`, { preserveScroll: true });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-800">Materiais</h2>}>
            <Head title="Materiais" />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && <AlertSuccess message={flash.success} />}

                <Card title={editingId ? 'Editar material' : 'Novo material'}>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <FormField label="Nome" error={errors.name}>
                            <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </FormField>
                        <FormField label="Tipo" error={errors.type}>
                            <select className={inputClass} value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                <option>Filamento</option>
                                <option>Resina</option>
                                <option>Outro</option>
                            </select>
                        </FormField>
                        <FormField label="Preço por kg (R$)" error={errors.price_per_kg}>
                            <input type="number" step="0.01" className={inputClass} value={data.price_per_kg} onChange={(e) => setData('price_per_kg', e.target.value)} />
                        </FormField>
                        <FormField label="Observações" error={errors.notes}>
                            <input className={inputClass} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                    <th className="py-2 pr-4">Nome</th>
                                    <th className="py-2 pr-4">Tipo</th>
                                    <th className="py-2 pr-4">Preço/kg</th>
                                    <th className="py-2 pr-4">Preço/g</th>
                                    <th className="py-2 pr-4">Observações</th>
                                    <th className="py-2 pr-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((m) => (
                                    <tr key={m.id} className="border-b border-slate-100">
                                        <td className="py-2 pr-4 font-medium text-slate-800">{m.name}</td>
                                        <td className="py-2 pr-4">{m.type}</td>
                                        <td className="py-2 pr-4">{formatCurrency(m.price_per_kg)}</td>
                                        <td className="py-2 pr-4">{formatCurrency(m.price_per_kg / 1000)}</td>
                                        <td className="py-2 pr-4 text-slate-500">{m.notes}</td>
                                        <td className="py-2 pr-4 text-right">
                                            <button onClick={() => startEdit(m)} className="mr-3 text-slate-600 hover:underline">Editar</button>
                                            <button onClick={() => destroy(m)} className="text-red-600 hover:underline">Remover</button>
                                        </td>
                                    </tr>
                                ))}
                                {materials.length === 0 && (
                                    <tr><td colSpan={6} className="py-4 text-center text-slate-400">Nenhum material cadastrado ainda.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
