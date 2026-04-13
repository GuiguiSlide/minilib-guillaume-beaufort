import { useState } from "react";
import type { Emprunt } from "../types/emprunt";

interface ListeEmpruntsProps {
  emprunts: Emprunt[];
  onReturn: (id: number) => void;
  onAdd: (emprunt: Emprunt) => void;
}

/**
 * ListeEmprunts
 *
 * Responsibilities:
 * - Display list of emprunts
 * - Handle "return" action (delegated to parent)
 * - Handle creation of a new emprunt via API
 *
 * Important:
 * - Does NOT mutate global state directly
 * - Uses onAdd callback to update App.tsx state
 * - Handles backend errors (business logic)
 */
const ListeEmprunts = ({ emprunts, onReturn, onAdd }: ListeEmpruntsProps) => {
  // ── FORM STATE ─────────────────────
  const [livreId, setLivreId] = useState<number | "">("");
  const [adherentId, setAdherentId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  /**
   * handleCreate
   *
   * Sends POST request to backend to create a new emprunt.
   * - Validates input
   * - Handles API errors
   * - Calls onAdd to update parent state
   */
  const handleCreate = async () => {
    setError(null);

    // Basic validation
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

      // Handle backend error response
      if (!res.ok) {
        const err = await res.json();
        setError(err.erreur || "Erreur lors de la création");
        return;
      }

      const data: Emprunt = await res.json();

      // Update global state via App.tsx
      onAdd(data);

      // Reset form
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

      {/* ── CREATE FORM ───────────────────── */}
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

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* ── LIST DISPLAY ───────────────────── */}
      {emprunts.length === 0 && <p>Aucun emprunt</p>}

      <ul>
        {emprunts.map((e) => (
          <li key={e.id}>
            Livre ID: {e.livre_id} | Adherent ID: {e.adherent_id} |{" "}
            {e.date_retour_effective ? "Rendu" : "En cours"}

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