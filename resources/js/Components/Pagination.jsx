import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function buildPageList(current, last, delta = 1) {
    if (last <= 1) return [1];

    const middle = [];
    for (let page = Math.max(2, current - delta); page <= Math.min(last - 1, current + delta); page++) {
        middle.push(page);
    }

    const withEdges = [1, ...middle, last];
    const result = [];
    let previous;
    for (const page of withEdges) {
        if (previous !== undefined) {
            if (page - previous === 2) result.push(previous + 1);
            else if (page - previous > 2) result.push('…');
        }
        result.push(page);
        previous = page;
    }
    return result;
}

export default function Pagination({ routeName, filters, pagination }) {
    const { current_page: currentPage, last_page: lastPage, per_page: perPage, total } = pagination;

    if (total === 0 || lastPage <= 1) return null;

    function goToPage(page) {
        if (page < 1 || page > lastPage || page === currentPage) return;
        const params = { ...filters, page };
        Object.keys(params).forEach((key) => {
            if (!params[key]) delete params[key];
        });
        router.get(route(routeName), params, { preserveState: true, preserveScroll: true, replace: true });
    }

    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);
    const pages = buildPageList(currentPage, lastPage);

    return (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-200/70 pt-4 sm:flex-row dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Mostrando <span className="font-medium text-slate-700 dark:text-slate-200">{from}</span>–
                <span className="font-medium text-slate-700 dark:text-slate-200">{to}</span> de{' '}
                <span className="font-medium text-slate-700 dark:text-slate-200">{total}</span>
            </p>

            <nav className="flex items-center gap-1" aria-label="Paginação">
                <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                    className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                    <ChevronLeft size={16} />
                </button>

                {pages.map((page, index) =>
                    page === '…' ? (
                        <span key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => goToPage(page)}
                            aria-current={page === currentPage ? 'page' : undefined}
                            className="focus-ring relative flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors"
                        >
                            {page === currentPage && (
                                <motion.span
                                    layoutId="pagination-active-pill"
                                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                    className="absolute inset-0 rounded-lg bg-linear-to-br from-brand-600 to-brand-500 shadow-sm shadow-brand-500/30"
                                />
                            )}
                            <span
                                className={`relative ${
                                    page === currentPage
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                {page}
                            </span>
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    aria-label="Próxima página"
                    className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                    <ChevronRight size={16} />
                </button>
            </nav>
        </div>
    );
}
