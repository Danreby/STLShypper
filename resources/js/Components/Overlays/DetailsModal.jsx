import Modal from '@/Components/Overlays/Modal';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import { Pencil } from 'lucide-react';

/**
 * Modal de "ver detalhes" genérico, aberto ao clicar numa linha do DataTable.
 *
 * @param {object} props
 * @param {boolean} props.show
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {{ label: string, value: any, className?: string }[]} props.fields
 * @param {() => void} [props.onEdit] - se informado, mostra o botão "Editar".
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'} [props.maxWidth]
 */
export default function DetailsModal({ show, onClose, title, subtitle, fields, onEdit, maxWidth = 'lg' }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth}>
            <div className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}

                <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    {(fields ?? []).map(({ label, value, className = '' }, index) => (
                        <div key={index} className={className}>
                            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                                {value === null || value === undefined || value === '' ? '—' : value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-6 flex items-center justify-end gap-3">
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
