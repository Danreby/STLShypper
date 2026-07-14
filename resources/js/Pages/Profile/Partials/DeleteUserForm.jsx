import DangerButton from '@/Components/Buttons/DangerButton';
import InputError from '@/Components/Form/InputError';
import InputLabel from '@/Components/Form/InputLabel';
import Modal from '@/Components/Overlays/Modal';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import TextInput from '@/Components/Form/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Excluir conta
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Uma vez excluída, todos os recursos e dados da sua conta serão apagados permanentemente. Antes de continuar,
                    baixe qualquer informação que deseje manter.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>Excluir conta</DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Tem certeza que deseja excluir sua conta?
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Uma vez excluída, todos os recursos e dados da sua conta serão apagados permanentemente. Digite sua senha
                        para confirmar.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Senha" className="sr-only" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Senha"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>

                        <DangerButton disabled={processing}>Excluir conta</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
