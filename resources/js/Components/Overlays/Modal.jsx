import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
    afterLeave,
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200" afterLeave={afterLeave}>
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex items-center overflow-y-auto px-4 py-6 sm:px-0"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-slate-950/70" />
                </TransitionChild>

                {/* No `scale-*` here on purpose: animating scale on the panel that also
                    clips/rounds its content (border-radius + overflow) leaves Chromium/WebKit
                    rasterizing it at a blurry resolution once the transition settles. Fading +
                    sliding in (opacity/translate only) avoids that class of bug entirely while
                    still feeling like a deliberate entrance. */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-4"
                >
                    {/* `relative z-10`: the backdrop above is `absolute`, and positioned
                        elements always paint above non-positioned ones regardless of DOM
                        order. Without this the dark backdrop was rendering on top of the
                        panel instead of behind it, making the card look dim/washed out. */}
                    <DialogPanel className={`relative z-10 mb-6 w-full transition-all sm:mx-auto ${maxWidthClass}`}>
                        <div className="menu-panel scrollbar-thin max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl shadow-slate-950/20">
                            {children}
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
