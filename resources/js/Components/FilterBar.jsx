import Autocomplete from '@/Components/Form/Autocomplete';
import Input from '@/Components/Form/Input';
import Select from '@/Components/Form/Select';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ListFilter, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
        // Spreading `filters` first carries forward anything this component doesn't
        // manage itself — namely `sort`/`direction` set by the table's column headers.
        const params = { ...filters, search, ...selectValues, ...overrides };
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

        // Clearing filters shouldn't reset the table's sort order — keep it.
        const params = { sort: filters.sort, direction: filters.direction };
        Object.keys(params).forEach((key) => {
            if (!params[key]) delete params[key];
        });
        router.get(route(routeName), params, { preserveState: true, preserveScroll: true, replace: true });
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

            {selects.map((s) => {
                const SelectComponent = s.searchable ? Autocomplete : Select;
                return (
                    <div key={s.name} className="sm:w-48">
                        <SelectComponent
                            value={selectValues[s.name]}
                            onChange={(e) => handleSelectChange(s.name, e.target.value)}
                            placeholder={s.allLabel ?? `Todos: ${s.label}`}
                        >
                            {!s.searchable && <option value="">{s.allLabel ?? `Todos: ${s.label}`}</option>}
                            {s.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </SelectComponent>
                    </div>
                );
            })}

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
