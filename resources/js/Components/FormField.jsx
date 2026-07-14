import { AnimatePresence, motion } from 'framer-motion';

export default function FormField({ label, hint, error, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
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
        </label>
    );
}
