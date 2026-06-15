'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/api';

type UserRow = { user_id: string; email: string; first_name: string; last_name: string; status: string };

const emptyCreate = { email: '', password: '', first_name: '', last_name: '' };
const emptyEdit = { first_name: '', last_name: '', status: 'active' };

export default function UsersPage() {
  const [tenantId, setTenantId] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [query, setQuery] = useState('');
  const [roleId, setRoleId] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(emptyCreate);
  const [edit, setEdit] = useState(emptyEdit);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? users.filter((u) => `${u.first_name} ${u.last_name} ${u.email} ${u.status}`.toLowerCase().includes(q)) : users;
  }, [query, users]);

  const token = () => localStorage.getItem('access_token') || '';

  async function loadUsers(currentTenantId = tenantId) {
    if (!currentTenantId) return setMessage('Ingresa un Tenant ID.');
    try {
      setUsers(await apiGet('/users', token(), currentTenantId));
      setMessage('Usuarios cargados.');
    } catch {
      setMessage('No fue posible cargar usuarios.');
    }
  }

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tenantId) return setMessage('Tenant ID requerido.');
    try {
      await apiPost('/users', { tenant_id: tenantId, ...form }, token(), tenantId);
      setForm(emptyCreate);
      await loadUsers(tenantId);
      setMessage('Usuario creado.');
    } catch {
      setMessage('No fue posible crear el usuario.');
    }
  }

  function selectUser(user: UserRow) {
    setSelected(user);
    setEdit({ first_name: user.first_name, last_name: user.last_name, status: user.status });
    setRoleId('');
  }

  async function updateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return setMessage('Selecciona un usuario.');
    try {
      await apiPut(`/users/${selected.user_id}`, edit, token(), tenantId);
      setSelected(null);
      await loadUsers(tenantId);
      setMessage('Usuario actualizado.');
    } catch {
      setMessage('No fue posible actualizar el usuario.');
    }
  }

  async function assignRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !roleId) return setMessage('Selecciona usuario e ingresa Role ID.');
    try {
      await apiPost('/roles/assign', { user_id: selected.user_id, role_id: roleId }, token(), tenantId);
      setRoleId('');
      setMessage('Rol asignado.');
    } catch {
      setMessage('No fue posible asignar el rol.');
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
      <p>Gestion de usuarios por tenant.</p>
      <section>
        <article>
          <h2>Tenant y busqueda</h2>
          <input value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="Tenant ID" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar usuario" />
          <button type="button" onClick={() => loadUsers()}>Cargar usuarios</button>
        </article>
        <article>
          <h2>Crear usuario</h2>
          <form onSubmit={createUser}>
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="Nombres" />
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Apellidos" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Correo" />
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contrasena" type="password" />
            <button type="submit">Crear usuario</button>
          </form>
        </article>
        <article>
          <h2>Editar / rol</h2>
          {selected ? <p>Seleccionado: {selected.email}</p> : <p>Selecciona un usuario de la tabla.</p>}
          <form onSubmit={updateUser}>
            <input value={edit.first_name} onChange={(e) => setEdit({ ...edit, first_name: e.target.value })} placeholder="Nombres" />
            <input value={edit.last_name} onChange={(e) => setEdit({ ...edit, last_name: e.target.value })} placeholder="Apellidos" />
            <input value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })} placeholder="Estado" />
            <button type="submit">Guardar cambios</button>
          </form>
          <form onSubmit={assignRole}>
            <input value={roleId} onChange={(e) => setRoleId(e.target.value)} placeholder="Role ID" />
            <button type="submit">Asignar rol</button>
          </form>
        </article>
      </section>
      <p>{message}</p>
      <table>
        <thead><tr><th>Nombre</th><th>Correo</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {filtered.map((user) => (
            <tr key={user.user_id}>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button type="button" onClick={() => selectUser(user)}>Editar</button>{' '}
                <button type="button" onClick={() => deactivateUser(user.user_id)}>Desactivar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
