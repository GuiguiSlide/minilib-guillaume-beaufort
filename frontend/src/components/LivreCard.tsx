import type { Livre } from "../types/livre";

interface LivreCardProps {
    livre: Livre;
    onSupprimer?: (id: number) => void;
    onEdit?: (livre: Livre) => void;
}

function LivreCard({ livre, onSupprimer, onEdit }: LivreCardProps) {
    return (
        <div className="livre-card">
            <h3>{livre.titre}</h3>
            <p>{livre.auteur} — {livre.annee}</p>

            <span className={livre.disponible ? "dispo" : "emprunte"}>
                {livre.disponible ? "Disponible" : "Emprunté"}
            </span>

            {onEdit && (
                <button onClick={() => onEdit(livre)}>
                    Modifier
                </button>
            )}

            {onSupprimer && livre.id !== undefined && (
                <button onClick={() => onSupprimer(livre.id)}>
                    Supprimer
                </button>
            )}
        </div>
    );
}

export default LivreCard;