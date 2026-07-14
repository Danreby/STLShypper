import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { inputClass } from '@/Utils/inputStyles';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { Children, isValidElement } from 'react';

/**
 * Reads plain `<option>` children (same API as a native <select>) so every
 * existing call site keeps working unchanged, while the actual control
 * rendered is a fully-styled Headless UI Listbox that matches the rest of
 * the design system instead of the browser's native dropdown.
 */
function parseOptions(children) {
    const options = [];
    Children.forEach(children, (child) => {
        if (!isValidElement(child) || child.type !== 'option') return;
        const rawValue = child.props.value !== undefined ? child.props.value : child.props.children;
        options.push({
            value: String(rawValue),
            label: child.props.children,
            disabled: !!child.props.disabled,
        });
    });
    return options;
}

export default function Select({ className = '', children, value, onChange, disabled = false, name, placeholder }) {
    const options = parseOptions(children);
    const stringValue = value === undefined || value === null ? '' : String(value);
    const selected = options.find((option) => option.value === stringValue);

    function handleChange(newValue) {
        onChange?.({ target: { name, value: newValue } });
    }

    return (
        <Listbox value={stringValue} onChange={handleChange} disabled={disabled}>
            {({ open }) => (
                <>
                    <ListboxButton
                        className={`${inputClass} flex w-full items-center justify-between gap-2 text-left ${
                            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        } ${className}`}
                    >
                        <span className={`truncate ${!selected || selected.disabled ? 'text-slate-400 dark:text-slate-500' : ''}`}>
                            {selected ? selected.label : (placeholder ?? ' ')}
                        </span>
                        <motion.span
                            animate={{ rotate: open ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex shrink-0 items-center text-slate-400 dark:text-slate-500"
                        >
                            <ChevronDown size={16} />
                        </motion.span>
                    </ListboxButton>

                    {/* Anchored + portaled: escapes any transformed ancestor (e.g. animated
                        Cards) so the panel never gets clipped or buried under later siblings. */}
                    <AnimatePresence>
                        {open && (
                            <ListboxOptions
                                static
                                anchor={{ to: 'bottom start', gap: 8 }}
                                as={motion.div}
                                initial={{ opacity: 0, scale: 0.97, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97, y: -4 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="menu-panel scrollbar-thin z-50 max-h-60 w-(--button-width) overflow-auto rounded-2xl p-1.5 shadow-xl shadow-slate-900/10 focus:outline-none"
                            >
                                {options.map((option) => (
                                    <ListboxOption
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
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        )}
                    </AnimatePresence>
                </>
            )}
        </Listbox>
    );
}
