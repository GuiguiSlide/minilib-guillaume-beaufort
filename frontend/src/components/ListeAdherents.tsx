// ── frontend/src/components/Listeadherents.tsx ─────────────────────

import React from "react";
import type { Adherent } from "../types/adherent";
import AdherentCard from "./AdherentCard";

interface ListeAdherentsProps {
    adherents: Adherent[];   // tableau de adherents
}

function ListeAdherents({ adherents }: ListeAdherentsProps) {
    if (adherents.length === 0) {
        return <p>Aucun adherent dans le catalogue.</p>;
    }

    return (
        <ul className="liste-livres">
            {adherents.map((adherent) => (
                // key obligatoire — React identifie chaque élément
                <li key={adherent.id}>
                    <AdherentCard adherent={adherent} />
                </li>
            ))}
        </ul>
    );
}

export default ListeAdherents;
