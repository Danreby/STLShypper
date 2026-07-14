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
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        {columns.map((column) => (
                            <th key={column.key} className="py-2 pr-4">{column.header}</th>
                        ))}
                        {actions && <th className="py-2 pr-4" />}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={rowKey(row)} className="border-b border-slate-100">
                            {columns.map((column, index) => (
                                <td
                                    key={column.key}
                                    className={column.className ?? (index === 0 ? 'py-2 pr-4 font-medium text-slate-800' : 'py-2 pr-4')}
                                >
                                    {column.render ? column.render(row) : row[column.key]}
                                </td>
                            ))}
                            {actions && <td className="py-2 pr-4 text-right">{actions(row)}</td>}
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={colSpan} className="py-4 text-center text-slate-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
