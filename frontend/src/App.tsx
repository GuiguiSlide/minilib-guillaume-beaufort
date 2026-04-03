import React, { useEffect, useState } from 'react';
import type { Livre } from './types/livre';
import type { Adherent } from './types/adherent';
import ListeLivres from './components/ListeLivres';
import ListeAdherents from './components/ListeAdherents';
import './App.css';
const App: React.FC = () => {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [adherents, setAdherents] = useState<Adherent[]>([]);

  // Fetch books from your backend
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/livres')
      .then(res => res.json())
      .then((data: Livre[]) => setLivres(data))
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/adherents')
      .then(res => res.json())
      .then((data: Adherent[]) => setAdherents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App" id="background">
      <h1>Mini Library</h1>
      <div id="listes">
        {/* Pass livres to your ListeLivres component */}
        <div id="cards">
          <ListeLivres livres={livres} />
        </div>
        <div id="cards">
          <ListeAdherents adherents={adherents} />
        </div>
      </div>
    </div>
  );
};

export default App;
