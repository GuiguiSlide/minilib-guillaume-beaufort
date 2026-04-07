import type { Livre } from "../types/livre";
import LivreCard from "./LivreCard";

interface ListeLivresProps {
    livres: Livre[];
    onDelete?: (id: number) => void;   // NEW
    onEdit?: (livre: Livre) => void;   // NEW
}

function ListeLivres({ livres, onDelete, onEdit }: ListeLivresProps) {
    if (livres.length === 0) {
        return <p>Aucun livre dans le catalogue.</p>;
    }

    return (
        <ul className="liste-livres">
            {livres.map((livre) => (
                <li key={livre.id}>
                    <LivreCard
                        livre={livre}
                        onSupprimer={onDelete}   // forward delete callback
                        onEdit={onEdit}          // forward edit callback
                    />
                </li>
            ))}
        </ul>
    );
}

export default ListeLivres;