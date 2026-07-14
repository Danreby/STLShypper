import { motion } from 'framer-motion';

export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <motion.button
            {...props}
            whileHover={disabled ? {} : { y: -1 }}
            whileTap={disabled ? {} : { scale: 0.97 }}
            className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}
