import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function AlertError({ message }) {
    if (!message) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{message}</span>
        </motion.div>
    );
}
