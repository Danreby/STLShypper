import AlertError from '@/Components/Feedback/AlertError';
import AlertSuccess from '@/Components/Feedback/AlertSuccess';
import DangerButton from '@/Components/Buttons/DangerButton';
import GoogleAuthButton from '@/Components/Buttons/GoogleAuthButton';
import GoogleIcon from '@/Components/Icons/GoogleIcon';
import Modal from '@/Components/Overlays/Modal';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import { router, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Unlink } from 'lucide-react';
import { useState } from 'react';

export default function GoogleConnectionCard({ className = '', status }) {
    const user = usePage().props.auth.user;
    const errors = usePage().props.errors;
    const [confirming, setConfirming] = useState(false);
    const [connectFeedback, setConnectFeedback] = useState(null);

    const { delete: destroy, processing } = useForm({});

    const disconnect = (e) => {
        e.preventDefault();

        destroy(route('profile.google.destroy'), {
            preserveScroll: true,
            onSuccess: () => setConfirming(false),
        });
    };

    const handleConnected = () => {
        setConnectFeedback({ type: 'success', message: 'Conta Google conectada com sucesso.' });
        router.reload({ only: ['auth'] });
    };

    const handleConnectError = (message) => {
        setConnectFeedback({ type: 'error', message });
    };

    const connected = Boolean(user.google_id);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Conexões</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Sincronize sua conta com o Google para entrar com um clique.
                </p>
            </header>

            <div className="mt-6 space-y-4">
                {status === 'google-disconnected' && <AlertSuccess message="Conta Google desconectada." />}
                {errors?.google && <AlertError message={errors.google} />}
                {connectFeedback?.type === 'success' && <AlertSuccess message={connectFeedback.message} />}
                {connectFeedback?.type === 'error' && <AlertError message={connectFeedback.message} />}

                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5">
                            <GoogleIcon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white">
                                Google
                                {connected && <CheckCircle2 size={14} className="text-emerald-500" />}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {connected ? 'Conectado — login com um clique habilitado.' : 'Não conectado.'}
                            </p>
                        </div>
                    </div>

                    {connected ? (
                        <SecondaryButton type="button" onClick={() => setConfirming(true)} className="shrink-0">
                            <Unlink size={15} />
                            Desconectar
                        </SecondaryButton>
                    ) : (
                        <GoogleAuthButton
                            label="Conectar com Google"
                            endpoint="profile.google.store"
                            onSuccess={handleConnected}
                            onError={handleConnectError}
                            className="shrink-0 sm:w-auto"
                        />
                    )}
                </div>

                {connected && !user.has_password && (
                    <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <span>
                            Sua conta ainda não tem uma senha. Defina uma na aba <strong>Segurança</strong> antes de
                            desconectar o Google, para não perder o acesso.
                        </span>
                    </p>
                )}
            </div>

            <Modal show={confirming} onClose={() => setConfirming(false)} maxWidth="md">
                <form onSubmit={disconnect} className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Desconectar conta Google?</h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Você não vai mais conseguir entrar com um clique usando o Google. Poderá entrar normalmente com
                        e-mail e senha.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={() => setConfirming(false)}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton disabled={processing}>Desconectar</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
