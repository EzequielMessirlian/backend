import { loginUser } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.createElement('form');
  form.innerHTML = `
    <input type="email" id="email" placeholder="Email" required />
    <input type="password" id="password" placeholder="Password" required />
    <button type="submit">Login</button>
  `;
  document.body.appendChild(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const result = await loginUser(email, password);
    if (result.user) {
      alert('Login exitoso');
      window.location.href = 'index.html';
    } else {
      alert('Login fallido');
    }
  });
});
