import { motion } from 'framer-motion';
import { Droplets, Layers } from 'lucide-react';

const OPTIONS = [
    {
        value: 'fdm',
        label: 'Filamento',
        hint: 'FDM',
        description: 'Bobinas de filamento fundido — PLA, PETG, ABS...',
        icon: Layers,
    },
    {
        value: 'resin',
        label: 'Resina',
        hint: 'SLA / DLP / LCD',
        description: 'Cura de resina líquida por luz UV.',
        icon: Droplets,
    },
];

/**
 * Seletor de tecnologia da impressora (filamento x resina) em formato de
 * cartões grandes e clicáveis, com um destaque animado que desliza entre
 * as opções (em vez de um <select> comum).
 */
export default function TechnologyToggle({ value, onChange }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {OPTIONS.map((option) => {
                const active = value === option.value;
                const Icon = option.icon;
                return (
                    <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        whileTap={{ scale: 0.98 }}
                        className={`focus-ring relative overflow-hidden rounded-2xl border p-4 text-left transition-colors ${
                            active
                                ? 'border-transparent text-white'
                                : 'border-slate-200 bg-white hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20'
                        }`}
                    >
                        {active && (
                            <motion.span
                                layoutId="technology-toggle-active"
                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                className="absolute inset-0 bg-linear-to-br from-brand-600 to-accent-500"
                            />
                        )}
                        <span className="relative flex items-start gap-3">
                            <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                    active ? 'bg-white/15' : 'bg-brand-500/10 text-brand-600 dark:bg-accent-400/10 dark:text-accent-400'
                                }`}
                            >
                                <Icon size={18} />
                            </span>
                            <span className="min-w-0">
                                <span className="flex items-center gap-1.5">
                                    <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                        {option.label}
                                    </span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
                                            active ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                        }`}
                                    >
                                        {option.hint}
                                    </span>
                                </span>
                                <span className={`mt-0.5 block text-xs ${active ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {option.description}
                                </span>
                            </span>
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
