import Autocomplete from '@/Components/Form/Autocomplete';
import Input from '@/Components/Form/Input';
import { newClientId } from '@/Utils/clientId';
import { partColor } from '@/Utils/partColors';
import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import { AlertCircle, ChevronDown, Copy, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const FIELD_KEYS = ['name', 'printer_id', 'material_id', 'piece_weight_g', 'print_time_h', 'quantity_per_unit'];

function keyOf(part) {
    return part.id ?? part._cid;
}

function MiniField({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
            {children}
            {error && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>}
        </label>
    );
}

function PartRow({ part, index, printers, materials, errors, expanded, onToggle, onUpdate, onDuplicate, onRemove, canRemove }) {
    const dragControls = useDragControls();
    const hasError = FIELD_KEYS.some((field) => errors[`parts.${index}.${field}`]);

    const summary = [
        part.printer_id && printers.find((p) => String(p.id) === String(part.printer_id))?.name,
        part.material_id && materials.find((m) => String(m.id) === String(part.material_id))?.name,
        part.piece_weight_g && `${part.piece_weight_g} g`,
        Number(part.quantity_per_unit) > 1 && `×${part.quantity_per_unit}`,
        part.print_time_h && `${part.print_time_h} h`,
    ].filter(Boolean);

    return (
        <Reorder.Item
            value={part}
            as="div"
            dragListener={false}
            dragControls={dragControls}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/5"
        >
            <div className="flex items-center gap-1.5 py-2 pr-2 pl-1.5">
                <span
                    onPointerDown={(e) => dragControls.start(e)}
                    title="Arrastar para reordenar"
                    className="flex shrink-0 cursor-grab touch-none items-center text-slate-300 active:cursor-grabbing dark:text-slate-600"
                >
                    <GripVertical size={15} />
                </span>

                <button type="button" onClick={onToggle} className="focus-ring flex min-w-0 flex-1 items-center gap-2 rounded-lg py-0.5 text-left">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: partColor(index) }} />
                    <span
                        className={`shrink-0 truncate text-sm font-semibold ${
                            part.name ? 'text-slate-800 dark:text-slate-100' : 'italic text-slate-400 dark:text-slate-500'
                        }`}
                    >
                        {part.name || 'Parte sem nome'}
                    </span>
                    {!expanded && summary.length > 0 && (
                        <span className="truncate text-xs text-slate-400 dark:text-slate-500">{summary.join(' · ')}</span>
                    )}
                    {hasError && <AlertCircle size={13} className="shrink-0 text-red-500" />}
                </button>

                <div className="flex shrink-0 items-center gap-0.5">
                    <button
                        type="button"
                        onClick={onDuplicate}
                        title="Duplicar parte"
                        className="focus-ring rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-white/10 dark:hover:text-accent-400"
                    >
                        <Copy size={14} />
                    </button>
                    {canRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            title="Remover parte"
                            className="focus-ring rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onToggle}
                        title={expanded ? 'Recolher' : 'Expandir'}
                        className="focus-ring rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center">
                            <ChevronDown size={15} />
                        </motion.span>
                    </button>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 gap-3 border-t border-slate-200/70 p-3.5 dark:border-white/10">
                            <MiniField label="Nome da parte (ex.: Cabeça, Pernas)" error={errors[`parts.${index}.name`]}>
                                <Input
                                    value={part.name}
                                    onChange={(e) => onUpdate('name', e.target.value)}
                                    maxLength={255}
                                    placeholder="Ex.: Pernas (par)"
                                    autoFocus
                                />
                            </MiniField>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <MiniField label="Impressora" error={errors[`parts.${index}.printer_id`]}>
                                    <Autocomplete
                                        value={part.printer_id}
                                        onChange={(e) => onUpdate('printer_id', e.target.value)}
                                        placeholder="Buscar impressora..."
                                    >
                                        {printers.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </Autocomplete>
                                </MiniField>
                                <MiniField label="Material" error={errors[`parts.${index}.material_id`]}>
                                    <Autocomplete
                                        value={part.material_id}
                                        onChange={(e) => onUpdate('material_id', e.target.value)}
                                        placeholder="Buscar material..."
                                    >
                                        {materials.map((m) => (
                                            <option key={m.id} value={m.id} color={m.color}>
                                                {m.name}
                                            </option>
                                        ))}
                                    </Autocomplete>
                                </MiniField>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <MiniField label="Peso unitário (g)" error={errors[`parts.${index}.piece_weight_g`]}>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max="50000"
                                        value={part.piece_weight_g}
                                        onChange={(e) => onUpdate('piece_weight_g', e.target.value)}
                                    />
                                </MiniField>
                                <MiniField label="Qtd. por produto" error={errors[`parts.${index}.quantity_per_unit`]}>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="1000"
                                        value={part.quantity_per_unit}
                                        onChange={(e) => onUpdate('quantity_per_unit', e.target.value)}
                                    />
                                </MiniField>
                                <MiniField label="Tempo de impr. total (h)" error={errors[`parts.${index}.print_time_h`]}>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max="1000"
                                        value={part.print_time_h}
                                        onChange={(e) => onUpdate('print_time_h', e.target.value)}
                                    />
                                </MiniField>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Reorder.Item>
    );
}

export default function ProductPartsEditor({ parts, onChange, printers, materials, errors = {} }) {
    const [expandedKey, setExpandedKey] = useState(() => (parts.length === 1 ? keyOf(parts[0]) : null));

    useEffect(() => {
        const erroredIndex = parts.findIndex((_, index) => FIELD_KEYS.some((field) => errors[`parts.${index}.${field}`]));
        if (erroredIndex !== -1) {
            setExpandedKey(keyOf(parts[erroredIndex]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);

    function updatePart(index, field, value) {
        onChange(parts.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    }

    function addPart() {
        const part = { _cid: newClientId(), name: '', printer_id: '', material_id: '', piece_weight_g: '', print_time_h: '', quantity_per_unit: 1 };
        onChange([...parts, part]);
        setExpandedKey(keyOf(part));
    }

    function duplicatePart(index) {
        const source = parts[index];
        const clone = { ...source, id: undefined, _cid: newClientId(), name: source.name ? `${source.name} (cópia)` : '' };
        const next = [...parts];
        next.splice(index + 1, 0, clone);
        onChange(next);
        setExpandedKey(keyOf(clone));
    }

    function removePart(index) {
        onChange(parts.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-2">
            <Reorder.Group axis="y" as="div" values={parts} onReorder={onChange} className="space-y-2">
                <AnimatePresence initial={false}>
                    {parts.map((part, index) => {
                        const k = keyOf(part);
                        return (
                            <PartRow
                                key={k}
                                part={part}
                                index={index}
                                printers={printers}
                                materials={materials}
                                errors={errors}
                                expanded={expandedKey === k}
                                onToggle={() => setExpandedKey((current) => (current === k ? null : k))}
                                onUpdate={(field, value) => updatePart(index, field, value)}
                                onDuplicate={() => duplicatePart(index)}
                                onRemove={() => removePart(index)}
                                canRemove={parts.length > 1}
                            />
                        );
                    })}
                </AnimatePresence>
            </Reorder.Group>

            <motion.button
                type="button"
                onClick={addPart}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-white/15 dark:text-slate-400 dark:hover:border-accent-400/40 dark:hover:text-accent-400"
            >
                <Plus size={15} /> Adicionar parte
            </motion.button>
        </div>
    );
}
