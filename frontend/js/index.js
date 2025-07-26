import { getProducts } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const data = await getProducts();
  if (!data || !data.payload) return;

  const list = document.createElement('ul');
  data.payload.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price}
      <button onclick="alert('Agregar al carrito: ${p._id}')">Agregar</button>
    `;
    list.appendChild(li);
  });
  document.body.appendChild(list);
});
