import { router } from '@inertiajs/react';

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
