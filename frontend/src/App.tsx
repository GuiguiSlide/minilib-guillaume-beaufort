import React, { useEffect, useState } from 'react';
import type { Livre } from './types/livre';
import ListeLivres from './components/ListeLivres';

const App: React.FC = () => {
  const [livres, setLivres] = useState<Livre[]>([]);

  // Fetch books from your backend
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/livres') // backend port
      .then(res => res.json())
      .then((data: Livre[]) => setLivres(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>Mini Library</h1>
      {/* Pass livres to your ListeLivres component */}
      <ListeLivres livres={livres} />
    </div>
  );
};

export default App;