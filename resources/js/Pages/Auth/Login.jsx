import Checkbox from '@/Components/Form/Checkbox';
import GoogleIcon from '@/Components/Icons/GoogleIcon';
import InputError from '@/Components/Form/InputError';
import InputLabel from '@/Components/Form/InputLabel';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/Form/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Entrar" />

            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Bem-vindo de volta</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Entre para continuar precificando suas impressões.</p>

            {status && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <a
                href={route('auth.google.redirect')}
                className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
                <GoogleIcon />
                Entrar com Google
            </a>

            <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                <span className="text-xs font-medium uppercase text-slate-400 dark:text-slate-500">ou</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Senha" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Lembrar-me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="focus-ring rounded-md text-sm text-slate-500 underline underline-offset-2 hover:text-brand-600 dark:text-slate-400 dark:hover:text-accent-400"
                        >
                            Esqueceu sua senha?
                        </Link>
                    )}
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <PrimaryButton className="w-full" disabled={processing}>
                        Entrar
                    </PrimaryButton>
                </motion.div>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Não tem conta?{' '}
                    <Link href={route('register')} className="focus-ring font-medium text-brand-600 underline underline-offset-2 dark:text-accent-400">
                        Criar conta
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
