import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeading from '@/Components/PageHeading';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

function Section({ delay, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: 'easeOut' }}
            className="surface-panel rounded-2xl p-5 shadow-sm shadow-slate-900/5 sm:p-8"
        >
            {children}
        </motion.div>
    );
}

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout header={<PageHeading title="Meu perfil" icon={UserCircle} />}>
            <Head title="Perfil" />

            <div className="mx-auto max-w-3xl space-y-6">
                <Section delay={0}>
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                </Section>

                <Section delay={0.05}>
                    <UpdatePasswordForm />
                </Section>

                <Section delay={0.1}>
                    <DeleteUserForm />
                </Section>
            </div>
        </AuthenticatedLayout>
    );
}
