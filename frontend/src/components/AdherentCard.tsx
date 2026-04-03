// ── frontend/src/components/AdherentsCard.tsx ───────────────────────

import React from "react";
import type { Adherent } from "../types/adherent";
// On réutilise l'interface Adherent du backend — cohérence garantie

// Interface des props du composant
/**
 * Description
 * @param {any} id:number
 * @returns {any}
 */
interface AdherentsCardProps {
    adherent: Adherent;            // prop obligatoire — objet Adherent complet
    onSupprimer?: (id: number) => void; // prop optionnelle — callback
}

// Le composant reçoit ses props typées
/**
 * Description
 * @param {any} {adherent
 * @param {any} onSupprimer}:AdherentsCardProps
 * @returns {any}
 */
function AdherentsCard({ adherent, onSupprimer }: AdherentsCardProps) {
    return (
        <div className="adherent-card">
            <h3>{adherent.nom} {adherent.prenom}</h3>
            <p>id:{adherent.id} — email:{adherent.email}</p>
            <p>{adherent.created_at instanceof Date ? adherent.created_at.toLocaleDateString() : String(adherent.created_at)} - {adherent.actif ? "Actif" : "Inactif"}</p>
            {/* onSupprimer est optionnel — on vérifie avant d'appeler */}
            {onSupprimer && (
                <button onClick={() => onSupprimer(adherent.id)}>
                    Supprimer
                </button>
            )}
        </div>
    );
}

export default AdherentsCard;

// Utilisation — TypeScript vérifie que adherent est bien un Adherent :
// <AdherentsCard adherent={monAdherent} />
// <AdherentsCard adherent={monAdherent} onSupprimer={(id) => console.log(id)} />
