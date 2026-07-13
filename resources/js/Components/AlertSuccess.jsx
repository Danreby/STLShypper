export default function AlertSuccess({ message }) {
    if (!message) return null;
    return (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
        </div>
    );
}
