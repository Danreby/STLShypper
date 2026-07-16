import ApplicationLogo from '@/Components/ApplicationLogo';
import ScrollArea from '@/Components/ScrollArea';
import { navigation } from './navigation';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function MobileDrawer({ open, onClose }) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
                    />
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                        className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl md:hidden dark:bg-slate-900"
                    >
                        <div className="flex h-16 items-center justify-between px-5">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-brand-500/20">
                                    <ApplicationLogo variant="badge" className="h-full w-full" />
                                </span>
                                <span className="text-base font-semibold text-slate-900 dark:text-white">STLS Hypper</span>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Fechar menu"
                                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <ScrollArea as="nav" fade className="flex flex-1 flex-col gap-1 px-3 py-2">
                            {navigation.map((item, index) => {
                                const active = route().current(item.routeName);
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.04 * index, duration: 0.25 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                                                active
                                                    ? 'bg-linear-to-r from-brand-50 to-accent-400/10 text-brand-700 dark:from-brand-500/15 dark:to-accent-400/10 dark:text-white'
                                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                                            }`}
                                        >
                                            <Icon size={19} strokeWidth={2} className={active ? 'text-brand-600 dark:text-accent-400' : ''} />
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </ScrollArea>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
