// ── LivreCard Component ──
// Displays a single book (livre) as a card with title, author, availability, and action buttons

import type { Livre } from "../types/livre";

/**
 * Props for LivreCard component
 * @prop livre - The book object to display
 * @prop onSupprimer - Optional callback when delete button is clicked
 * @prop onEdit - Optional callback when edit button is clicked
 */
interface LivreCardProps {
    livre: Livre;
    onSupprimer?: (id: number) => void;
    onEdit?: (livre: Livre) => void;
}

/**
 * LivreCard
 * Renders individual book information with edit and delete action buttons
 * Shows availability status (Disponible/Emprunté)
 */
function LivreCard({ livre, onSupprimer, onEdit }: LivreCardProps) {
    return (
        <div className="livre-card">
            <h3>{livre.titre} - id:{livre.id}</h3>
            <p>{livre.auteur} — {livre.annee}</p>

            {/* ── AVAILABILITY STATUS BADGE ── */}
            <span className={livre.disponible ? "dispo" : "emprunte"}>
                {livre.disponible ? "Disponible" : "Emprunté"}
            </span>

            {/* ── EDIT BUTTON (only shown if onEdit callback provided) ── */}
            {onEdit && (
                <button onClick={() => onEdit(livre)}>
                    Modifier
                </button>
            )}

            {/* ── DELETE BUTTON (only shown if onSupprimer callback provided) ── */}
            {onSupprimer && livre.id !== undefined && (
                <button onClick={() => onSupprimer(livre.id)}>
                    Supprimer
                </button>
            )}
        </div>
    );
}

export default LivreCard;