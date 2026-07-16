import { AnimatePresence, motion } from 'framer-motion';

export default function FormField({ label, hint, error, children, className = '', icon: Icon, index = 0 }) {
    return (
        <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.045, 0.35), ease: 'easeOut' }}
            className={`block ${className}`}
        >
            <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                {Icon && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-500/10 text-brand-600 dark:bg-accent-400/10 dark:text-accent-400">
                        <Icon size={12} />
                    </span>
                )}
                {label}
            </span>
            {children}
            {hint && <span className="mt-1.5 block text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
            <AnimatePresence>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="mt-1.5 block text-xs text-red-600 dark:text-red-400"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.label>
    );
}
