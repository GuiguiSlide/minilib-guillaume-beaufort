// ── ListeAdherents Component ──
// Displays a list of all members (adherents) as individual cards

import type { Adherent } from "../types/adherent";
import AdherentsCard from "./AdherentCard";

/**
 * Props for ListeAdherents component
 * @prop adherents - Array of members to display
 * @prop onDelete - Optional callback when delete button is clicked on a card
 * @prop onEdit - Optional callback when edit button is clicked on a card
 */
interface ListeAdherentsProps {
    adherents: Adherent[];
    onDelete?: (id: number) => void;
    onEdit?: (adherent: Adherent) => void;
}

/**
 * ListeAdherents
 * Renders either an empty state message or a list of AdherentCard components
 * Passes delete and edit callbacks to child cards
 */
function ListeAdherents({ adherents, onDelete, onEdit }: ListeAdherentsProps) {
    // ── EMPTY STATE: Show message if no members exist ──
    if (adherents.length === 0) return <p>Aucun adherent dans le catalogue.</p>;

    return (
        <ul className="liste-livres">
            {/* ── MAP MEMBERS: Create a card for each member ── */}
            {adherents.map((adherent) => (
                <li key={adherent.id}>
                    <AdherentsCard
                        adherent={adherent}
                        onSupprimer={onDelete}
                        onEdit={onEdit}
                    />
                </li>
            ))}
        </ul>
    );
}

export default ListeAdherents;