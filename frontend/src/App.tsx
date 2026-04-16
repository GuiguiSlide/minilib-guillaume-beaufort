import { useEffect, useState } from 'react';
import type { Livre } from './types/livre';
import type { Adherent } from './types/adherent';
import type { Emprunt } from './types/emprunt';

import ListeLivres from './components/ListeLivres';
import ListeAdherents from './components/ListeAdherents';
import ListeEmprunts from './components/ListeEmprunts';
import AddLivre from "./components/AddLivre";
import AddAdherent from "./components/AddAdherent";

import './App.css';

const App = () => {
  // ── STATE: Array of all books in the library
  const [livres, setLivres] = useState<Livre[]>([]);

  // ── STATE: Array of all members (adherents)
  const [adherents, setAdherents] = useState<Adherent[]>([]);

  // ── STATE: Array of all loans (emprunts)
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);

  // ── STATE: Filter for displaying loans by status (ALL, EN_COURS, RENDU, RETARD)
  const [filter, setFilter] = useState<"ALL" | "EN_COURS" | "RENDU" | "RETARD">("ALL");

  // ── STATE: Holds the book currently being edited, null if none selected
  const [editingLivre, setEditingLivre] = useState<Livre | null>(null);

  // ── STATE: Holds the member currently being edited, null if none selected
  const [editingAdherent, setEditingAdherent] = useState<Adherent | null>(null);

  const now = new Date();
  // ── LIVRES ─────────────

  /**
   * Adds a new book to the list
   * Used when user submits the AddLivre form
   */
  const handleAddLivre = (livre: Livre) =>
    setLivres((prev) => [...prev, livre]);

  /**
   * Deletes a book by ID from the API and removes it from state
   * Sends DELETE request to backend and updates local state on success
   */
  const handleDeleteLivre = (id: number) => {
    fetch(`http://localhost:5000/api/v1/livres/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur suppression");
        setLivres((prev) => prev.filter((l) => l.id !== id));
      })
      .catch(console.error);
  };

  /**
   * Updates an existing book and clears the edit form
   * Called when user saves changes to an existing book
   */
  const handleUpdateLivre = (updated: Livre) => {
    setLivres((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
    setEditingLivre(null);
  };

  /**
   * Cancels book editing by clearing the edit form
   * Used when user clicks "Cancel" button on edit form
   */
  const handleCancelEditLivre = () => setEditingLivre(null);

  // ── ADHERENTS ─────────

  /**
   * Adds a new member (adherent) to the list
   * Used when user submits the AddAdherent form
   */
  const handleAddAdherent = (adherent: Adherent) =>
    setAdherents((prev) => [...prev, adherent]);

  /**
   * Deletes a member by ID from the API and removes it from state
   * Sends DELETE request to backend and updates local state on success
   */
  const handleDeleteAdherent = (id: number) => {
    fetch(`http://localhost:5000/api/v1/adherents/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur suppression");
        setAdherents((prev) => prev.filter((a) => a.id !== id));
      })
      .catch(console.error);
  };

  /**
   * Updates an existing member and clears the edit form
   * Called when user saves changes to an existing member
   */
  const handleUpdateAdherent = (updated: Adherent) => {
    setAdherents((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    setEditingAdherent(null);
  };

  /**
   * Cancels member editing by clearing the edit form
   * Used when user clicks "Cancel" button on edit form
   */
  const handleCancelEditAdherent = () => setEditingAdherent(null);

  // ── EMPRUNTS ─────────

  /**
   * Adds a new loan (emprunt) to the list
   * Called when a member borrows a book
   */
  const handleAddEmprunt = (emprunt: Emprunt) => {
    setEmprunts((prev) => [...prev, emprunt]);
  };

  /**
   * Returns a borrowed book (marks it as returned in the API)
   * Updates the loan with the current return date and notifies the backend
   * @async - makes a PUT request to backend
   */
  const handleReturnEmprunt = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/emprunts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date_retour_effective: new Date().toISOString(),
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur retour");

      const updated = await res.json();

      setEmprunts((prev) =>
        prev.map((e) => (e.id === id ? updated : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ── DERIVED STATE (FILTERING) ─────────
  /**
   * Filters the emprunts array based on selected filter status
   * - ALL: shows all loans
   * - EN_COURS: shows active loans (not returned)
   * - RENDU: shows returned loans
   * - RETARD: shows loans that are overdue
   */
  const filteredEmprunts = emprunts.filter((e) => {
    const returned = e.date_retour_effective !== null && e.date_retour_effective !== "";
    const datePrevue = new Date(e.date_retour_prevue);
    const isLate = !returned && datePrevue < now;

    if (filter === "ALL") return true;
    if (filter === "RENDU") return returned;
    if (filter === "RETARD") return isLate;
    if (filter === "EN_COURS") return !returned && !isLate;

    return true;
  });

  // ── DERIVED BOOK AVAILABILITY ─────────
  /**
   * Adds availability status to each book
   * Marks a book as borrowed if there's an active loan for it
   */
  const livresAvecDisponibilite = livres.map((livre) => {
    const isBorrowed = emprunts.some(
      (e) =>
        e.livre_id === livre.id &&
        !e.date_retour_effective
    );

    return {
      ...livre,
      disponible: !isBorrowed,
    };
  });

  // ── FETCH DATA ─────────
  /**
   * Loads initial data from the backend when component mounts
   * Fetches books, members, and loans from the API
   * Runs once on component mount (empty dependency array)
   */
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/livres')
      .then((res) => res.json())
      .then(setLivres)
      .catch(console.error);

    fetch('http://localhost:5000/api/v1/adherents')
      .then((res) => res.json())
      .then(setAdherents)
      .catch(console.error);

    fetch('http://localhost:5000/api/v1/emprunts')
      .then((res) => res.json())
      .then(setEmprunts)
      .catch(console.error);
  }, []);

  return (
    <div className="App" id="background">
      <h1>Mini Library</h1>

      <div id="listes">
        <div id="cards">
          <ListeLivres
            livres={livresAvecDisponibilite}
            onDelete={handleDeleteLivre}
            onEdit={setEditingLivre}
          />
        </div>

        <div id="cards">
          <ListeAdherents
            adherents={adherents}
            onDelete={handleDeleteAdherent}
            onEdit={setEditingAdherent}
          />
        </div>
      </div>

      <div id="requestlist">
        <div id="requettes">
          <AddLivre
            onAdd={handleAddLivre}
            onUpdate={handleUpdateLivre}
            livreToEdit={editingLivre}
            onCancel={handleCancelEditLivre}
          />

          <AddAdherent
            onAdd={handleAddAdherent}
            onUpdate={handleUpdateAdherent}
            adherentToEdit={editingAdherent}
            onCancel={handleCancelEditAdherent}
          />

          <div>
            <h3>Filtres emprunts</h3>

            <button onClick={() => setFilter("ALL")}>Tous</button>
            <button onClick={() => setFilter("EN_COURS")}>En cours</button>
            <button onClick={() => setFilter("RENDU")}>Rendus</button>
            <button onClick={() => setFilter("RETARD")}>En retard</button>
          </div>

          <ListeEmprunts
            emprunts={filteredEmprunts}
            onReturn={handleReturnEmprunt}
            onAdd={handleAddEmprunt}
          />
        </div>
      </div>
    </div>
  );
};

export default App;