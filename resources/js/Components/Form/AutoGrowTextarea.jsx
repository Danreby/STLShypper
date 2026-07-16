import { inputClass } from '@/Utils/inputStyles';
import { useEffect, useRef } from 'react';

export default function AutoGrowTextarea({ className = '', value = '', maxLength, onChange, ...props }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    return (
        <div>
            <textarea
                {...props}
                ref={ref}
                value={value}
                maxLength={maxLength}
                onChange={onChange}
                rows={1}
                className={`${inputClass} resize-none overflow-hidden ${className}`}
            />
            {maxLength && (
                <div className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
                    {value.length}/{maxLength}
                </div>
            )}
        </div>
    );
}
