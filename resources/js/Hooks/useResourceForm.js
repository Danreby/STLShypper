import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Encapsula o padrão repetido de CRUD via Inertia (criar OU editar no mesmo
 * formulário, com toggle por `editingId`, e remover via `router.delete`).
 *
 * @param {object} options
 * @param {object} options.emptyForm - valores iniciais do formulário de criação.
 * @param {string} options.storeUrl - URL do POST de criação.
 * @param {(id: number) => string} options.updateUrl - URL do PATCH de edição.
 * @param {(id: number) => string} options.deleteUrl - URL do DELETE.
 * @param {(row: object) => object} options.mapRowToForm - converte uma linha existente nos campos do formulário.
 */
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
