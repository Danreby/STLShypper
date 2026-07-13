import axios from 'axios';

window.axios = axios;

// Requisições feitas via axios (ex.: cálculo em tempo real na Calculadora)
// usam a mesma sessão/cookie do Inertia — sem necessidade de CORS ou tokens,
// pois backend e frontend são o mesmo projeto/origem.
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;
