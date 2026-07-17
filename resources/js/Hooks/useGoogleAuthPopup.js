let gsiScriptPromise = null;

function loadGoogleScript() {
    if (gsiScriptPromise) {
        return gsiScriptPromise;
    }

    gsiScriptPromise = new Promise((resolve, reject) => {
        if (window.google?.accounts?.oauth2) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Não foi possível carregar o script do Google.'));
        document.head.appendChild(script);
    });

    return gsiScriptPromise;
}

export default function useGoogleAuthPopup() {
    return async function requestGoogleAuthorizationCode() {
        await loadGoogleScript();

        return new Promise((resolve, reject) => {
            const client = window.google.accounts.oauth2.initCodeClient({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                scope: 'openid profile email',
                ux_mode: 'popup',
                callback: (response) => {
                    if (response.code) {
                        resolve(response.code);
                    } else {
                        reject(new Error(response.error_description || response.error || 'Login com Google cancelado.'));
                    }
                },
                error_callback: (error) => {
                    reject(new Error(error?.type === 'popup_closed' ? 'Janela do Google fechada antes de concluir o login.' : 'Não foi possível continuar com o Google.'));
                },
            });

            client.requestCode();
        });
    };
}
