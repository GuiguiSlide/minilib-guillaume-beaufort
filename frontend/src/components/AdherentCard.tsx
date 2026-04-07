// ── frontend/src/components/AdherentsCard.tsx ──
import type { Adherent } from "../types/adherent";

interface AdherentsCardProps {
    adherent: Adherent;
    onSupprimer?: (id: number) => void;
    onEdit?: (adherent: Adherent) => void;
}

function AdherentsCard({ adherent, onSupprimer, onEdit }: AdherentsCardProps) {
    // convert ISO string to readable date
    const formattedDate = new Date(adherent.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="adherent-card">
            <h3>{adherent.nom} {adherent.prenom}</h3>
            <p>id:{adherent.id} — email:{adherent.email}</p>
            <p>{formattedDate} - {adherent.actif ? "Actif" : "Inactif"}</p>

            <div className="adherent-actions">
                {onEdit && <button onClick={() => onEdit(adherent)}>Modifier</button>}
                {onSupprimer && <button onClick={() => onSupprimer(adherent.id)}>Supprimer</button>}
            </div>
        </div>
    );
}

export default AdherentsCard;