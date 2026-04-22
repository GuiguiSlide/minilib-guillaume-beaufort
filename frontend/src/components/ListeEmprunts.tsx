// ── ListeEmprunts Component ──
// Displays list of all loans and provides form to create new loans

import { useEffect, useState } from "react";
import type { Emprunt } from "../types/emprunt";

interface ListeEmpruntsProps {
  emprunts: Emprunt[];
  onReturn: (id: number) => void;
  onAdd: (emprunt: Emprunt) => void;
}

const ListeEmprunts = ({ emprunts, onReturn, onAdd }: ListeEmpruntsProps) => {
  const [livreId, setLivreId] = useState<number | "">("");
  const [adherentId, setAdherentId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  // ── DEV TIME SHIFT ──
  const [dayOffset, setDayOffset] = useState(0);

  // ── LIVE CLOCK ──
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getNow = () => {
    const n = new Date(now);
    n.setDate(n.getDate() + dayOffset);
    return n;
  };

  // ── FORMATTER (REAL LIVE COUNTDOWN) ──
  const formatCountdown = (diffMs: number) => {
    const totalSeconds = Math.floor(diffMs / 1000);
    const abs = Math.abs(totalSeconds);

    const days = Math.floor(abs / 86400);
    const hours = Math.floor((abs % 86400) / 3600);
    const minutes = Math.floor((abs % 3600) / 60);
    const seconds = abs % 60;

    return `${days}j ${hours}h ${minutes}m ${seconds}s`;
  };

  // ── COLOR LOGIC (URGENCY SYSTEM) ──
  const getColor = (diffMs: number) => {
    const days = diffMs / (1000 * 60 * 60 * 24);

    if (days > 3) return "#142414"; // green
    if (days > 1) return "orange";
    return "red";
  };

  /**
   * LIVE remaining time per loan
   */
  const getRemaining = (dueDateString?: string) => {
    if (!dueDateString) return { text: "Date invalide", color: "gray" };

    const dueDate = new Date(dueDateString);
    if (isNaN(dueDate.getTime())) {
      return { text: "Date invalide", color: "gray" };
    }

    const diffMs = dueDate.getTime() - getNow().getTime();

    const baseText = formatCountdown(diffMs);

    if (diffMs > 0) {
      return {
        text: `${baseText} restants`,
        color: getColor(diffMs),
      };
    }

    return {
      text: `${baseText} en retard`,
      color: "red",
    };
  };

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
        headers: { "Content-Type": "application/json" },
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

      {/* DEV CONTROLS */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setDayOffset((v) => v - 1)}>-1 jour</button>
        <button onClick={() => setDayOffset(0)}>reset</button>
        <button onClick={() => setDayOffset((v) => v + 1)}>+1 jour</button>

        <span style={{ marginLeft: 10 }}>
          Offset: {dayOffset}
        </span>

        <span style={{ marginLeft: 20 }}>
          Live: {now.toLocaleTimeString()}
        </span>
      </div>

      <div>
        <h3>Créer un emprunt</h3>

        <input
          type="number"
          placeholder="Livre ID"
          value={livreId}
          onChange={(e) =>
            setLivreId(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Adherent ID"
          value={adherentId}
          onChange={(e) =>
            setAdherentId(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <button onClick={handleCreate}>Ajouter</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {emprunts.length === 0 && <p>Aucun emprunt</p>}

      <ul>
        {emprunts.map((e) => {
          const remaining = getRemaining(e.date_retour_prevue);

          return (
            <li key={e.id}>
              Livre: {e.livre_titre} | ID: {e.livre_id} | Adhérent:{" "}
              {e.adherent_nom} | ID: {e.adherent_id} |{" "}

              {e.date_retour_effective ? (
                "Rendu"
              ) : (
                <>
                  En cours |
                  <span
                    style={{
                      color: remaining.color,
                      fontWeight: "bold",
                      marginLeft: "5px",
                    }}
                  >
                    {remaining.text}
                  </span>
                </>
              )}

              {!e.date_retour_effective && (
                <button onClick={() => onReturn(e.id)}>
                  Rendre
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ListeEmprunts;