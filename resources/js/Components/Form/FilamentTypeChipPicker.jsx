import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

function isLight(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export default function FilamentTypeChipPicker({ types, value, onChange }) {
    function toggle(id) {
        onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
    }

    if (types.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum tipo disponível para esta tecnologia.</p>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {types.map((type) => {
                const active = value.includes(type.id);
                return (
                    <motion.button
                        key={type.id}
                        type="button"
                        onClick={() => toggle(type.id)}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ y: -1 }}
                        className={`focus-ring inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            active ? 'border-transparent shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20'
                        }`}
                        style={
                            active
                                ? { backgroundColor: type.color, color: isLight(type.color) ? '#0f172a' : '#ffffff' }
                                : undefined
                        }
                    >
                        <span
                            className="h-2 w-2 shrink-0 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/20"
                            style={{ backgroundColor: active ? (isLight(type.color) ? 'rgba(15,23,42,0.35)' : 'rgba(255,255,255,0.7)') : type.color }}
                        />
                        {type.name}
                        {active && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                                <Check size={12} strokeWidth={3} />
                            </motion.span>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
