import { motion } from 'framer-motion';
import { BadgeCheck, CalendarDays, ShieldAlert } from 'lucide-react';
import GoogleIcon from '@/Components/Icons/GoogleIcon';

function Badge({ tone = 'neutral', icon: Icon, children }) {
    const tones = {
        success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
        neutral: 'bg-white/15 text-white',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
            {Icon && <Icon size={13} />}
            {children}
        </span>
    );
}

export default function ProfileHero({ user }) {
    const initial = user.name?.charAt(0)?.toUpperCase() ?? '?';
    const memberSince = new Date(user.created_at).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-600 via-brand-500 to-accent-500 p-6 text-white shadow-lg shadow-brand-500/25 sm:p-8"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="animate-float absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/10 blur-2xl" />
            </div>

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/15 text-2xl font-semibold ring-4 ring-white/20 sm:h-24 sm:w-24 sm:text-3xl">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                        initial
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-xl font-semibold sm:text-2xl">{user.name}</h1>
                    <p className="truncate text-sm text-white/80">{user.email}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {user.email_verified_at ? (
                            <Badge tone="success" icon={BadgeCheck}>
                                E-mail verificado
                            </Badge>
                        ) : (
                            <Badge tone="warning" icon={ShieldAlert}>
                                E-mail não verificado
                            </Badge>
                        )}

                        {user.google_id && (
                            <Badge icon={GoogleIcon}>
                                Conectado ao Google
                            </Badge>
                        )}

                        <Badge icon={CalendarDays}>Membro desde {memberSince}</Badge>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
