import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;

        function handlePointerDown(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') setOpen(false);
        }

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    return (
        <DropDownContext.Provider value={{ open, setOpen }}>
            <div ref={containerRef} className="relative">
                {children}
            </div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { setOpen } = useContext(DropDownContext);

    return <div onClick={() => setOpen((previousState) => !previousState)}>{children}</div>;
};

const Content = ({ align = 'right', width = '48', children }) => {
    const { open, setOpen } = useContext(DropDownContext);

    const alignmentClasses = align === 'left' ? 'ltr:origin-top-left rtl:origin-top-right start-0' : 'ltr:origin-top-right rtl:origin-top-left end-0';
    const widthClasses = { 48: 'w-48', 56: 'w-56', 64: 'w-64' }[width] ?? 'w-48';

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    onClick={() => setOpen(false)}
                    className={`surface-panel absolute z-50 mt-2 overflow-hidden rounded-2xl p-1.5 shadow-xl shadow-slate-900/10 ${alignmentClasses} ${widthClasses}`}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                'block w-full rounded-xl px-3 py-2 text-start text-sm font-medium leading-5 text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white ' +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
