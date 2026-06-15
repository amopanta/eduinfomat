'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/api';

type RoleRow = { role_id: string; code: string; name: string; description?: string | null };

const emptyForm = { code: '', name: '', description: '' };
const emptyEdit = { name: '', description: '' };

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [selected, setSelected] = useState<RoleRow | null>(null);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(emptyEdit);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? roles.filter((r) => `${r.code} ${r.name} ${r.description || ''}`.toLowerCase().includes(q)) : roles;
  }, [query, roles]);

  const token = () => localStorage.getItem('access_token') || '';

  async function loadRoles() {
    try {
      setRoles(await apiGet('/roles', token()));
      setMessage('Roles cargados.');
    } catch {
      setMessage('No fue posible cargar roles.');
    }
  }

  async function createRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await apiPost('/roles', form, token());
      setForm(emptyForm);
      await loadRoles();
      setMessage('Rol creado.');
    } catch {
      setMessage('No fue posible crear el rol.');
    }
  }

  function selectRole(role: RoleRow) {
    setSelected(role);
    setEdit({ name: role.name, description: role.description || '' });
  }

  async function updateRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return setMessage('Selecciona un rol.');
    try {
      await apiPut(`/roles/${selected.role_id}`, edit, token());
      setSelected(null);
      await loadRoles();
      setMessage('Rol actualizado.');
    } catch {
      setMessage('No fue posible actualizar el rol.');
    }
  }

  async function deleteRole(roleId: string) {
    try {
      await apiDelete(`/roles/${roleId}`, token());
      await loadRoles();
      setMessage('Rol eliminado.');
    } catch {
      setMessage('No fue posible eliminar el rol.');
    }
  }

  return (
    <main>
      <h1>Roles</h1>
      <p>Gestion basica de roles de plataforma.</p>
      <section>
        <article>
          <h2>Buscar</h2>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar rol" />
          <button type="button" onClick={loadRoles}>Cargar roles</button>
        </article>
        <article>
          <h2>Crear rol</h2>
          <form onSubmit={createRole}>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Codigo" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripcion" />
            <button type="submit">Crear rol</button>
          </form>
        </article>
        <article>
          <h2>Editar rol</h2>
          {selected ? <p>Seleccionado: {selected.code}</p> : <p>Selecciona un rol de la tabla.</p>}
          <form onSubmit={updateRole}>
            <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="Nombre" />
            <input value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} placeholder="Descripcion" />
            <button type="submit">Guardar cambios</button>
          </form>
        </article>
      </section>
      <p>{message}</p>
      <table>
        <thead><tr><th>Codigo</th><th>Nombre</th><th>Descripcion</th><th>Acciones</th></tr></thead>
        <tbody>
          {filtered.map((role) => (
            <tr key={role.role_id}>
              <td>{role.code}</td>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>
                <button type="button" onClick={() => selectRole(role)}>Editar</button>{' '}
                <button type="button" onClick={() => deleteRole(role.role_id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
