import { inputClass } from '@/Utils/inputStyles';

export default function Input({ className = '', ...props }) {
    return <input className={`${inputClass} ${className}`} {...props} />;
}
