import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import FormField from '@/Components/Form/FormField';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import Input from '@/Components/Form/Input';
import DataTable from '@/Components/DataDisplay/DataTable';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import PageHeading from '@/Components/DataDisplay/PageHeading';
import useResourceForm from '@/Hooks/useResourceForm';
import { formatCurrency } from '@/Utils/format';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { Pencil, Printer as PrinterIcon, Trash2 } from 'lucide-react';

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
    { key: 'maintenance_per_hour', header: 'Manutenção/h', render: (p) => formatCurrency(p.maintenance_per_hour) },
    {
        key: 'total_cost_per_hour',
        header: 'Custo máquina/h',
        render: (p) => formatCurrency(p.total_cost_per_hour),
        className: 'py-2.5 pr-4 font-semibold text-slate-800 dark:text-slate-100',
    },
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
        <>
            <Head title="Impressoras" />

            <div className="space-y-6">
                <AnimatePresence>{flash?.success && <AlertSuccess message={flash.success} />}</AnimatePresence>

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
                        <div className="flex items-center gap-2 lg:col-span-5">
                            <PrimaryButton type="submit" disabled={processing}>
                                {editingId ? 'Salvar alterações' : 'Adicionar impressora'}
                            </PrimaryButton>
                            {editingId && <SecondaryButton onClick={cancelEdit}>Cancelar</SecondaryButton>}
                        </div>
                    </form>
                </Card>

                <Card title="Suas impressoras" delay={0.05}>
                    <DataTable
                        columns={columns}
                        rows={printers}
                        emptyMessage="Nenhuma impressora cadastrada ainda."
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
                </Card>
            </div>
        </>
    );
}

Printers.layout = (page) => <AuthenticatedLayout header={<PageHeading title="Impressoras" icon={PrinterIcon} />}>{page}</AuthenticatedLayout>;
