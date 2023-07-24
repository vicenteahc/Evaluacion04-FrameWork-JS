import React, { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then(response => response.json())
      .then(data => {
        const initialProducts = data.message.map((image, index) => ({
          id: index + 1,
          name: `Perro ${index + 1}`,
          imageUrl: image,
          favorite: false,
          blocked: false,
        }));
        setProducts(initialProducts);
      });
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const toggleFavorite = productId => {
    const updatedProducts = products.map(product =>
      product.id === productId ? { ...product, favorite: !product.favorite } : product
    );
    setProducts(updatedProducts);
  };

  const toggleBlocked = productId => {
    const updatedProducts = products.map(product =>
      product.id === productId ? { ...product, blocked: !product.blocked } : product
    );
    setProducts(updatedProducts);
  };

  const productList = searchTerm ? filteredProducts : products;

  return (
    <div>
      <h1>Listado de perros</h1>
      <input type="text" placeholder="Buscar perros..." value={searchTerm} onChange={handleSearchChange} />
      <ul>
        {productList.map(product => (
          <li key={product.id}>
            <img src={product.imageUrl} alt={product.name} />
            <span>{product.name}</span>
            <button onClick={() => toggleFavorite(product.id)}>
              {product.favorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
            </button>
            <button onClick={() => toggleBlocked(product.id)}>
              {product.blocked ? 'Desbloquear' : 'Bloquear'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
