import ApplicationLogo from '@/Components/ApplicationLogo';
import ScrollArea from '@/Components/ScrollArea';
import { navigation } from './navigation';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronsLeft } from 'lucide-react';

export default function Sidebar({ collapsed, onToggleCollapse }) {
    return (
        <motion.aside
            animate={{ width: collapsed ? 80 : 264 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative hidden shrink-0 border-r border-slate-200/70 bg-white/70 backdrop-blur-xl md:flex md:flex-col dark:border-white/10 dark:bg-slate-900/50"
        >
            <div
                className={`flex items-center border-b border-slate-200/70 px-3 py-3 dark:border-white/10 ${
                    collapsed ? 'flex-col gap-2' : 'h-16 flex-row justify-between gap-3 px-5 py-0'
                }`}
            >
                <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-brand-500/20">
                        <ApplicationLogo variant="badge" className="h-full w-full" />
                    </span>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="whitespace-nowrap text-base font-semibold tracking-tight text-slate-900 dark:text-white"
                        >
                            STLS Hypper
                        </motion.span>
                    )}
                </Link>

                <button
                    type="button"
                    onClick={onToggleCollapse}
                    title={collapsed ? 'Expandir menu' : 'Recolher menu'}
                    aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
                    className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                >
                    <motion.span
                        animate={{ rotate: collapsed ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex h-5 w-5 items-center justify-center"
                    >
                        <ChevronsLeft size={18} />
                    </motion.span>
                </button>
            </div>

            <ScrollArea as="nav" fade className="mt-2 flex flex-1 flex-col gap-1 px-3">
                {navigation.map((item) => {
                    const active = route().current(item.routeName);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`focus-ring group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                active
                                    ? 'text-brand-700 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            {active && (
                                <motion.span
                                    layoutId="sidebar-active-pill"
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    className="absolute inset-0 rounded-xl bg-linear-to-r from-brand-50 to-accent-400/10 dark:from-brand-500/15 dark:to-accent-400/10"
                                />
                            )}
                            <span
                                className={`relative flex h-5 w-5 shrink-0 items-center justify-center ${active ? 'text-brand-600 dark:text-accent-400' : ''}`}
                            >
                                <Icon size={19} strokeWidth={2} />
                            </span>
                            {!collapsed && <span className="relative whitespace-nowrap">{item.name}</span>}
                        </Link>
                    );
                })}
            </ScrollArea>
        </motion.aside>
    );
}
