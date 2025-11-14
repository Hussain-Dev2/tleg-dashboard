
import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(()=> {
    const token = localStorage.getItem('token');
    fetchOrders(token).then(setOrders);
  }, []);
  return (
    <div>
      <h2>الطلبات</h2>
      <table>
        <thead><tr><th>الرقم</th><th>المستخدم</th><th>القيمة</th><th>الحالة</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.userId}</td>
              <td>{o.total}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
