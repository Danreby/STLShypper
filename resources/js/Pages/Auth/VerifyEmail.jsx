import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar e-mail" />

            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Confirme seu e-mail</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Obrigado por se cadastrar! Antes de começar, confirme seu e-mail clicando no link que acabamos de enviar. Não recebeu?
                Podemos enviar outro.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    Um novo link de verificação foi enviado para o e-mail informado no cadastro.
                </div>
            )}

            <form onSubmit={submit} className="mt-6 flex items-center justify-between gap-4">
                <PrimaryButton disabled={processing}>Reenviar e-mail</PrimaryButton>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="focus-ring rounded-md text-sm text-slate-500 underline underline-offset-2 hover:text-brand-600 dark:text-slate-400 dark:hover:text-accent-400"
                >
                    Sair
                </Link>
            </form>
        </GuestLayout>
    );
}
