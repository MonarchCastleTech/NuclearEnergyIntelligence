import React, { useEffect } from 'react';

interface PolicyModalProps {
    title: string;
    subtitle: string;
    content: React.ReactNode;
    onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ title, subtitle, content, onClose }) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--sp-6)'
        }}>
            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="policy-modal-title"
                onClick={(e) => e.stopPropagation()}
                style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: 'var(--sp-5) var(--sp-6)',
                    borderBottom: '1px solid var(--border)'
                }}>
                    <div>
                        <h2 id="policy-modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: '0 0 var(--sp-2) 0', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            {title}
                        </h2>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--red)', letterSpacing: '0.05em' }}>
                            {subtitle}
                        </div>
                    </div>
                    <button autoFocus aria-label="Close dialog" onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        lineHeight: 1,
                        padding: 0
                    }}>
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body" style={{
                    padding: 'var(--sp-6)',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-body)'
                }}>
                    {content}
                </div>
            </div>
        </div>
    );
};

export default PolicyModal;
