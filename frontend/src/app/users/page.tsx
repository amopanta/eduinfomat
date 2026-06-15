'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { apiDelete, apiGet, apiPost } from '../../lib/api';

type UserRow = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at?: string;
};

export default function UsersPage() {
  const [tenantId, setTenantId] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '' });

  function token() {
    return localStorage.getItem('access_token') || '';
  }

  async function loadUsers(currentTenantId = tenantId) {
    if (!currentTenantId) {
      setMessage('Ingresa un Tenant ID para listar usuarios.');
      return;
    }

    try {
      const data = await apiGet('/users', token(), currentTenantId);
      setUsers(data);
      setMessage('Usuarios cargados.');
    } catch {
      setMessage('No fue posible cargar usuarios.');
    }
  }

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!tenantId) {
      setMessage('Tenant ID requerido.');
      return;
    }

    try {
      await apiPost('/users', { tenant_id: tenantId, ...form }, token(), tenantId);
      setForm({ email: '', password: '', first_name: '', last_name: '' });
      await loadUsers(tenantId);
      setMessage('Usuario creado.');
    } catch {
      setMessage('No fue posible crear el usuario.');
    }
  }

  async function deactivateUser(userId: string) {
    try {
      await apiDelete(`/users/${userId}`, token(), tenantId);
      await loadUsers(tenantId);
      setMessage('Usuario desactivado.');
    } catch {
      setMessage('No fue posible desactivar el usuario.');
    }
  }

  return (
    <main>
      <h1>Usuarios</h1>
      <p>Gestion basica de usuarios por tenant.</p>

      <section>
        <article>
          <h2>Tenant</h2>
          <input value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="Tenant ID" />
          <button type="button" onClick={() => loadUsers()}>Cargar usuarios</button>
        </article>

        <article>
          <h2>Crear usuario</h2>
          <form onSubmit={createUser}>
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="Nombres" />
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Apellidos" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Correo" />
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contraseña" type="password" />
            <button type="submit">Crear usuario</button>
          </form>
        </article>
      </section>

      <p>{message}</p>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button type="button" onClick={() => deactivateUser(user.user_id)}>Desactivar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
