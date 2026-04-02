// ── frontend/src/components/LivreCard.tsx ───────────────────────

import React from "react";
import type { Livre } from "../types/livre";
// On réutilise l'interface Livre du backend — cohérence garantie

// Interface des props du composant
interface LivreCardProps {
    livre: Livre;            // prop obligatoire — objet Livre complet
    onSupprimer?: (id: number) => void; // prop optionnelle — callback
}

// Le composant reçoit ses props typées
function LivreCard({ livre, onSupprimer }: LivreCardProps) {
    return (
        <div className="livre-card">
            <h3>{livre.titre}</h3>
            <p>{livre.auteur} — {livre.annee}</p>
            <span className={livre.disponible ? "dispo" : "emprunte"}>
                {livre.disponible ? "Disponible" : "Emprunté"}
            </span>
            {/* onSupprimer est optionnel — on vérifie avant d'appeler */}
            {onSupprimer && (
                <button onClick={() => onSupprimer(livre.id)}>
                    Supprimer
                </button>
            )}
        </div>
    );
}

export default LivreCard;

// Utilisation — TypeScript vérifie que livre est bien un Livre :
// <LivreCard livre={monLivre} />
// <LivreCard livre={monLivre} onSupprimer={(id) => console.log(id)} />
