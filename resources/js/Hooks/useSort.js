import { router } from '@inertiajs/react';

/**
 * Drives server-side column sorting for a resource's index page, keeping it
 * in the same URL query string used by FilterBar (`sort` + `direction`).
 * Clicking a column: not active -> ascending; active ascending -> descending;
 * active descending -> ascending again.
 *
 * @param {string} routeName - named route to `router.get` on change (e.g. "materials.index").
 * @param {object} filters - current filters (must include `sort`/`direction` as returned by the backend).
 */
export default function useSort(routeName, filters) {
    function onSort(key) {
        const nextDirection = filters.sort === key && filters.direction === 'asc' ? 'desc' : 'asc';
        const params = { ...filters, sort: key, direction: nextDirection };
        Object.keys(params).forEach((paramKey) => {
            if (!params[paramKey]) delete params[paramKey];
        });
        router.get(route(routeName), params, { preserveState: true, preserveScroll: true, replace: true });
    }

    return { sort: filters.sort, direction: filters.direction ?? 'asc', onSort };
}
