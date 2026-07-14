import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function useResourceForm({ emptyForm, storeUrl, updateUrl, deleteUrl, mapRowToForm }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, patch, processing, errors, reset } = useForm(emptyForm);

    function startEdit(row) {
        setEditingId(row.id);
        setData(mapRowToForm(row));
    }

    function cancelEdit() {
        setEditingId(null);
        reset();
    }

    function submit(e) {
        e.preventDefault();
        if (editingId) {
            patch(updateUrl(editingId), { preserveScroll: true, onSuccess: () => cancelEdit() });
        } else {
            post(storeUrl, { preserveScroll: true, onSuccess: () => reset() });
        }
    }

    function destroy(row, confirmMessage) {
        if (!confirm(confirmMessage)) return;
        router.delete(deleteUrl(row.id), { preserveScroll: true });
    }

    return { data, setData, errors, processing, editingId, startEdit, cancelEdit, submit, destroy };
}
