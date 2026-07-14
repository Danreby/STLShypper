import { AnimatePresence, motion } from 'framer-motion';

export default function InputError({ message, className = '', ...props }) {
    return (
        <AnimatePresence>
            {message && (
                <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    {...props}
                    className={`text-sm text-red-600 dark:text-red-400 ${className}`}
                >
                    {message}
                </motion.p>
            )}
        </AnimatePresence>
    );
}
