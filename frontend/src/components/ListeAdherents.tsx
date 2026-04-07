// ── frontend/src/components/ListeAdherents.tsx ─────────────────────
import type { Adherent } from "../types/adherent";
import AdherentsCard from "./AdherentCard";

interface ListeAdherentsProps {
    adherents: Adherent[];
    onDelete?: (id: number) => void;
    onEdit?: (adherent: Adherent) => void;
}

function ListeAdherents({ adherents, onDelete, onEdit }: ListeAdherentsProps) {
    if (adherents.length === 0) return <p>Aucun adherent dans le catalogue.</p>;

    return (
        <ul className="liste-livres">
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