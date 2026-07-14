import InputError from '@/Components/Form/InputError';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/Form/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Esqueci minha senha" />

            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Esqueceu sua senha?</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Sem problemas. Informe seu e-mail e enviaremos um link para você escolher uma nova senha.
            </p>

            {status && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="voce@email.com"
                />

                <InputError message={errors.email} />

                <PrimaryButton className="w-full" disabled={processing}>
                    Enviar link de redefinição
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
