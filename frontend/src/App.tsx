// ── frontend/src/App.tsx ───────────────────────────
import { useEffect, useState } from 'react';
import type { Livre } from './types/livre';
import type { Adherent } from './types/adherent';
import ListeLivres from './components/ListeLivres';
import ListeAdherents from './components/ListeAdherents';
import AddLivre from "./components/AddLivre";
import AddAdherent from "./components/AddAdherent";
import './App.css';

const App = () => {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [adherents, setAdherents] = useState<Adherent[]>([]);
  const [editingLivre, setEditingLivre] = useState<Livre | null>(null);
  const [editingAdherent, setEditingAdherent] = useState<Adherent | null>(null);

  // ── LIVRES ─────────────
  const handleAddLivre = (livre: Livre) => setLivres((prev) => [...prev, livre]);
  const handleDeleteLivre = (id: number) => {
    fetch(`http://localhost:5000/api/v1/livres/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur suppression");
        setLivres((prev) => prev.filter((l) => l.id !== id));
      })
      .catch(console.error);
  };
  const handleUpdateLivre = (updated: Livre) => {
    setLivres((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setEditingLivre(null);
  };
  const handleCancelEditLivre = () => setEditingLivre(null);

  // ── ADHERENTS ─────────
  const handleAddAdherent = (adherent: Adherent) => setAdherents((prev) => [...prev, adherent]);
  const handleDeleteAdherent = (id: number) => {
    fetch(`http://localhost:5000/api/v1/adherents/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur suppression");
        setAdherents((prev) => prev.filter((a) => a.id !== id));
      })
      .catch(console.error);
  };
  const handleUpdateAdherent = (updated: Adherent) => {
    setAdherents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditingAdherent(null);
  };
  const handleCancelEditAdherent = () => setEditingAdherent(null);

  // ── FETCH DATA
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/livres')
      .then(res => res.json())
      .then((data: Livre[]) => setLivres(data))
      .catch(console.error);
    fetch('http://localhost:5000/api/v1/adherents')
      .then(res => res.json())
      .then((data: Adherent[]) => setAdherents(data))
      .catch(console.error);
  }, []);

  return (
    <div className="App" id="background">
      <h1>Mini Library</h1>

      <div id="listes">
        <div id="cards">
          <ListeLivres
            livres={livres}
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
        </div>
      </div>
    </div>
  );
};

export default App;