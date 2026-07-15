export default function ApplicationLogo({ className = '', ...props }) {
    return <img src="/images/logo.png" alt="STLShypper" className={`object-contain ${className}`} {...props} />;
}
