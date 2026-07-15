import GoogleIcon from '@/Components/Icons/GoogleIcon';
import useGoogleAuthPopup from '@/Hooks/useGoogleAuthPopup';
import axios from 'axios';
import { useState } from 'react';

export default function GoogleAuthButton({ label, endpoint, onSuccess, onError, className = '' }) {
    const requestGoogleAuthorizationCode = useGoogleAuthPopup();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);

        try {
            const code = await requestGoogleAuthorizationCode();
            const { data } = await axios.post(route(endpoint), { code });
            onSuccess?.(data);
        } catch (error) {
            onError?.(error.response?.data?.message ?? error.message ?? 'Não foi possível continuar com o Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className={`focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 ${className}`}
        >
            <GoogleIcon />
            {loading ? 'Conectando…' : label}
        </button>
    );
}
