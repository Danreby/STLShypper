import ScrollArea from '@/Components/ScrollArea';
import { motion } from 'framer-motion';

/**
 * Tabela genérica usada pelas páginas de recursos (Materiais/Impressoras/Produtos).
 *
 * @param {object} props
 * @param {{ key: string, header: string, render?: (row: object) => any, className?: string }[]} props.columns
 * @param {object[]} props.rows
 * @param {(row: object) => any} [props.actions] - render prop para a coluna de ações (editar/remover).
 * @param {string} props.emptyMessage
 * @param {(row: object) => number|string} [props.rowKey]
 */
export default function DataTable({ columns, rows, actions, emptyMessage, rowKey = (row) => row.id }) {
    const colSpan = columns.length + (actions ? 1 : 0);

    return (
        <ScrollArea direction="horizontal" fade className="-mx-5 px-5 sm:-mx-6 sm:px-6">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-200/70 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">
                        {columns.map((column) => (
                            <th key={column.key} className="whitespace-nowrap py-2.5 pr-4 font-medium">
                                {column.header}
                            </th>
                        ))}
                        {actions && <th className="py-2.5 pr-4" />}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <motion.tr
                            key={rowKey(row)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: Math.min(index * 0.035, 0.4) }}
                            className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5"
                        >
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
                            {actions && <td className="py-2.5 pr-4 text-right">{actions(row)}</td>}
                        </motion.tr>
                    ))}
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
