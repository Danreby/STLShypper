import TextInput from '@/Components/Form/TextInput';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';

export default forwardRef(function PasswordInput({ className = '', ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <TextInput {...props} ref={ref} type={visible ? 'text' : 'password'} className="pr-10" />

            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="focus-ring absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={visible}
            >
                {visible ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
        </div>
    );
});
