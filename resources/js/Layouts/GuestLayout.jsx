import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calculator, Layers, Printer } from 'lucide-react';

const highlights = [
    { icon: Calculator, text: 'Precificação automática com margem, impostos e taxas.' },
    { icon: Printer, text: 'Custos reais de energia e depreciação por impressora.' },
    { icon: Layers, text: 'Catálogo de materiais e produtos sempre atualizado.' },
];

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-24 h-96 w-96 animate-float rounded-full bg-brand-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-112 w-md animate-float rounded-full bg-accent-400/20 blur-3xl [animation-delay:2s]" />
            </div>

            <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
                <ThemeToggle />
            </div>

            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex xl:p-16">
                <div className="absolute inset-0 bg-linear-to-br from-brand-700 via-slate-900 to-slate-950" />
                <div className="absolute -top-24 -right-24 h-72 w-72 animate-glow rounded-full bg-accent-400/30 blur-3xl" />

                <Link href="/" className="relative z-10 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl shadow-lg">
                        <ApplicationLogo variant="badge" className="h-full w-full" />
                    </span>
                    <span className="text-lg font-semibold tracking-tight">STLS Hypper</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative z-10 space-y-8"
                >
                    <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
                        Precifique suas impressões 3D com confiança.
                    </h1>
                    <ul className="space-y-4">
                        {highlights.map(({ icon: Icon, text }, index) => (
                            <motion.li
                                key={text}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 * index + 0.2 }}
                                className="flex items-start gap-3 text-sm text-slate-200"
                            >
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                    <Icon size={16} />
                                </span>
                                <span className="pt-1.5">{text}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                <p className="relative z-10 text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} STLS Hypper. Feito para makers e pequenas gráficas 3D.
                </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2">
                <div className="mb-8 lg:hidden">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-brand-500/20">
                            <ApplicationLogo variant="badge" className="h-full w-full" />
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">STLS Hypper</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="surface-panel w-full max-w-md rounded-3xl p-6 shadow-xl shadow-slate-900/5 sm:p-8"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
