import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [blockedItems, setBlockedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then(response => response.json())
      .then(data => {
        const initialItems = data.message.map((imageUrl, index) => ({
          id: index + 1,
          imageUrl,
          name: `Perro ${index + 1}`,
        }));
        setItems(initialItems);
      });
  }, []);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteItems');
    if (storedFavorites) {
      setFavoriteItems(JSON.parse(storedFavorites));
    }

    const storedBlockedItems = localStorage.getItem('blockedItems');
    if (storedBlockedItems) {
      setBlockedItems(JSON.parse(storedBlockedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  useEffect(() => {
    localStorage.setItem('blockedItems', JSON.stringify(blockedItems));
  }, [blockedItems]);

  const toggleFavorite = (itemId) => {
    if (blockedItems.includes(itemId)) {
      return;
    }

    const itemIndex = favoriteItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      const updatedFavorites = [...favoriteItems];
      updatedFavorites.splice(itemIndex, 1);
      setFavoriteItems(updatedFavorites);
    } else {
      const itemToAdd = items.find(item => item.id === itemId);
      if (itemToAdd) {
        setFavoriteItems([...favoriteItems, itemToAdd]);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleBlockItem = (itemId) => {
    const isBlocked = blockedItems.includes(itemId);
    if (isBlocked) {
      const updatedBlockedItems = blockedItems.filter((id) => id !== itemId);
      setBlockedItems(updatedBlockedItems);
    } else {
      setBlockedItems([...blockedItems, itemId]);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = filteredItems.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <div className="App">
      <h1>Lista de fotos de perros</h1>
      <div className="main-section">
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar perros..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={handleSortOrderChange}>
            Ordenar {sortOrder === 'asc' ? 'ascendente' : 'descendente'}
          </button>
        </div>
        <ul className="items-list">
          {sortedItems.map((item) => (
            <li key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <button onClick={() => toggleFavorite(item.id)}>
                {favoriteItems.findIndex(favorite => favorite.id === item.id) !== -1
                  ? 'Quitar de favoritos'
                  : 'Marcar como favorito'}
              </button>
              <button onClick={() => handleBlockItem(item.id)}>
                {blockedItems.includes(item.id) ? 'Desbloquear' : 'Bloquear'}
              </button>
            </li>
          ))}
        </ul>
        <div className="favorites-section">
          <h2>Elementos favoritos</h2>
          <ul className="favorites-list">
            {favoriteItems.map((favorite, index) => (
              <li key={index}>
                <img src={favorite.imageUrl} alt={favorite.name} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <footer className="footer">
        <p className="footer-text">
          Sitio Web desarrollado por: Vicente Herrera
        </p>
      </footer>
    </div>
  );
}

export default App;
