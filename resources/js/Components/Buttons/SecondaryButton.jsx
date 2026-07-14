import { motion } from 'framer-motion';

export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <motion.button
            {...props}
            type={type}
            whileHover={disabled ? {} : { y: -1 }}
            whileTap={disabled ? {} : { scale: 0.97 }}
            className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 ${className}`}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}
