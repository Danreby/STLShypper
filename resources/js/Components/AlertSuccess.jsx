import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function AlertSuccess({ message }) {
    if (!message) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{message}</span>
        </motion.div>
    );
}
