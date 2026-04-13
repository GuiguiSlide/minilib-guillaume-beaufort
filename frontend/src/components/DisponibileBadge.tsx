// ── DisponibileBadge Component ──
// A simple pure component that displays availability status
// Currently hardcoded, but can be enhanced to accept availability as a prop

/**
 * DisponibileBadge
 * Renders a "Disponible" (Available) badge with green styling
 * @returns JSX element displaying availability status
 */
function DisponibileBadge() {
    return (
        <span style={{ color: "green" }}>
            Disponible
        </span>
    );
}

export default DisponibileBadge;

// Utilisation dans un autre composant :
// <DisponibileBadge />
