

const API = process.env.REACT_APP_API_URL || 'tlygrmservesbot-production.up.railway.app';
export async function fetchOrders(token) {
  return fetch(`${API}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
}
export async function fetchProducts() {
  return fetch(`${API}/products`).then(r => r.json());
}
