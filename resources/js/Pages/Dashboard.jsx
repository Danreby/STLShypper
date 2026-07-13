import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import StatCard from '@/Components/StatCard';
import { formatCurrency, formatPercent } from '@/Utils/format';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, topProducts }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-800">Resumo</h2>}>
            <Head title="Resumo" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Impressoras cadastradas" value={stats.printers_count} />
                    <StatCard label="Materiais cadastrados" value={stats.materials_count} />
                    <StatCard label="Produtos cadastrados" value={stats.products_count} />
                    <StatCard label="Margem média" value={formatPercent(stats.margin_pct)} accent />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Receita total estimada" value={formatCurrency(stats.total_revenue)} accent />
                    <StatCard label="Custo total estimado" value={formatCurrency(stats.total_cost)} />
                    <StatCard label="Lucro total estimado" value={formatCurrency(stats.total_profit)} accent />
                </div>

                <Card title="Produtos mais lucrativos">
                    {topProducts.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            Nenhum produto cadastrado ainda.{' '}
                            <Link href="/produtos" className="font-medium text-slate-900 underline">
                                Cadastre seu primeiro produto
                            </Link>
                            .
                        </p>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                    <th className="py-2 pr-4">Produto</th>
                                    <th className="py-2 pr-4">Preço sugerido</th>
                                    <th className="py-2 pr-4">Lucro total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((p, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        <td className="py-2 pr-4 font-medium text-slate-800">{p.name}</td>
                                        <td className="py-2 pr-4">{formatCurrency(p.pricing.suggested_price_per_unit)}</td>
                                        <td className="py-2 pr-4 font-semibold text-emerald-700">{formatCurrency(p.pricing.total_profit)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <QuickLink href="/calculadora" title="Calculadora" description="Simule o custo de uma peça avulsa." />
                    <QuickLink href="/produtos" title="Produtos" description="Cadastre e acompanhe seus produtos." />
                    <QuickLink href="/parametros" title="Parâmetros Gerais" description="Ajuste kWh, mão de obra, impostos e margem." />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function QuickLink({ href, title, description }) {
    return (
        <Link href={href} className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-400">
            <p className="font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
        </Link>
    );
}
