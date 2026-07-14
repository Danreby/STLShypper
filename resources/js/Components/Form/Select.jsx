import { inputClass } from '@/Utils/inputStyles';

export default function Select({ className = '', children, ...props }) {
    return (
        <select className={`${inputClass} ${className}`} {...props}>
            {children}
        </select>
    );
}
