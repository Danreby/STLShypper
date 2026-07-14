import { motion } from 'framer-motion';

export default function Card({ title, subtitle, action, children, className = '', delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: 'easeOut' }}
            className={`surface-panel rounded-2xl p-5 shadow-sm shadow-slate-900/5 sm:p-6 ${className}`}
        >
            {(title || action) && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        {title && <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>}
                        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            {children}
        </motion.div>
    );
}
