export default function Card({ title, subtitle, children, className = '' }) {
    return (
        <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
            {title && (
                <div className="mb-4">
                    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                    {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
}
