// ── frontend/src/components/ListeLivres.tsx ─────────────────────

import React from "react";
import type { Livre } from "../types/livre";
import LivreCard from "./LivreCard";

interface ListeLivresProps {
    livres: Livre[];   // tableau de livres
}

function ListeLivres({ livres }: ListeLivresProps) {
    if (livres.length === 0) {
        return <p>Aucun livre dans le catalogue.</p>;
    }

    return (
        <ul className="liste-livres">
            {livres.map((livre) => (
                // key obligatoire — React identifie chaque élément
                <li key={livre.id}>
                    <LivreCard livre={livre} />
                </li>
            ))}
        </ul>
    );
}

export default ListeLivres;
