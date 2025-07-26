// API base functions
const API_BASE = 'http://localhost:8080/api';

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/sessions/current`, {
    credentials: 'include'
  });
  return await res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/sessions/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  });
  return await res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/sessions/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  return await res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`, {
    credentials: 'include'
  });
  return await res.json();
}

export async function addToCart(cartId, productId) {
  const res = await fetch(`${API_BASE}/carts/${cartId}/product/${productId}`, {
    method: 'POST',
    credentials: 'include'
  });
  return await res.json();
}
