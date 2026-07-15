import InputError from '@/Components/Form/InputError';
import InputLabel from '@/Components/Form/InputLabel';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/Form/TextInput';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            errorBag: 'updatePassword',
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {user.has_password ? 'Alterar senha' : 'Definir senha'}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {user.has_password
                        ? 'Use uma senha longa e aleatória para manter sua conta segura.'
                        : 'Sua conta ainda usa apenas o Google para entrar. Defina uma senha para poder entrar também com e-mail e senha, e para poder desconectar o Google depois.'}
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                {user.has_password && (
                    <div>
                        <InputLabel htmlFor="current_password" value="Senha atual" />

                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                        />

                        <InputError message={errors.current_password} className="mt-2" />
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="password" value={user.has_password ? 'Nova senha' : 'Senha'} />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmar senha" />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Salvar</PrimaryButton>

                    <AnimatePresence>
                        {recentlySuccessful && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-slate-500 dark:text-slate-400"
                            >
                                Salvo.
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </section>
    );
}
