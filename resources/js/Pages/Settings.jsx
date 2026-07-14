import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import FormField from '@/Components/FormField';
import AlertSuccess from '@/Components/AlertSuccess';
import Input from '@/Components/Input';
import PrimaryButton from '@/Components/PrimaryButton';
import PageHeading from '@/Components/PageHeading';
import { toPercentInput, fromPercentInput } from '@/Utils/format';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings({ settings }) {
    const { flash } = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        kwh_price: settings.kwh_price,
        labor_rate: settings.labor_rate,
        failure_pct: toPercentInput(settings.failure_pct),
        extra_material_pct: toPercentInput(settings.extra_material_pct),
        tax_pct: toPercentInput(settings.tax_pct),
        fee_pct: toPercentInput(settings.fee_pct),
        margin_pct: toPercentInput(settings.margin_pct),
        hours_per_year: settings.hours_per_year,
    });

    function submit(e) {
        e.preventDefault();
        patch(route('settings.update'), {
            data: {
                ...data,
                failure_pct: fromPercentInput(data.failure_pct),
                extra_material_pct: fromPercentInput(data.extra_material_pct),
                tax_pct: fromPercentInput(data.tax_pct),
                fee_pct: fromPercentInput(data.fee_pct),
                margin_pct: fromPercentInput(data.margin_pct),
            },
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout header={<PageHeading title="Parâmetros Gerais" icon={SettingsIcon} />}>
            <Head title="Parâmetros Gerais" />

            <div className="mx-auto max-w-3xl space-y-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Estes valores alimentam automaticamente o cálculo de todos os produtos e da calculadora.
                </p>

                <AnimatePresence>{flash?.success && <AlertSuccess message={flash.success} />}</AnimatePresence>

                <Card>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Valor do kWh (R$)" hint="Confira na sua conta de energia" error={errors.kwh_price}>
                            <Input type="number" step="0.0001" value={data.kwh_price} onChange={(e) => setData('kwh_price', e.target.value)} />
                        </FormField>
                        <FormField label="Mão de obra (R$/h)" hint="Seu custo-hora para preparo e acabamento" error={errors.labor_rate}>
                            <Input type="number" step="0.01" value={data.labor_rate} onChange={(e) => setData('labor_rate', e.target.value)} />
                        </FormField>
                        <FormField label="% de perdas/falhas" hint="Peças perdidas por falha de impressão" error={errors.failure_pct}>
                            <Input type="number" step="0.01" value={data.failure_pct} onChange={(e) => setData('failure_pct', e.target.value)} />
                        </FormField>
                        <FormField label="% material extra" hint="Purga, suportes e testes" error={errors.extra_material_pct}>
                            <Input type="number" step="0.01" value={data.extra_material_pct} onChange={(e) => setData('extra_material_pct', e.target.value)} />
                        </FormField>
                        <FormField label="Taxa de impostos (%)" hint="Ex.: MEI/Simples Nacional" error={errors.tax_pct}>
                            <Input type="number" step="0.01" value={data.tax_pct} onChange={(e) => setData('tax_pct', e.target.value)} />
                        </FormField>
                        <FormField label="Taxa de cartão/marketplace (%)" error={errors.fee_pct}>
                            <Input type="number" step="0.01" value={data.fee_pct} onChange={(e) => setData('fee_pct', e.target.value)} />
                        </FormField>
                        <FormField label="Margem de lucro padrão (%)" error={errors.margin_pct}>
                            <Input type="number" step="0.01" value={data.margin_pct} onChange={(e) => setData('margin_pct', e.target.value)} />
                        </FormField>
                        <FormField label="Horas de uso da impressora/ano" error={errors.hours_per_year}>
                            <Input type="number" step="1" value={data.hours_per_year} onChange={(e) => setData('hours_per_year', e.target.value)} />
                        </FormField>

                        <div className="sm:col-span-2">
                            <PrimaryButton type="submit" disabled={processing}>
                                Salvar parâmetros
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
