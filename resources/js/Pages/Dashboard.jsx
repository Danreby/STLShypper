import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/DataDisplay/Card';
import StatCard from '@/Components/DataDisplay/StatCard';
import PageHeading from '@/Components/DataDisplay/PageHeading';
import ExportExcel from '@/Components/ExportExcel';
import { formatCurrency, formatPercent } from '@/Utils/format';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Boxes,
    Calculator,
    LayoutDashboard,
    Layers,
    Package,
    Printer,
    Settings,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

export default function Dashboard({ stats, topProducts }) {
    return (
        <>
            <Head title="Resumo" />

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 via-brand-500 to-accent-500 p-6 text-white shadow-xl shadow-brand-500/25 sm:p-8"
                >
                    <div className="absolute -top-16 -right-10 h-56 w-56 animate-float rounded-full bg-white/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                                <Sparkles size={13} /> Visão geral do seu negócio
                            </span>
                            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                                Sua operação de impressão 3D em números
                            </h2>
                            <p className="mt-1 max-w-xl text-sm text-white/80">
                                Acompanhe receita, custos e margem em tempo real, calculados a partir dos seus parâmetros gerais.
                            </p>
                        </div>
                        <ExportExcel variant="on-dark" className="sm:shrink-0" />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Impressoras cadastradas" value={stats.printers_count} icon={Printer} delay={0} />
                    <StatCard label="Materiais cadastrados" value={stats.materials_count} icon={Layers} delay={0.05} />
                    <StatCard label="Produtos cadastrados" value={stats.products_count} icon={Package} delay={0.1} />
                    <StatCard label="Margem média" value={stats.margin_pct} format={formatPercent} icon={TrendingUp} accent delay={0.15} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Quantidade total de peças" value={stats.total_quantity} icon={Boxes} delay={0} />
                    <StatCard label="Receita total estimada" value={stats.total_revenue} format={formatCurrency} accent delay={0.05} />
                    <StatCard label="Custo total estimado" value={stats.total_cost} format={formatCurrency} delay={0.1} />
                    <StatCard label="Lucro total estimado" value={stats.total_profit} format={formatCurrency} accent delay={0.15} />
                </div>

                <Card title="Produtos mais lucrativos" subtitle="Top produtos ordenados por lucro total estimado" delay={0.1}>
                    {topProducts.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Nenhum produto cadastrado ainda.{' '}
                            <Link href="/produtos" className="font-medium text-brand-600 underline underline-offset-2 dark:text-accent-400">
                                Cadastre seu primeiro produto
                            </Link>
                            .
                        </p>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200/70 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">
                                    <th className="py-2 pr-4 font-medium">Produto</th>
                                    <th className="py-2 pr-4 font-medium">Preço sugerido</th>
                                    <th className="py-2 pr-4 font-medium">Lucro total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((p, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * i, duration: 0.25 }}
                                        className="border-b border-slate-100 dark:border-white/5"
                                    >
                                        <td className="py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100">{p.name}</td>
                                        <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">
                                            {formatCurrency(p.pricing.suggested_price_per_unit)}
                                        </td>
                                        <td className="py-2.5 pr-4 font-semibold text-emerald-600 dark:text-emerald-400">
                                            {formatCurrency(p.pricing.total_profit)}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <QuickLink href="/calculadora" title="Calculadora" description="Simule o custo de uma peça avulsa." icon={Calculator} delay={0} />
                    <QuickLink href="/produtos" title="Produtos" description="Cadastre e acompanhe seus produtos." icon={Package} delay={0.05} />
                    <QuickLink
                        href="/parametros"
                        title="Parâmetros Gerais"
                        description="Ajuste kWh, mão de obra, impostos e margem."
                        icon={Settings}
                        delay={0.1}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <AuthenticatedLayout header={<PageHeading title="Resumo" icon={LayoutDashboard} />}>{page}</AuthenticatedLayout>;

function QuickLink({ href, title, description, icon: Icon, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
        >
            <Link
                href={href}
                className="focus-ring surface-panel group flex h-full flex-col gap-3 rounded-2xl p-5 shadow-sm shadow-slate-900/5 transition-shadow hover:shadow-lg hover:shadow-brand-500/10"
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-500/10 to-accent-400/10 text-brand-600 transition-colors group-hover:text-brand-500 dark:text-accent-400">
                    <Icon size={19} />
                </span>
                <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </Link>
        </motion.div>
    );
}
