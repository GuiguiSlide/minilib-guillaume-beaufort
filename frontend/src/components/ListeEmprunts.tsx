
// ── ListeEmprunts Component ──
// Displays list of all loans and provides form to create new loans
// Handles both display and creation of loan records

import { useState } from "react";
import type { Emprunt } from "../types/emprunt";

/**
 * Props for ListeEmprunts component
 * @prop emprunts - Array of loans to display (already filtered by parent)
 * @prop onReturn - Callback when "Rendre" button is clicked
 * @prop onAdd - Callback when a new loan is created
 */
interface ListeEmpruntsProps {
  emprunts: Emprunt[];
  onReturn: (id: number) => void;
  onAdd: (emprunt: Emprunt) => void;
}

/**
 * ListeEmprunts
 */
const ListeEmprunts = ({ emprunts, onReturn, onAdd }: ListeEmpruntsProps) => {
  // ── FORM STATE ─────────────────────
  const [livreId, setLivreId] = useState<number | "">("");
  const [adherentId, setAdherentId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  /**
   * Calculates remaining days until due date.
   * Uses backend-provided date_retour_prevue as source of truth.
   */
  const getRemainingDays = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();

    const diffMs = dueDate.getTime() - today.getTime();

    const diffDays = Math.ceil(
      diffMs / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 1) {
      return `${diffDays} jours restants`;
    }

    if (diffDays === 1) {
      return "Dernier jour";
    }

    if (diffDays === 0) {
      return "Expire aujourd'hui";
    }

    return `En retard de ${Math.abs(diffDays)} jours`;
  };

  /**
   * Creates a new loan via API
   */
  const handleCreate = async () => {
    setError(null);

    const activeEmprunts = emprunts.filter(
      (e) => !e.date_retour_effective
    );

    const userLoans = activeEmprunts.filter(
      (e) => e.adherent_id === adherentId
    );

    if (userLoans.length >= 3) {
      setError("Cet adhérent a déjà 3 emprunts actifs");
      return;
    }

    const bookAlreadyBorrowed = activeEmprunts.some(
      (e) => e.livre_id === livreId
    );

    if (bookAlreadyBorrowed) {
      setError("Ce livre est déjà emprunté");
      return;
    }

    if (livreId === "" || adherentId === "") {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/emprunts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          livre_id: livreId,
          adherent_id: adherentId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.erreur || "Erreur lors de la création");
        return;
      }

      const data: Emprunt = await res.json();
      onAdd(data);

      setLivreId("");
      setAdherentId("");
    } catch (err) {
      console.error(err);
      setError("Erreur réseau");
    }
  };

  return (
    <div>
      <h2>Liste des emprunts</h2>

      <div>
        <h3>Créer un emprunt</h3>

        <input
          type="number"
          placeholder="Livre ID"
          value={livreId}
          onChange={(e) => {
            const value = e.target.value;
            setLivreId(value === "" ? "" : Number(value));
          }}
        />

        <input
          type="number"
          placeholder="Adherent ID"
          value={adherentId}
          onChange={(e) => {
            const value = e.target.value;
            setAdherentId(value === "" ? "" : Number(value));
          }}
        />

        <button onClick={handleCreate}>Ajouter</button>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}
      </div>

      {emprunts.length === 0 && <p>Aucun emprunt</p>}

      <ul>
        {emprunts.map((e) => (
          <li key={e.id}>
            Livre titre: {e.livre_titre} |
            Livre ID: {e.livre_id} |
            Adherent nom: {e.adherent_nom} |
            Adherent ID: {e.adherent_id} |

            {e.date_retour_effective ? (
              " Rendu"
            ) : (
              <>
                {" "}En cours |
                <span
                  style={{
                    color: e.en_retard ? "red" : "green",
                    fontWeight: "bold",
                    marginLeft: "5px"
                  }}
                >
                  {getRemainingDays(e.date_retour_prevue)}
                </span>
              </>
            )}

            {!e.date_retour_effective && (
              <button onClick={() => onReturn(e.id)}>
                Rendre
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeEmprunts;

