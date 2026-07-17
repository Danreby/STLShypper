import ScrollArea from '@/Components/ScrollArea';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Fragment, useState } from 'react';

function SortIcon({ active, direction }) {
    if (!active) {
        return <ArrowUpDown size={13} className="opacity-40 transition-opacity group-hover:opacity-70" />;
    }
    return direction === 'desc' ? (
        <ArrowDown size={13} className="text-brand-600 dark:text-accent-400" />
    ) : (
        <ArrowUp size={13} className="text-brand-600 dark:text-accent-400" />
    );
}

export default function DataTable({
    columns,
    rows,
    actions,
    emptyMessage,
    rowKey = (row) => row.id,
    sort,
    direction,
    onSort,
    onRowClick,
    isExpandable,
    renderExpanded,
}) {
    const [expanded, setExpanded] = useState(() => new Set());
    const hasExpandColumn = Boolean(renderExpanded);
    const colSpan = columns.length + (actions ? 1 : 0) + (hasExpandColumn ? 1 : 0);

    function toggle(key) {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }

    return (
        <ScrollArea direction="horizontal" fade className="-mx-5 px-5 sm:-mx-6 sm:px-6">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-200/70 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">
                        {hasExpandColumn && <th className="w-8 py-2.5" />}
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="whitespace-nowrap py-2.5 pr-4 font-medium"
                                aria-sort={column.sortable ? (sort === column.key ? (direction === 'desc' ? 'descending' : 'ascending') : 'none') : undefined}
                            >
                                {column.sortable ? (
                                    <button
                                        type="button"
                                        onClick={() => onSort?.(column.key)}
                                        className="focus-ring group inline-flex items-center gap-1 uppercase tracking-wide text-inherit transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                                    >
                                        {column.header}
                                        <SortIcon active={sort === column.key} direction={direction} />
                                    </button>
                                ) : (
                                    column.header
                                )}
                            </th>
                        ))}
                        {actions && <th className="py-2.5 pr-4" />}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => {
                        const key = rowKey(row);
                        const canExpand = hasExpandColumn && (!isExpandable || isExpandable(row));
                        const isOpen = canExpand && expanded.has(key);

                        return (
                            <Fragment key={key}>
                                <motion.tr
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: Math.min(index * 0.035, 0.4) }}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    className={`border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5 ${onRowClick ? 'cursor-pointer' : ''} ${isOpen ? 'bg-brand-50/40 dark:bg-white/5' : ''}`}
                                >
                                    {hasExpandColumn && (
                                        <td className="py-2.5 pl-0.5" onClick={(e) => e.stopPropagation()}>
                                            {canExpand && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggle(key)}
                                                    aria-expanded={isOpen}
                                                    aria-label={isOpen ? 'Recolher' : 'Expandir'}
                                                    className="focus-ring flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-200"
                                                >
                                                    <motion.span
                                                        animate={{ rotate: isOpen ? 90 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex items-center"
                                                    >
                                                        <ChevronRight size={15} />
                                                    </motion.span>
                                                </button>
                                            )}
                                        </td>
                                    )}
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={column.key}
                                            className={
                                                column.className ??
                                                (colIndex === 0
                                                    ? 'py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100'
                                                    : 'py-2.5 pr-4 text-slate-600 dark:text-slate-300')
                                            }
                                        >
                                            {column.render ? column.render(row) : row[column.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="py-2.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            {actions(row)}
                                        </td>
                                    )}
                                </motion.tr>
                                {hasExpandColumn && (
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <tr>
                                                <td colSpan={colSpan} className="border-b border-slate-100 p-0 dark:border-white/5">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25, ease: 'easeOut' }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="bg-slate-50/60 px-4 py-3.5 dark:bg-white/3">{renderExpanded(row)}</div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                )}
                            </Fragment>
                        );
                    })}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={colSpan} className="py-8 text-center text-slate-400 dark:text-slate-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </ScrollArea>
    );
}
