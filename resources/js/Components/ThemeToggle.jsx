import { useTheme } from '@/Hooks/useTheme';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className={`focus-ring relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:text-brand-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-accent-400 ${className}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={isDark ? 'moon' : 'sun'}
                    initial={{ y: -12, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 12, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex items-center justify-center"
                >
                    {isDark ? <Moon size={17} /> : <Sun size={17} />}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
