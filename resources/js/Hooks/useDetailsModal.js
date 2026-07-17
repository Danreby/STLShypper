import { useState } from 'react';

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
