import Input from '@/Components/Form/Input';
import Select from '@/Components/Form/Select';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ListFilter, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * Generic, backend-driven filter bar: a debounced search box plus any number
 * of dynamic <select> filters, all reflected in the URL query string. Every
 * change is sent to the server (`routeName`) which does the actual
 * filtering — this component only manages the UI/debounce, never filters
 * data on the client.
 *
 * @param {object} props
 * @param {string} props.routeName - named route to `router.get` on change (e.g. "materials.index").
 * @param {object} props.filters - current filter values from the backend (e.g. { search, type }).
 * @param {{ name: string, label: string, allLabel?: string, options: { value: string, label: string }[] }[]} [props.selects]
 * @param {string} [props.searchPlaceholder]
 */
export default function FilterBar({ routeName, filters, selects = [], searchPlaceholder = 'Buscar...' }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectValues, setSelectValues] = useState(() => {
        const initial = {};
        selects.forEach((s) => {
            initial[s.name] = filters[s.name] ?? '';
        });
        return initial;
    });
    const isFirstRender = useRef(true);

    function apply(overrides = {}) {
        const params = { search, ...selectValues, ...overrides };
        Object.keys(params).forEach((key) => {
            if (!params[key]) delete params[key];
        });
        router.get(route(routeName), params, { preserveState: true, preserveScroll: true, replace: true });
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => apply(), 350);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    function handleSelectChange(name, value) {
        const next = { ...selectValues, [name]: value };
        setSelectValues(next);
        apply(next);
    }

    function clearFilters() {
        setSearch('');
        const cleared = {};
        selects.forEach((s) => {
            cleared[s.name] = '';
        });
        setSelectValues(cleared);
        router.get(route(routeName), {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    const hasActiveFilters = !!search || Object.values(selectValues).some(Boolean);

    return (
        <div className="mb-4 flex flex-col gap-3 border-b border-slate-200/70 pb-4 sm:flex-row sm:flex-wrap sm:items-center dark:border-white/10">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                <ListFilter size={14} /> Filtros
            </span>

            <div className="relative sm:w-56">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={searchPlaceholder} className="pl-9" />
            </div>

            {selects.map((s) => (
                <div key={s.name} className="sm:w-48">
                    <Select value={selectValues[s.name]} onChange={(e) => handleSelectChange(s.name, e.target.value)}>
                        <option value="">{s.allLabel ?? `Todos: ${s.label}`}</option>
                        {s.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </div>
            ))}

            <AnimatePresence>
                {hasActiveFilters && (
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={clearFilters}
                        className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
                    >
                        <X size={14} /> Limpar filtros
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
