import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import FormField from '@/Components/Form/FormField';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import Input from '@/Components/Form/Input';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import PageHeading from '@/Components/DataDisplay/PageHeading';
import { toPercentInput, fromPercentInput } from '@/Utils/format';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    Clock,
    CreditCard,
    Layers,
    Loader2,
    Receipt,
    Settings as SettingsIcon,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';

function SuffixField({ label, hint, error, icon, index, suffix, ...inputProps }) {
    return (
        <FormField label={label} hint={hint} error={error} icon={icon} index={index}>
            <div className="relative">
                <Input className="pr-14" {...inputProps} />
                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-slate-400 dark:text-slate-500">
                    {suffix}
                </span>
            </div>
        </FormField>
    );
}

export default function Settings({ settings }) {
    const { flash } = usePage().props;

    const { data, setData, patch, transform, processing, errors } = useForm({
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
        transform((current) => ({
            ...current,
            failure_pct: fromPercentInput(current.failure_pct),
            extra_material_pct: fromPercentInput(current.extra_material_pct),
            tax_pct: fromPercentInput(current.tax_pct),
            fee_pct: fromPercentInput(current.fee_pct),
            margin_pct: fromPercentInput(current.margin_pct),
        }));
        patch(route('settings.update'), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Parâmetros Gerais" />

            <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Estes valores alimentam automaticamente o cálculo de todos os produtos e da calculadora.
                </p>

                <AnimatePresence>{flash?.success && <AlertSuccess message={flash.success} />}</AnimatePresence>

                <Card title="Custos operacionais" subtitle="O que você paga para manter a impressora rodando" delay={0}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SuffixField
                            label="Valor do kWh"
                            hint="Confira na sua conta de energia"
                            error={errors.kwh_price}
                            icon={Zap}
                            index={0}
                            suffix="R$"
                            type="number"
                            step="0.0001"
                            min="0"
                            max="50"
                            value={data.kwh_price}
                            onChange={(e) => setData('kwh_price', e.target.value)}
                        />
                        <SuffixField
                            label="Mão de obra"
                            hint="Seu custo-hora para preparo e acabamento"
                            error={errors.labor_rate}
                            icon={Users}
                            index={1}
                            suffix="R$/h"
                            type="number"
                            step="0.01"
                            min="0"
                            max="1000"
                            value={data.labor_rate}
                            onChange={(e) => setData('labor_rate', e.target.value)}
                        />
                        <SuffixField
                            label="Uso da impressora"
                            hint="Horas de uso estimadas por ano"
                            error={errors.hours_per_year}
                            icon={Clock}
                            index={2}
                            suffix="h/ano"
                            type="number"
                            step="1"
                            min="1"
                            max="8760"
                            value={data.hours_per_year}
                            onChange={(e) => setData('hours_per_year', e.target.value)}
                        />
                    </div>
                </Card>

                <Card title="Perdas e desperdício" subtitle="Margem de segurança para falhas de impressão e sobras de material" delay={0.05}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <SuffixField
                            label="% de perdas/falhas"
                            hint="Peças perdidas por falha de impressão"
                            error={errors.failure_pct}
                            icon={AlertTriangle}
                            index={0}
                            suffix="%"
                            type="number"
                            step="0.01"
                            min="0"
                            max="99.99"
                            value={data.failure_pct}
                            onChange={(e) => setData('failure_pct', e.target.value)}
                        />
                        <SuffixField
                            label="% material extra"
                            hint="Purga, suportes e testes"
                            error={errors.extra_material_pct}
                            icon={Layers}
                            index={1}
                            suffix="%"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={data.extra_material_pct}
                            onChange={(e) => setData('extra_material_pct', e.target.value)}
                        />
                    </div>
                </Card>

                <Card title="Precificação" subtitle="Como o preço sugerido é calculado a partir do custo" delay={0.1}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SuffixField
                            label="Taxa de impostos"
                            hint="Ex.: MEI/Simples Nacional"
                            error={errors.tax_pct}
                            icon={Receipt}
                            index={0}
                            suffix="%"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={data.tax_pct}
                            onChange={(e) => setData('tax_pct', e.target.value)}
                        />
                        <SuffixField
                            label="Taxa de cartão/marketplace"
                            error={errors.fee_pct}
                            icon={CreditCard}
                            index={1}
                            suffix="%"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={data.fee_pct}
                            onChange={(e) => setData('fee_pct', e.target.value)}
                        />
                        <SuffixField
                            label="Margem de lucro padrão"
                            error={errors.margin_pct}
                            icon={TrendingUp}
                            index={2}
                            suffix="%"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={data.margin_pct}
                            onChange={(e) => setData('margin_pct', e.target.value)}
                        />
                    </div>
                </Card>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
                    className="flex justify-end"
                >
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing && <Loader2 size={16} className="animate-spin" />}
                        {processing ? 'Salvando...' : 'Salvar parâmetros'}
                    </PrimaryButton>
                </motion.div>
            </form>
        </>
    );
}

Settings.layout = (page) => <AuthenticatedLayout header={<PageHeading title="Parâmetros Gerais" icon={SettingsIcon} />}>{page}</AuthenticatedLayout>;
