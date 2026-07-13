import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertSuccess from '@/Components/AlertSuccess';
import { formatCurrency } from '@/Utils/format';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500';

const emptyForm = {
    name: '',
    purchase_price: '',
    useful_life_hours: 8000,
    power_w: '',
    annual_maintenance: '',
};

export default function Printers({ printers }) {
    const { flash } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, patch, processing, errors, reset } = useForm(emptyForm);

    function startEdit(printer) {
        setEditingId(printer.id);
        setData({
            name: printer.name,
            purchase_price: printer.purchase_price,
            useful_life_hours: printer.useful_life_hours,
            power_w: printer.power_w,
            annual_maintenance: printer.annual_maintenance,
        });
    }

    function cancelEdit() {
        setEditingId(null);
        reset();
    }

    function submit(e) {
        e.preventDefault();
        if (editingId) {
            patch(`/impressoras/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            });
        } else {
            post('/impressoras', {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    }

    function destroy(printer) {
        if (!confirm(`Remover a impressora "${printer.name}"?`)) return;
        router.delete(`/impressoras/${printer.id}`, { preserveScroll: true });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-800">Impressoras</h2>}>
            <Head title="Impressoras" />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && <AlertSuccess message={flash.success} />}

                <Card title={editingId ? 'Editar impressora' : 'Nova impressora'}>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <FormField label="Nome" error={errors.name}>
                            <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </FormField>
                        <FormField label="Preço de compra (R$)" error={errors.purchase_price}>
                            <input type="number" step="0.01" className={inputClass} value={data.purchase_price} onChange={(e) => setData('purchase_price', e.target.value)} />
                        </FormField>
                        <FormField label="Vida útil (horas)" error={errors.useful_life_hours}>
                            <input type="number" className={inputClass} value={data.useful_life_hours} onChange={(e) => setData('useful_life_hours', e.target.value)} />
                        </FormField>
                        <FormField label="Potência (W)" error={errors.power_w}>
                            <input type="number" className={inputClass} value={data.power_w} onChange={(e) => setData('power_w', e.target.value)} />
                        </FormField>
                        <FormField label="Manutenção anual (R$)" error={errors.annual_maintenance}>
                            <input type="number" step="0.01" className={inputClass} value={data.annual_maintenance} onChange={(e) => setData('annual_maintenance', e.target.value)} />
                        </FormField>
                        <div className="flex items-end gap-2 lg:col-span-5">
                            <button type="submit" disabled={processing} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
                                {editingId ? 'Salvar alterações' : 'Adicionar impressora'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </Card>

                <Card title="Suas impressoras">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                    <th className="py-2 pr-4">Nome</th>
                                    <th className="py-2 pr-4">Preço</th>
                                    <th className="py-2 pr-4">Vida útil</th>
                                    <th className="py-2 pr-4">Potência</th>
                                    <th className="py-2 pr-4">Manutenção/ano</th>
                                    <th className="py-2 pr-4">Depreciação/h</th>
                                    <th className="py-2 pr-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {printers.map((p) => (
                                    <tr key={p.id} className="border-b border-slate-100">
                                        <td className="py-2 pr-4 font-medium text-slate-800">{p.name}</td>
                                        <td className="py-2 pr-4">{formatCurrency(p.purchase_price)}</td>
                                        <td className="py-2 pr-4">{p.useful_life_hours} h</td>
                                        <td className="py-2 pr-4">{p.power_w} W</td>
                                        <td className="py-2 pr-4">{formatCurrency(p.annual_maintenance)}</td>
                                        <td className="py-2 pr-4">{formatCurrency(p.purchase_price / p.useful_life_hours)}</td>
                                        <td className="py-2 pr-4 text-right">
                                            <button onClick={() => startEdit(p)} className="mr-3 text-slate-600 hover:underline">Editar</button>
                                            <button onClick={() => destroy(p)} className="text-red-600 hover:underline">Remover</button>
                                        </td>
                                    </tr>
                                ))}
                                {printers.length === 0 && (
                                    <tr><td colSpan={7} className="py-4 text-center text-slate-400">Nenhuma impressora cadastrada ainda.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
