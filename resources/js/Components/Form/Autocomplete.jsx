import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { inputClass } from '@/Utils/inputStyles';
import { parseOptions } from '@/Utils/parseSelectOptions';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

export default function Autocomplete({ className = '', children, value, onChange, disabled = false, name, placeholder = 'Buscar...' }) {
    const options = parseOptions(children);
    const stringValue = value === undefined || value === null || value === '' ? null : String(value);
    const selected = options.find((option) => option.value === stringValue) ?? null;
    const [query, setQuery] = useState('');

    const filtered =
        query === '' ? options : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

    function handleChange(newValue) {
        onChange?.({ target: { name, value: newValue ?? '' } });
    }

    return (
        <Combobox value={stringValue} onChange={handleChange} onClose={() => setQuery('')} disabled={disabled}>
            {({ open }) => (
                <>
                    <div className="relative">
                        <ComboboxInput
                            className={`${inputClass} ${selected ? 'pr-14' : 'pr-9'} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
                            displayValue={() => selected?.label ?? ''}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder}
                            autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center gap-0.5 pr-2">
                            {selected && !disabled && (
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => handleChange(null)}
                                    title="Limpar"
                                    className="focus-ring flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-300"
                                >
                                    <X size={13} />
                                </button>
                            )}
                            <ComboboxButton className="focus-ring flex h-6 w-6 items-center justify-center text-slate-400 dark:text-slate-500">
                                <motion.span
                                    animate={{ rotate: open ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center"
                                >
                                    <ChevronDown size={16} />
                                </motion.span>
                            </ComboboxButton>
                        </div>
                    </div>

                    <AnimatePresence>
                        {open && (
                            <ComboboxOptions
                                static
                                anchor={{ to: 'bottom start', gap: 8 }}
                                as={motion.div}
                                initial={{ opacity: 0, scale: 0.97, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97, y: -4 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="menu-panel scrollbar-thin z-50 max-h-60 w-(--input-width) overflow-auto rounded-2xl p-1.5 shadow-xl shadow-slate-900/10 focus:outline-none"
                            >
                                {filtered.length === 0 ? (
                                    <p className="px-3 py-2 text-sm text-slate-400 dark:text-slate-500">Nenhum resultado encontrado.</p>
                                ) : (
                                    filtered.map((option) => (
                                        <ComboboxOption
                                            key={option.value}
                                            value={option.value}
                                            disabled={option.disabled}
                                            className={({ focus, selected: isSelected }) =>
                                                `flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                                                    option.disabled
                                                        ? 'cursor-not-allowed text-slate-400 dark:text-slate-600'
                                                        : 'cursor-pointer text-slate-700 dark:text-slate-200'
                                                } ${focus && !option.disabled ? 'bg-brand-50 dark:bg-white/10' : ''} ${
                                                    isSelected ? 'font-medium text-brand-700 dark:text-accent-400' : ''
                                                }`
                                            }
                                        >
                                            {({ selected: isSelected }) => (
                                                <>
                                                    <span className="truncate">{option.label}</span>
                                                    {isSelected && <Check size={15} className="shrink-0" />}
                                                </>
                                            )}
                                        </ComboboxOption>
                                    ))
                                )}
                            </ComboboxOptions>
                        )}
                    </AnimatePresence>
                </>
            )}
        </Combobox>
    );
}
