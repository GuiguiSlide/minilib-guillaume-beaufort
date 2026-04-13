// ── ListeLivres Component ──
// Displays a list of all books (livres) as individual cards

import type { Livre } from "../types/livre";
import LivreCard from "./LivreCard";

/**
 * Props for ListeLivres component
 * @prop livres - Array of books to display
 * @prop onDelete - Optional callback when delete button is clicked on a card
 * @prop onEdit - Optional callback when edit button is clicked on a card
 */
interface ListeLivresProps {
    livres: Livre[];
    onDelete?: (id: number) => void;
    onEdit?: (livre: Livre) => void;
}

/**
 * ListeLivres
 * Renders either an empty state message or a list of LivreCard components
 * Passes delete and edit callbacks to child cards
 */
function ListeLivres({ livres, onDelete, onEdit }: ListeLivresProps) {
    // ── EMPTY STATE: Show message if no books exist ──
    if (livres.length === 0) {
        return <p>Aucun livre dans le catalogue.</p>;
    }

    return (
        <ul className="liste-livres">
            {/* ── MAP BOOKS: Create a card for each book ── */}
            {livres.map((livre) => (
                <li key={livre.id}>
                    <LivreCard
                        livre={livre}
                        onSupprimer={onDelete}
                        onEdit={onEdit}
                    />
                </li>
            ))}
        </ul>
    );
}

export default ListeLivres;