export function newClientId() {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cid-${Math.random().toString(36).slice(2)}`;
}
