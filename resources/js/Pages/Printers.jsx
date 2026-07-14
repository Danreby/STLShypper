import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertSuccess from '@/Components/AlertSuccess';
import Input from '@/Components/Input';
import DataTable from '@/Components/DataTable';
import useResourceForm from '@/Hooks/useResourceForm';
import { formatCurrency } from '@/Utils/format';
import { Head, usePage } from '@inertiajs/react';

const emptyForm = {
    name: '',
    purchase_price: '',
    useful_life_hours: 8000,
    power_w: '',
    annual_maintenance: '',
};

const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'purchase_price', header: 'Preço', render: (p) => formatCurrency(p.purchase_price) },
    { key: 'useful_life_hours', header: 'Vida útil', render: (p) => `${p.useful_life_hours} h` },
    { key: 'power_w', header: 'Potência', render: (p) => `${p.power_w} W` },
    { key: 'annual_maintenance', header: 'Manutenção/ano', render: (p) => formatCurrency(p.annual_maintenance) },
    { key: 'depreciation_per_hour', header: 'Depreciação/h', render: (p) => formatCurrency(p.depreciation_per_hour) },
];

export default function Printers({ printers }) {
    const { flash } = usePage().props;
    const { data, setData, errors, processing, editingId, startEdit, cancelEdit, submit, destroy } = useResourceForm({
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
        }),
    });

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-800">Impressoras</h2>}>
            <Head title="Impressoras" />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && <AlertSuccess message={flash.success} />}

                <Card title={editingId ? 'Editar impressora' : 'Nova impressora'}>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <FormField label="Nome" error={errors.name}>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </FormField>
                        <FormField label="Preço de compra (R$)" error={errors.purchase_price}>
                            <Input type="number" step="0.01" value={data.purchase_price} onChange={(e) => setData('purchase_price', e.target.value)} />
                        </FormField>
                        <FormField label="Vida útil (horas)" error={errors.useful_life_hours}>
                            <Input type="number" value={data.useful_life_hours} onChange={(e) => setData('useful_life_hours', e.target.value)} />
                        </FormField>
                        <FormField label="Potência (W)" error={errors.power_w}>
                            <Input type="number" value={data.power_w} onChange={(e) => setData('power_w', e.target.value)} />
                        </FormField>
                        <FormField label="Manutenção anual (R$)" error={errors.annual_maintenance}>
                            <Input type="number" step="0.01" value={data.annual_maintenance} onChange={(e) => setData('annual_maintenance', e.target.value)} />
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
                    <DataTable
                        columns={columns}
                        rows={printers}
                        emptyMessage="Nenhuma impressora cadastrada ainda."
                        actions={(p) => (
                            <>
                                <button onClick={() => startEdit(p)} className="mr-3 text-slate-600 hover:underline">Editar</button>
                                <button onClick={() => destroy(p, `Remover a impressora "${p.name}"?`)} className="text-red-600 hover:underline">Remover</button>
                            </>
                        )}
                    />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
