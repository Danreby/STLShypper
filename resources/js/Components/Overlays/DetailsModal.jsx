import Modal from '@/Components/Overlays/Modal';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

/**
 * Modal de "ver detalhes" genérico, aberto ao clicar numa linha do DataTable.
 *
 * @param {object} props
 * @param {boolean} props.show
 * @param {() => void} props.onClose
 * @param {import('lucide-react').LucideIcon} [props.icon] - ícone exibido no badge do cabeçalho.
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {string} [props.accentColor] - hex opcional; tinge o cabeçalho com a cor do próprio registro (ex.: cor do material).
 * @param {{ label: string, value: any, icon?: import('lucide-react').LucideIcon, className?: string }[]} props.fields
 * @param {() => void} [props.onEdit] - se informado, mostra o botão "Editar".
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'} [props.maxWidth]
 */
export default function DetailsModal({ show, onClose, icon: Icon, title, subtitle, accentColor, fields, onEdit, maxWidth = 'lg' }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth}>
            <div
                className={`relative overflow-hidden rounded-t-3xl px-6 py-7 text-white sm:px-8 ${
                    accentColor ? '' : 'bg-linear-to-br from-brand-600 via-violet-500 to-accent-500'
                }`}
                style={accentColor ? { backgroundColor: accentColor } : undefined}
            >
                {accentColor && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />}
                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <div className="relative flex items-center gap-3">
                    {Icon && (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                            <Icon size={22} />
                        </span>
                    )}
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold">{title}</h2>
                        {subtitle && <p className="truncate text-sm text-white/80">{subtitle}</p>}
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {(fields ?? []).map(({ label, value, icon: FieldIcon, className = '' }, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.35), ease: 'easeOut' }}
                            className={`rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3.5 transition-colors hover:border-brand-200 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 ${className}`}
                        >
                            <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                {FieldIcon && <FieldIcon size={13} />}
                                {label}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {value === null || value === undefined || value === '' ? '—' : value}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-white/10">
                    <SecondaryButton type="button" onClick={onClose}>
                        Fechar
                    </SecondaryButton>
                    {onEdit && (
                        <PrimaryButton type="button" onClick={onEdit}>
                            <Pencil size={15} /> Editar
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </Modal>
    );
}
