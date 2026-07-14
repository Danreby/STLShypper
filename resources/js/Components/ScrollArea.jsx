import { forwardRef } from 'react';

const DIRECTION_CLASSES = {
    vertical: 'overflow-y-auto overflow-x-hidden',
    horizontal: 'overflow-x-auto overflow-y-hidden',
    both: 'overflow-auto',
};

/**
 * Scrollable container with a thin, theme-aware, brand-tinted scrollbar
 * (see `.scrollbar-thin` in app.css) instead of the browser default.
 * Pass `fade` to mask the leading/trailing edge, hinting there's more
 * content to scroll.
 */
const ScrollArea = forwardRef(function ScrollArea(
    { as: Component = 'div', direction = 'vertical', fade = false, className = '', children, ...props },
    ref,
) {
    const fadeClass = fade ? (direction === 'horizontal' ? 'scroll-fade-x' : 'scroll-fade-y') : '';

    return (
        <Component ref={ref} className={`scrollbar-thin ${DIRECTION_CLASSES[direction]} ${fadeClass} ${className}`} {...props}>
            {children}
        </Component>
    );
});

export default ScrollArea;
