export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={`h-4 w-4 rounded border-slate-300 text-brand-600 shadow-sm focus:ring-2 focus:ring-brand-500/30 dark:border-white/20 dark:bg-white/5 ${className}`}
        />
    );
}
