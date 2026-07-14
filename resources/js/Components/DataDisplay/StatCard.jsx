import useCountUp from '@/Hooks/useCountUp';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, format = (v) => v, accent = false, icon: Icon, delay = 0 }) {
    const animated = useCountUp(value);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
            className="surface-panel group relative overflow-hidden rounded-2xl p-4 shadow-sm shadow-slate-900/5 transition-shadow hover:shadow-lg hover:shadow-brand-500/10 sm:p-5"
        >
            <div
                className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${accent ? 'from-brand-500 via-violet-500 to-accent-400' : 'from-slate-200 to-slate-200 dark:from-white/10 dark:to-white/10'}`}
            />
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
                {Icon && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
                        <Icon size={15} />
                    </span>
                )}
            </div>
            <p
                className={`mt-2 truncate text-2xl font-semibold tabular-nums sm:text-3xl ${accent ? 'text-gradient-brand' : 'text-slate-900 dark:text-white'}`}
            >
                {format(animated)}
            </p>
        </motion.div>
    );
}
