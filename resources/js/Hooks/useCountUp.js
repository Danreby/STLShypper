import { animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function useCountUp(value, duration = 0.8) {
    const numeric = Number(value) || 0;
    const [display, setDisplay] = useState(numeric);
    const prev = useRef(numeric);

    useEffect(() => {
        const controls = animate(prev.current, numeric, {
            duration,
            ease: 'easeOut',
            onUpdate: (v) => setDisplay(v),
        });
        prev.current = numeric;
        return () => controls.stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numeric]);

    return display;
}
