import axios from 'axios';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx-js-style';

const HEADER_FILL = { patternType: 'solid', fgColor: { rgb: '1f2b5e' } };
const HEADER_FONT = { color: { rgb: 'ffffff' }, bold: true };
const ALT_ROW_FILL = { patternType: 'solid', fgColor: { rgb: 'eef0fb' } };
const TOTAL_FILL = { patternType: 'solid', fgColor: { rgb: 'fff2cc' } };
const BORDER = {
    top: { style: 'thin', color: { rgb: 'd9d9d9' } },
    bottom: { style: 'thin', color: { rgb: 'd9d9d9' } },
    left: { style: 'thin', color: { rgb: 'd9d9d9' } },
    right: { style: 'thin', color: { rgb: 'd9d9d9' } },
};
const CURRENCY_FMT = 'R$ #,##0.00';
const PERCENT_FMT = '0.00%';
const INTEGER_FMT = '#,##0';

function decorateSheet(worksheet, { currencyCols = [], percentCols = [], integerCols = [], hyperlinkCols = [], boldRowIndexes = [] } = {}) {
    const ref = worksheet['!ref'];
    if (!ref) return worksheet;

    const range = XLSX.utils.decode_range(ref);
    const headerNames = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c });
        headerNames.push(worksheet[addr]?.v ?? '');
    }

    const columnWidths = headerNames.map((name, c) => {
        let max = String(name).length;
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            const val = worksheet[addr]?.v;
            if (val != null) max = Math.max(max, String(val).length);
        }
        return { wch: max + 3 };
    });
    worksheet['!cols'] = columnWidths;

    for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c });
        if (worksheet[addr]) {
            worksheet[addr].s = { fill: HEADER_FILL, font: HEADER_FONT, border: BORDER };
        }
    }

    const currencySet = new Set(currencyCols);
    const percentSet = new Set(percentCols);
    const integerSet = new Set(integerCols);
    const hyperlinkSet = new Set(hyperlinkCols);

    for (let r = range.s.r + 1; r <= range.e.r; r++) {
        const isTotalRow = boldRowIndexes.includes(r);
        for (let c = range.s.c; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = worksheet[addr];
            if (!cell) continue;

            const headerName = headerNames[c - range.s.c];
            const style = { border: BORDER };

            if (cell.t === 'n') {
                if (currencySet.has(headerName)) style.numFmt = CURRENCY_FMT;
                else if (percentSet.has(headerName)) style.numFmt = PERCENT_FMT;
                else if (integerSet.has(headerName)) style.numFmt = INTEGER_FMT;
            }

            if (hyperlinkSet.has(headerName) && cell.v) {
                cell.l = { Target: String(cell.v), Tooltip: 'Abrir link de compra' };
                style.font = { color: { rgb: '2563eb' }, underline: true };
            }

            if (isTotalRow) {
                style.fill = TOTAL_FILL;
                style.font = { bold: true };
            } else if ((r - range.s.r) % 2 === 0) {
                style.fill = ALT_ROW_FILL;
            }

            cell.s = style;
        }
    }

    return worksheet;
}

function keyValueSheet(rows, formats) {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const currencyCols = [];
    const percentCols = [];
    const integerCols = [];

    rows.forEach((row, index) => {
        const format = formats[index];
        if (format === 'currency' || format === 'currency4') currencyCols.push('Valor');
        if (format === 'percent') percentCols.push('Valor');
        if (format === 'integer') integerCols.push('Valor');
    });

    return decorateSheet(worksheet, {
        currencyCols: [...new Set(currencyCols)],
        percentCols: [...new Set(percentCols)],
        integerCols: [...new Set(integerCols)],
    });
}

function buildWorkbook({ settings, printers, materials, products, summary }) {
    const workbook = XLSX.utils.book_new();

    const parametros = keyValueSheet(
        [
            { Parâmetro: 'Valor do kWh (R$)', Valor: settings.kwh_price, Observação: 'Confira na sua conta de energia' },
            { Parâmetro: 'Mão de obra (R$/h)', Valor: settings.labor_rate, Observação: 'Custo-hora para preparo e acabamento' },
            { Parâmetro: '% de perdas/falhas', Valor: settings.failure_pct, Observação: 'Peças perdidas por falha de impressão' },
            { Parâmetro: '% de material extra', Valor: settings.extra_material_pct, Observação: 'Purga, suportes e testes' },
            { Parâmetro: 'Taxa de impostos (%)', Valor: settings.tax_pct, Observação: 'Ex.: MEI/Simples Nacional' },
            { Parâmetro: 'Taxa de cartão/marketplace (%)', Valor: settings.fee_pct, Observação: 'Maquininha, gateway ou marketplace' },
            { Parâmetro: 'Margem de lucro padrão (%)', Valor: settings.margin_pct, Observação: 'Margem-alvo usada como padrão' },
            { Parâmetro: 'Horas de uso da impressora/ano', Valor: settings.hours_per_year, Observação: 'Usada para ratear a manutenção anual' },
        ],
        ['currency4', 'currency', 'percent', 'percent', 'percent', 'percent', 'percent', 'integer'],
    );
    XLSX.utils.book_append_sheet(workbook, parametros, 'Parâmetros Gerais');

    const impressoras = decorateSheet(
        XLSX.utils.json_to_sheet(
            printers.map((p) => ({
                Nome: p.name,
                'Preço de Compra (R$)': p.purchase_price,
                'Vida Útil (h)': p.useful_life_hours,
                'Potência (W)': p.power_w,
                'Manutenção Anual (R$)': p.annual_maintenance,
                'Depreciação (R$/h)': p.depreciation_per_hour,
                'Manutenção (R$/h)': p.maintenance_per_hour,
                'Custo Máquina Total (R$/h)': p.total_cost_per_hour,
                'Link de Compra': p.purchase_url ?? '',
            })),
        ),
        {
            currencyCols: ['Preço de Compra (R$)', 'Manutenção Anual (R$)', 'Depreciação (R$/h)', 'Manutenção (R$/h)', 'Custo Máquina Total (R$/h)'],
            integerCols: ['Vida Útil (h)', 'Potência (W)'],
            hyperlinkCols: ['Link de Compra'],
        },
    );
    XLSX.utils.book_append_sheet(workbook, impressoras, 'Impressoras');

    const materiaisSheet = decorateSheet(
        XLSX.utils.json_to_sheet(
            materials.map((m) => ({
                Nome: m.name,
                Tipo: m.type,
                'Preço/kg (R$)': m.price_per_kg,
                'Preço/g (R$)': m.price_per_gram,
                Observações: m.notes ?? '',
                'Link de Compra': m.purchase_url ?? '',
            })),
        ),
        { currencyCols: ['Preço/kg (R$)', 'Preço/g (R$)'], hyperlinkCols: ['Link de Compra'] },
    );
    XLSX.utils.book_append_sheet(workbook, materiaisSheet, 'Materiais');

    const productRows = products.map((p) => ({
        Produto: p.name,
        Impressora: p.printer_name ?? '—',
        Material: p.material_name ?? '—',
        'Peso peça (g)': Number(p.piece_weight_g),
        '% extra material': p.pricing.extra_material_pct,
        'Peso total (g)': p.pricing.total_weight_g,
        'Custo Material (R$)': p.pricing.material_cost,
        'Tempo Impressão (h)': Number(p.print_time_h),
        'Custo Energia (R$)': p.pricing.energy_cost,
        'Custo Deprec./Manut. (R$)': p.pricing.machine_cost,
        'Mão de Obra (R$)': p.pricing.labor_cost,
        'Custos Fixos Extras (R$)': p.pricing.extra_fixed_costs,
        '% Perdas': p.pricing.failure_pct,
        'Subtotal Custo (R$)': p.pricing.subtotal_cost,
        'Custo c/ Perdas (R$)': p.pricing.cost_with_losses,
        '% Impostos': p.pricing.tax_pct,
        '% Taxa Cartão': p.pricing.fee_pct,
        '% Margem': p.pricing.margin_pct,
        'Preço Sugerido/un (R$)': p.pricing.suggested_price_per_unit,
        'Quantidade (un)': p.pricing.quantity,
        'Preço Total (R$)': p.pricing.total_price,
        'Lucro/un (R$)': p.pricing.profit_per_unit,
        'Lucro Total (R$)': p.pricing.total_profit,
    }));

    productRows.push({
        Produto: 'TOTAL',
        Impressora: '',
        Material: '',
        'Peso peça (g)': '',
        '% extra material': '',
        'Peso total (g)': '',
        'Custo Material (R$)': '',
        'Tempo Impressão (h)': '',
        'Custo Energia (R$)': '',
        'Custo Deprec./Manut. (R$)': '',
        'Mão de Obra (R$)': '',
        'Custos Fixos Extras (R$)': '',
        '% Perdas': '',
        'Subtotal Custo (R$)': '',
        'Custo c/ Perdas (R$)': '',
        '% Impostos': '',
        '% Taxa Cartão': '',
        '% Margem': '',
        'Preço Sugerido/un (R$)': '',
        'Quantidade (un)': summary.total_quantity,
        'Preço Total (R$)': summary.total_revenue,
        'Lucro/un (R$)': '',
        'Lucro Total (R$)': summary.total_profit,
    });

    const produtos = decorateSheet(XLSX.utils.json_to_sheet(productRows), {
        currencyCols: [
            'Custo Material (R$)',
            'Custo Energia (R$)',
            'Custo Deprec./Manut. (R$)',
            'Mão de Obra (R$)',
            'Custos Fixos Extras (R$)',
            'Subtotal Custo (R$)',
            'Custo c/ Perdas (R$)',
            'Preço Sugerido/un (R$)',
            'Preço Total (R$)',
            'Lucro/un (R$)',
            'Lucro Total (R$)',
        ],
        percentCols: ['% extra material', '% Perdas', '% Impostos', '% Taxa Cartão', '% Margem'],
        integerCols: ['Quantidade (un)'],
        boldRowIndexes: [productRows.length],
    });
    XLSX.utils.book_append_sheet(workbook, produtos, 'Tabela de Produtos');

    const resumo = keyValueSheet(
        [
            { Métrica: 'Produtos cadastrados', Valor: summary.products_count },
            { Métrica: 'Quantidade total de peças', Valor: summary.total_quantity },
            { Métrica: 'Custo Total Estimado (R$)', Valor: summary.total_cost },
            { Métrica: 'Receita Total Estimada (R$)', Valor: summary.total_revenue },
            { Métrica: 'Lucro Total Estimado (R$)', Valor: summary.total_profit },
            { Métrica: 'Margem Média Real (%)', Valor: summary.margin_pct },
        ].map(({ Métrica, Valor }) => ({ Parâmetro: Métrica, Valor })),
        ['integer', 'integer', 'currency', 'currency', 'currency', 'percent'],
    );
    XLSX.utils.book_append_sheet(workbook, resumo, 'Resumo');

    return workbook;
}

const VARIANTS = {
    default:
        'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10',
    'on-dark': 'border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20',
};

export default function ExportExcel({ className = '', variant = 'default' }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleExport() {
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.get('/exportar');
            const workbook = buildWorkbook(data);
            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
            saveAs(blob, `Precificacao_3D_${date}.xlsx`);
        } catch {
            setError('Não foi possível gerar a planilha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={className}>
            <motion.button
                type="button"
                onClick={handleExport}
                disabled={loading}
                whileHover={loading ? {} : { y: -1 }}
                whileTap={loading ? {} : { scale: 0.97 }}
                title="Exportar planilha completa (Parâmetros, Impressoras, Materiais, Produtos e Resumo)"
                className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]}`}
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                {loading ? 'Gerando planilha...' : 'Exportar planilha'}
                {!loading && <Download size={14} className="opacity-60" />}
            </motion.button>
            {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
