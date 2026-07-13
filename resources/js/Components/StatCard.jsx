export default function StatCard({ label, value, accent = false }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-semibold ${accent ? 'text-emerald-600' : 'text-slate-900'}`}>
                {value}
            </p>
        </div>
    );
}
