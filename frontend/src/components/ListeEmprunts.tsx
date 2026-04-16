// ── ListeEmprunts Component ──
// Displays list of all loans and provides form to create new loans
// Handles both display and creation of loan records

import { useState } from "react";
import type { Emprunt } from "../types/emprunt";

/**
 * Props for ListeEmprunts component
 * @prop emprunts - Array of loans to display (already filtered by parent)
 * @prop onReturn - Callback when "Rendre" (return) button is clicked on a loan
 * @prop onAdd - Callback when a new loan is successfully created
 */
interface ListeEmpruntsProps {
  emprunts: Emprunt[];
  onReturn: (id: number) => void;
  onAdd: (emprunt: Emprunt) => void;
}

/**
 * ListeEmprunts
 * Displays:
 * 1. Form to create new loans (requires livre ID and adherent ID)
 * 2. List of all loans with status and return button
 * 
 * Does NOT mutate global state directly
 * Uses onAdd callback to notify parent of new loans
 */
const ListeEmprunts = ({ emprunts, onReturn, onAdd }: ListeEmpruntsProps) => {
  // ── FORM STATE ─────────────────────
  // livre_id: ID of the book being borrowed (can be empty string or number)
  const [livreId, setLivreId] = useState<number | "">("");

  // adherent_id: ID of the member borrowing the book (can be empty string or number)
  const [adherentId, setAdherentId] = useState<number | "">("");

  // error: Error message to display if creation fails
  const [error, setError] = useState<string | null>(null);

  /**
   * Creates a new loan via API
   * Validates that both livre_id and adherent_id are provided
   * Handles API errors and displays them to the user
   * Resets form on success and notifies parent via onAdd callback
   */
  const handleCreate = async () => {
    // ── RESET ERROR STATE ──
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
    // ── VALIDATION: Both fields must be filled ──
    if (livreId === "" || adherentId === "") {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      // ── API CALL: Send POST request to create new loan ──
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

      // ── ERROR HANDLING: Check if request failed ──
      if (!res.ok) {
        const err = await res.json();
        setError(err.erreur || "Erreur lors de la création");
        return;
      }

      // ── SUCCESS: Parse response and update parent state ──
      const data: Emprunt = await res.json();
      onAdd(data);

      // ── RESET FORM: Clear fields for next entry ──
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

      {/* ── CREATE FORM SECTION ───────────────────── */}
      <div>
        <h3>Créer un emprunt</h3>

        {/* ── LIVRE ID INPUT ── */}
        <input
          type="number"
          placeholder="Livre ID"
          value={livreId}
          onChange={(e) => {
            const value = e.target.value;
            setLivreId(value === "" ? "" : Number(value));
          }}
        />

        {/* ── ADHERENT ID INPUT ── */}
        <input
          type="number"
          placeholder="Adherent ID"
          value={adherentId}
          onChange={(e) => {
            const value = e.target.value;
            setAdherentId(value === "" ? "" : Number(value));
          }}
        />

        {/* ── SUBMIT BUTTON ── */}
        <button onClick={handleCreate}>Ajouter</button>

        {/* ── ERROR MESSAGE DISPLAY ── */}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* ── LIST DISPLAY SECTION ───────────────────── */}

      {/* ── EMPTY STATE ── */}
      {emprunts.length === 0 && <p>Aucun emprunt</p>}

      {/* ── LOANS LIST ── */}
      <ul>
        {emprunts.map((e) => (
          <li key={e.id}>
            {/* ── LOAN INFO ── */}
            Livre titre: {e.livre_titre} |Livre ID: {e.livre_id} |Adherent nom: {e.adherent_nom} | Adherent ID: {e.adherent_id} |{" "}
            {e.date_retour_effective ? "Rendu" : "En cours"}

            {/* ── RETURN BUTTON (only shown for active loans) ── */}
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