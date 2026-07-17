import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PRESETS = [
    { label: 'Branco', value: '#f8fafc' },
    { label: 'Preto', value: '#0f172a' },
    { label: 'Cinza', value: '#94a3b8' },
    { label: 'Vermelho', value: '#ef4444' },
    { label: 'Laranja', value: '#f97316' },
    { label: 'Amarelo', value: '#eab308' },
    { label: 'Verde', value: '#22c55e' },
    { label: 'Azul', value: '#3b82f6' },
    { label: 'Roxo', value: '#a855f7' },
    { label: 'Rosa', value: '#ec4899' },
];

function isLight(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function Swatch({ color, label, active, onClick }) {
    return (
        <button
            type="button"
            title={label}
            onClick={onClick}
            className="focus-ring relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/10 transition-transform hover:scale-110 dark:ring-white/15"
            style={{ backgroundColor: color }}
        >
            {active && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="absolute -inset-0.5 flex items-center justify-center rounded-full ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                >
                    <Check size={13} className={isLight(color) ? 'text-slate-900' : 'text-white'} strokeWidth={3} />
                </motion.span>
            )}
        </button>
    );
}

export default function ColorSwatchPicker({ value, onChange }) {
    const normalized = value ? value.toLowerCase() : '';
    const isCustom = normalized && !PRESETS.some((p) => p.value === normalized);

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/60 p-2.5 dark:border-white/10 dark:bg-white/5">
            {PRESETS.map((preset) => (
                <Swatch
                    key={preset.value}
                    color={preset.value}
                    label={preset.label}
                    active={normalized === preset.value}
                    onClick={() => onChange(preset.value)}
                />
            ))}

            <label
                title="Cor personalizada"
                className="focus-ring relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full ring-1 ring-inset ring-black/10 transition-transform hover:scale-110 dark:ring-white/15"
                style={{ background: 'conic-gradient(from 180deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)' }}
            >
                {isCustom && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        className="absolute -inset-0.5 flex items-center justify-center rounded-full ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                        style={{ backgroundColor: normalized }}
                    >
                        <Check size={13} className={isLight(normalized) ? 'text-slate-900' : 'text-white'} strokeWidth={3} />
                    </motion.span>
                )}
                <input
                    type="color"
                    value={isCustom ? value : '#94a3b8'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
            </label>

            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="focus-ring ml-1 text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline dark:text-slate-500 dark:hover:text-slate-300"
                >
                    Limpar
                </button>
            )}
        </div>
    );
}
