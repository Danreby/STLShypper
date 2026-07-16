import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function AlertWarning({ message }) {
    if (!message) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
        >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{message}</span>
        </motion.div>
    );
}
