import { useState } from 'react';

/**
 * Estado para o modal de "ver detalhes" aberto ao clicar numa linha do DataTable.
 *
 * `row` só é atualizado ao abrir — nunca é zerado ao fechar — para que o
 * conteúdo continue visível (em vez de sumir) durante a animação de saída
 * do modal, que fica montado por mais alguns instantes depois de `show`
 * virar `false`.
 */
export default function useDetailsModal() {
    const [row, setRow] = useState(null);
    const [show, setShow] = useState(false);

    function view(newRow) {
        setRow(newRow);
        setShow(true);
    }

    function close() {
        setShow(false);
    }

    return { row, show, view, close };
}
