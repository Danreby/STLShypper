import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeading from '@/Components/DataDisplay/PageHeading';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { KeyRound, Link2, Trash2, UserCircle, UserRound } from 'lucide-react';
import { useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import GoogleConnectionCard from './Partials/GoogleConnectionCard';
import ProfileHero from './Partials/ProfileHero';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const TABS = [
    { id: 'perfil', label: 'Perfil', icon: UserRound },
    { id: 'seguranca', label: 'Segurança', icon: KeyRound },
    { id: 'conexoes', label: 'Conexões', icon: Link2 },
    { id: 'perigo', label: 'Zona de perigo', icon: Trash2 },
];

function TabButton({ tab, active, onClick }) {
    const Icon = tab.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`focus-ring flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors md:w-full ${
                active
                    ? 'bg-brand-500/10 text-brand-600 dark:text-accent-400'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
            }`}
        >
            <Icon size={16} />
            {tab.label}
        </button>
    );
}

function initialTab(status, errors) {
    if (status === 'google-connected' || status === 'google-disconnected' || errors?.google) {
        return 'conexoes';
    }

    if (errors?.updatePassword?.current_password || errors?.updatePassword?.password) {
        return 'seguranca';
    }

    return 'perfil';
}

export default function Edit({ mustVerifyEmail, status }) {
    const { auth, errors } = usePage().props;
    const user = auth.user;
    const [tab, setTab] = useState(() => initialTab(status, errors));

    return (
        <>
            <Head title="Perfil" />

            <div className="mx-auto max-w-5xl space-y-6">
                <ProfileHero user={user} />

                <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-6">
                    <nav className="scrollbar-thin -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-2 md:sticky md:top-20 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0">
                        {TABS.map((t) => (
                            <TabButton key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
                        ))}
                    </nav>

                    <div className="surface-panel mt-4 rounded-2xl p-5 shadow-sm shadow-slate-900/5 sm:p-8 md:mt-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={tab}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                                {tab === 'perfil' && (
                                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                                )}
                                {tab === 'seguranca' && <UpdatePasswordForm />}
                                {tab === 'conexoes' && <GoogleConnectionCard status={status} />}
                                {tab === 'perigo' && <DeleteUserForm />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
}

Edit.layout = (page) => <AuthenticatedLayout header={<PageHeading title="Meu perfil" icon={UserCircle} />}>{page}</AuthenticatedLayout>;
