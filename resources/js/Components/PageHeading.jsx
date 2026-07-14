export default function PageHeading({ title, icon: Icon }) {
    return (
        <div className="flex items-center gap-2">
            {Icon && (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-accent-400">
                    <Icon size={16} />
                </span>
            )}
            <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg dark:text-white">{title}</h1>
        </div>
    );
}
