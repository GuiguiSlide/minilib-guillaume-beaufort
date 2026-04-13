// ── AdherentCard Component ──
// Displays a single member (adherent) as a card with name, email, status, date created

import type { Adherent } from "../types/adherent";

/**
 * Props for AdherentCard component
 * @prop adherent - The member object to display
 * @prop onSupprimer - Optional callback when delete button is clicked
 * @prop onEdit - Optional callback when edit button is clicked
 */
interface AdherentsCardProps {
    adherent: Adherent;
    onSupprimer?: (id: number) => void;
    onEdit?: (adherent: Adherent) => void;
}

/**
 * AdherentCard
 * Renders individual member information with edit and delete action buttons
 * Formats the creation date to French locale format
 */
function AdherentsCard({ adherent, onSupprimer, onEdit }: AdherentsCardProps) {
    // ── FORMAT DATE to readable French format (e.g., "13 avril 2026") ──
    const formattedDate = new Date(adherent.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="adherent-card">
            <h3>{adherent.nom} {adherent.prenom}</h3>
            <p>id:{adherent.id} — email:{adherent.email}</p>
            
            {/* ── CREATION DATE AND ACTIVE STATUS ── */}
            <p>{formattedDate} - {adherent.actif ? "Actif" : "Inactif"}</p>

            {/* ── ACTION BUTTONS (edit and delete) ── */}
            <div className="adherent-actions">
                {onEdit && <button onClick={() => onEdit(adherent)}>Modifier</button>}
                {onSupprimer && <button onClick={() => onSupprimer(adherent.id)}>Supprimer</button>}
            </div>
        </div>
    );
}

export default AdherentsCard;