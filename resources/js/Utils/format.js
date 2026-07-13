export function formatCurrency(value) {
    const num = Number(value ?? 0);
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatPercent(value) {
    const num = Number(value ?? 0) * 100;
    return `${num.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
}

export function toPercentInput(value) {
    if (value === null || value === undefined || value === '') return '';
    return (Number(value) * 100).toString();
}

export function fromPercentInput(value) {
    if (value === null || value === undefined || value === '') return null;
    return Number(value) / 100;
}
