import Sidebar from './Sidebar';
import MobileDrawer from './MobileDrawer';
import Topbar from './Topbar';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { url } = usePage();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('sidebar-collapsed') === '1';
    });

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
    }, [collapsed]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [url]);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/10" />
                <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" />
            </div>

            <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
            <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar user={user} header={header} onOpenMobileMenu={() => setMobileMenuOpen(true)} />

                <main className="flex-1">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={url}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 2xl:px-12"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
