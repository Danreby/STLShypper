export default function ApplicationLogo({ className = '', variant = 'mark', ...props }) {
    const src = variant === 'badge' ? '/images/logo-badge.png' : '/images/logo.png';
    const fit = variant === 'badge' ? 'object-cover' : 'object-contain';
    return <img src={src} alt="STLShypper" className={`${fit} ${className}`} {...props} />;
}
