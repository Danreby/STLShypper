import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function useResourceForm({ emptyForm, storeUrl, updateUrl, deleteUrl, mapRowToForm }) {
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm(emptyForm);

    function openCreate() {
        setEditingId(null);
        reset();
        clearErrors();
        setShowModal(true);
    }

    function startEdit(row) {
        setEditingId(row.id);
        setData(mapRowToForm(row));
        clearErrors();
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingId(null);
        reset();
        clearErrors();
    }

    function submit(e) {
        e.preventDefault();
        if (editingId) {
            patch(updateUrl(editingId), { preserveScroll: true, onSuccess: () => closeModal() });
        } else {
            post(storeUrl, { preserveScroll: true, onSuccess: () => closeModal() });
        }
    }

    function destroy(row, confirmMessage) {
        if (!confirm(confirmMessage)) return;
        router.delete(deleteUrl(row.id), { preserveScroll: true });
    }

    return { data, setData, errors, processing, editingId, showModal, openCreate, startEdit, closeModal, submit, destroy };
}
