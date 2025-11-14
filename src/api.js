

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
export async function fetchOrders(token) {
  return fetch(`${API}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
}
export async function fetchProducts() {
  return fetch(`${API}/products`).then(r => r.json());
}
