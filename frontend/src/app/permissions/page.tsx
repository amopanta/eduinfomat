'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { apiDelete, apiGet, apiPost } from '../../lib/api';

type PermissionRow = { permission_id: string; code: string; name: string; description?: string | null };
type RolePermissionRow = { role_permission_id: string; permission_id: string; permission: PermissionRow };

const emptyForm = { code: '', name: '', description: '' };

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissionRow[]>([]);
  const [roleId, setRoleId] = useState('');
  const [permissionId, setPermissionId] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? permissions.filter((p) => `${p.code} ${p.name} ${p.description || ''}`.toLowerCase().includes(q)) : permissions;
  }, [query, permissions]);

  const token = () => localStorage.getItem('access_token') || '';

  async function loadPermissions() {
    try {
      setPermissions(await apiGet('/roles/permissions', token()));
      setMessage('Permisos cargados.');
    } catch {
      setMessage('No fue posible cargar permisos.');
    }
  }

  async function loadRolePermissions(currentRoleId = roleId) {
    if (!currentRoleId) return setMessage('Ingresa un Role ID.');
    try {
      setRolePermissions(await apiGet(`/roles/${currentRoleId}/permissions`, token()));
      setMessage('Permisos del rol cargados.');
    } catch {
      setMessage('No fue posible cargar permisos del rol.');
    }
  }

  async function createPermission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await apiPost('/roles/permissions', form, token());
      setForm(emptyForm);
      await loadPermissions();
      setMessage('Permiso creado.');
    } catch {
      setMessage('No fue posible crear permiso.');
    }
  }

  async function assignPermission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roleId || !permissionId) return setMessage('Role ID y Permission ID son requeridos.');
    try {
      await apiPost(`/roles/${roleId}/permissions`, { permission_id: permissionId }, token());
      setPermissionId('');
      await loadRolePermissions(roleId);
      setMessage('Permiso asignado al rol.');
    } catch {
      setMessage('No fue posible asignar permiso.');
    }
  }

  async function removePermission(permission_id: string) {
    if (!roleId) return setMessage('Ingresa un Role ID.');
    try {
      await apiDelete(`/roles/${roleId}/permissions/${permission_id}`, token());
      await loadRolePermissions(roleId);
      setMessage('Permiso removido del rol.');
    } catch {
      setMessage('No fue posible remover permiso.');
    }
  }

  return (
    <main>
      <h1>Permisos</h1>
      <p>Gestion de permisos y asignacion de permisos a roles.</p>
      <section>
        <article>
          <h2>Permisos</h2>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar permiso" />
          <button type="button" onClick={loadPermissions}>Cargar permisos</button>
        </article>
        <article>
          <h2>Crear permiso</h2>
          <form onSubmit={createPermission}>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Codigo ej: users.read" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripcion" />
            <button type="submit">Crear permiso</button>
          </form>
        </article>
        <article>
          <h2>Asignar a rol</h2>
          <form onSubmit={assignPermission}>
            <input value={roleId} onChange={(e) => setRoleId(e.target.value)} placeholder="Role ID" />
            <input value={permissionId} onChange={(e) => setPermissionId(e.target.value)} placeholder="Permission ID" />
            <button type="submit">Asignar permiso</button>
          </form>
          <button type="button" onClick={() => loadRolePermissions()}>Ver permisos del rol</button>
        </article>
      </section>
      <p>{message}</p>
      <h2>Listado de permisos</h2>
      <table>
        <thead><tr><th>Codigo</th><th>Nombre</th><th>Descripcion</th><th>ID</th></tr></thead>
        <tbody>{filtered.map((p) => <tr key={p.permission_id}><td>{p.code}</td><td>{p.name}</td><td>{p.description}</td><td>{p.permission_id}</td></tr>)}</tbody>
      </table>
      <h2>Permisos asignados al rol</h2>
      <table>
        <thead><tr><th>Codigo</th><th>Nombre</th><th>Acciones</th></tr></thead>
        <tbody>{rolePermissions.map((rp) => <tr key={rp.role_permission_id}><td>{rp.permission.code}</td><td>{rp.permission.name}</td><td><button type="button" onClick={() => removePermission(rp.permission.permission_id)}>Remover</button></td></tr>)}</tbody>
      </table>
    </main>
  );
}
