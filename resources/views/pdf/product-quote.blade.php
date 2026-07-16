<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <title>Orçamento — {{ $product->name }}</title>
    <style>
        @page { margin: 28px 36px; }
        * { box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; color: #1e293b; font-size: 12px; }

        .header { width: 100%; border-bottom: 2px solid #4338ca; padding-bottom: 12px; margin-bottom: 18px; }
        .header td { vertical-align: middle; }
        .brand-name { font-size: 18px; font-weight: bold; color: #4338ca; }
        .brand-tag { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .quote-meta { text-align: right; font-size: 11px; color: #475569; }
        .quote-title { font-size: 20px; font-weight: bold; color: #0f172a; margin: 0 0 2px; }

        h2.section { font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color: #4338ca; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 18px 0 8px; }

        table.data { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
        table.data td { padding: 5px 0; font-size: 12px; }
        table.data td.label { color: #64748b; width: 60%; }
        table.data td.value { text-align: right; font-weight: bold; color: #0f172a; }
        table.data tr.total td { border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 13px; }
        table.data tr.total td.value { color: #4338ca; }

        .info-grid { width: 100%; border-collapse: collapse; }
        .info-grid td { padding: 4px 0; font-size: 12px; }
        .info-grid td.label { color: #64748b; width: 38%; }
        .info-grid td.value { font-weight: bold; color: #0f172a; }

        .price-box { margin-top: 16px; padding: 16px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; }
        .price-box .caption { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #047857; }
        .price-box .amount { font-size: 26px; font-weight: bold; color: #047857; margin-top: 2px; }
        .price-box .sub { font-size: 11px; color: #065f46; margin-top: 4px; }

        .total-order { margin-top: 10px; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 6px; }
        .total-order .caption { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
        .total-order .amount { font-size: 16px; font-weight: bold; color: #0f172a; }

        .client-line { margin-top: 22px; font-size: 12px; color: #334155; }
        .client-line .fill { display: inline-block; border-bottom: 1px solid #94a3b8; min-width: 260px; }

        .footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 9.5px; color: #94a3b8; text-align: center; }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td style="width: 56px;">
                <img src="data:image/png;base64,{{ $logo }}" width="44" height="44" alt="Logo">
            </td>
            <td>
                <div class="brand-name">{{ config('app.name') }}</div>
                <div class="brand-tag">Precificação de impressão 3D</div>
            </td>
            <td class="quote-meta">
                <div class="quote-title">Orçamento</div>
                Nº {{ str_pad($product->id, 5, '0', STR_PAD_LEFT) }}<br>
                Emitido em {{ $product->created_at?->timezone(config('app.timezone'))->format('d/m/Y') ?? now()->format('d/m/Y') }}<br>
                Válido por 7 dias
            </td>
        </tr>
    </table>

    <div class="client-line">Cliente: <span class="fill">&nbsp;</span></div>

    <h2 class="section">Dados da peça</h2>
    <table class="info-grid">
        <tr>
            <td class="label">Produto</td>
            <td class="value">{{ $product->name }}</td>
        </tr>
        <tr>
            <td class="label">Impressora</td>
            <td class="value">{{ $product->printer?->name ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Material</td>
            <td class="value">{{ $product->material?->name ?? '—' }}{{ $product->material?->color ? ' ('.$product->material->color.')' : '' }}</td>
        </tr>
        <tr>
            <td class="label">Peso por peça</td>
            <td class="value">{{ number_format($product->piece_weight_g, 2, ',', '.') }} g</td>
        </tr>
        <tr>
            <td class="label">Tempo de impressão (total)</td>
            <td class="value">{{ number_format($product->print_time_h, 2, ',', '.') }} h</td>
        </tr>
        <tr>
            <td class="label">Quantidade</td>
            <td class="value">{{ $pricing['quantity'] }} un.</td>
        </tr>
    </table>

    <h2 class="section">Composição de custo (por peça)</h2>
    <table class="data">
        <tr><td class="label">Material</td><td class="value">R$ {{ number_format($pricing['material_cost'], 2, ',', '.') }}</td></tr>
        <tr><td class="label">Energia</td><td class="value">R$ {{ number_format($pricing['energy_cost'], 2, ',', '.') }}</td></tr>
        <tr><td class="label">Depreciação/manutenção da impressora</td><td class="value">R$ {{ number_format($pricing['machine_cost'], 2, ',', '.') }}</td></tr>
        <tr><td class="label">Mão de obra</td><td class="value">R$ {{ number_format($pricing['labor_cost'], 2, ',', '.') }}</td></tr>
        <tr><td class="label">Custos fixos extras</td><td class="value">R$ {{ number_format($pricing['extra_fixed_costs'], 2, ',', '.') }}</td></tr>
        <tr><td class="label">Perdas/falhas ({{ number_format($pricing['failure_pct'] * 100, 1, ',', '.') }}%)</td><td class="value">—</td></tr>
        <tr class="total"><td class="label">Custo total com perdas</td><td class="value">R$ {{ number_format($pricing['cost_with_losses'], 2, ',', '.') }}</td></tr>
    </table>

    <div class="price-box">
        <div class="caption">Preço sugerido por peça</div>
        <div class="amount">R$ {{ number_format($pricing['suggested_price_per_unit'], 2, ',', '.') }}</div>
        <div class="sub">
            Impostos: R$ {{ number_format($pricing['tax_amount'], 2, ',', '.') }} ·
            Taxas: R$ {{ number_format($pricing['fee_amount'], 2, ',', '.') }} ·
            Lucro: R$ {{ number_format($pricing['profit_per_unit'], 2, ',', '.') }}
        </div>
    </div>

    @if ($pricing['quantity'] > 1)
        <div class="total-order">
            <div class="caption">Total do pedido ({{ $pricing['quantity'] }} un.)</div>
            <div class="amount">R$ {{ number_format($pricing['total_price'], 2, ',', '.') }}</div>
        </div>
    @endif

    <div class="footer">
        Orçamento gerado por {{ $user->name }} via {{ config('app.name') }} em {{ now()->format('d/m/Y \à\s H:i') }}.
    </div>
</body>
</html>
