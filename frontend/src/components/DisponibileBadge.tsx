// ── frontend/src/components/DisponibileBadge.tsx ────────────────

// Composant le plus simple : une fonction qui retourne du JSX
// Pas de props pour l'instant — tout est codé en dur
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
