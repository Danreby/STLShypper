import Autocomplete from '@/Components/Form/Autocomplete';
import Input from '@/Components/Form/Input';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

function MiniField({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
            {children}
            {error && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>}
        </label>
    );
}

/**
 * Editor de partes de um produto composto (ex.: cabeça, pernas, braços) — cada parte é uma
 * impressão separada, com sua própria impressora, material, peso e tempo.
 *
 * @param {{ parts: Array, onChange: (parts: Array) => void, printers: Array, materials: Array, errors?: Record<string,string> }} props
 */
export default function ProductPartsEditor({ parts, onChange, printers, materials, errors = {} }) {
    function updatePart(index, field, value) {
        onChange(parts.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    }

    function addPart() {
        onChange([...parts, { name: '', printer_id: '', material_id: '', piece_weight_g: '', print_time_h: '', quantity_per_unit: 1 }]);
    }

    function removePart(index) {
        onChange(parts.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-3">
            <AnimatePresence initial={false}>
                {parts.map((part, index) => (
                    <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.2 }}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-white/10 dark:bg-white/5"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/10 text-[11px] font-semibold text-brand-600 dark:bg-accent-400/10 dark:text-accent-400">
                                {index + 1}
                            </span>
                            {parts.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePart(index)}
                                    title="Remover parte"
                                    className="focus-ring rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <MiniField label="Nome da parte (ex.: Cabeça, Pernas)" error={errors[`parts.${index}.name`]}>
                                <Input
                                    value={part.name}
                                    onChange={(e) => updatePart(index, 'name', e.target.value)}
                                    maxLength={255}
                                    placeholder="Ex.: Pernas (par)"
                                />
                            </MiniField>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <MiniField label="Impressora" error={errors[`parts.${index}.printer_id`]}>
                                    <Autocomplete
                                        value={part.printer_id}
                                        onChange={(e) => updatePart(index, 'printer_id', e.target.value)}
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
                                        onChange={(e) => updatePart(index, 'material_id', e.target.value)}
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
                                        onChange={(e) => updatePart(index, 'piece_weight_g', e.target.value)}
                                    />
                                </MiniField>
                                <MiniField label="Qtd. por produto" error={errors[`parts.${index}.quantity_per_unit`]}>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="1000"
                                        value={part.quantity_per_unit}
                                        onChange={(e) => updatePart(index, 'quantity_per_unit', e.target.value)}
                                    />
                                </MiniField>
                                <MiniField label="Tempo de impr. total (h)" error={errors[`parts.${index}.print_time_h`]}>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max="1000"
                                        value={part.print_time_h}
                                        onChange={(e) => updatePart(index, 'print_time_h', e.target.value)}
                                    />
                                </MiniField>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

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
