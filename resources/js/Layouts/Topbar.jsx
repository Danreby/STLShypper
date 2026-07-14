import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { ChevronDown, Menu } from 'lucide-react';

export default function Topbar({ user, header, onOpenMobileMenu }) {
    const initial = user.name?.charAt(0)?.toUpperCase() ?? '?';

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/70 bg-white/70 px-4 backdrop-blur-xl sm:px-6 dark:border-white/10 dark:bg-slate-950/60">
            <button
                type="button"
                onClick={onOpenMobileMenu}
                aria-label="Abrir menu"
                className="focus-ring -ml-1 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-white/10"
            >
                <Menu size={20} />
            </button>

            <div className="min-w-0 flex-1">{header}</div>

            <div className="flex items-center gap-2">
                <ThemeToggle />

                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="focus-ring flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-accent-400 text-xs font-semibold text-white">
                                {initial}
                            </span>
                            <span className="hidden text-sm font-medium text-slate-700 sm:inline dark:text-slate-200">
                                {user.name}
                            </span>
                            <ChevronDown size={14} className="hidden text-slate-400 sm:inline" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content width="56">
                        <div className="px-3 py-2">
                            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                        <div className="my-1 h-px bg-slate-200/70 dark:bg-white/10" />
                        <Dropdown.Link href={route('profile.edit')}>Meu perfil</Dropdown.Link>
                        <Dropdown.Link href={route('logout')} method="post" as="button">
                            Sair
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
