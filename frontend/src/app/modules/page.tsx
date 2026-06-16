'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/api';

type ModuleRow = {
  module_id: string;
  course_id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number;
  status: string;
};

const emptyForm = { code: '', name: '', description: '', sort_order: 0, status: 'draft' };

export default function ModulesPage() {
  const [courseId, setCourseId] = useState('');
  const [query, setQuery] = useState('');
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [selected, setSelected] = useState<ModuleRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const token = () => localStorage.getItem('access_token') || '';

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? modules.filter((m) => `${m.code} ${m.name} ${m.status}`.toLowerCase().includes(q)) : modules;
  }, [query, modules]);

  async function loadModules(currentCourseId = courseId) {
    if (!currentCourseId) return setMessage('Ingresa Course ID.');
    try {
      setModules(await apiGet(`/courses/${currentCourseId}/modules`, token()));
      setMessage('Modulos cargados.');
    } catch {
      setMessage('No fue posible cargar modulos.');
    }
  }

  async function createModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!courseId) return setMessage('Ingresa Course ID.');
    try {
      await apiPost(`/courses/${courseId}/modules`, form, token());
      setForm(emptyForm);
      await loadModules(courseId);
      setMessage('Modulo creado.');
    } catch {
      setMessage('No fue posible crear modulo.');
    }
  }

  function selectModule(module: ModuleRow) {
    setSelected(module);
    setEdit({
      code: module.code,
      name: module.name,
      description: module.description || '',
      sort_order: module.sort_order,
      status: module.status
    });
  }

  async function updateModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return setMessage('Selecciona un modulo.');
    try {
      await apiPut(`/modules/${selected.module_id}`, edit, token());
      setSelected(null);
      await loadModules(selected.course_id);
      setMessage('Modulo actualizado.');
    } catch {
      setMessage('No fue posible actualizar modulo.');
    }
  }

  async function deactivateModule(module: ModuleRow) {
    try {
      await apiDelete(`/modules/${module.module_id}`, token());
      await loadModules(module.course_id);
      setMessage('Modulo desactivado.');
    } catch {
      setMessage('No fue posible desactivar modulo.');
    }
  }

  return (
    <main>
      <h1>Modulos</h1>
      <p>Gestion de modulos asociados a un curso.</p>

      <section>
        <article>
          <h2>Consultar</h2>
          <input value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="Course ID" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar modulo" />
          <button type="button" onClick={() => loadModules()}>Cargar modulos</button>
        </article>

        <article>
          <h2>Crear modulo</h2>
          <form onSubmit={createModule}>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Codigo" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripcion" />
            <input value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} placeholder="Orden" type="number" />
            <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Estado" />
            <button type="submit">Crear modulo</button>
          </form>
        </article>

        <article>
          <h2>Editar modulo</h2>
          {selected ? <p>Seleccionado: {selected.code}</p> : <p>Selecciona un modulo.</p>}
          <form onSubmit={updateModule}>
            <input value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value })} placeholder="Codigo" />
            <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="Nombre" />
            <input value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} placeholder="Descripcion" />
            <input value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} placeholder="Orden" type="number" />
            <input value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })} placeholder="Estado" />
            <button type="submit">Guardar modulo</button>
          </form>
        </article>
      </section>

      <p>{message}</p>

      <table>
        <thead><tr><th>Orden</th><th>Codigo</th><th>Nombre</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {filtered.map((module) => (
            <tr key={module.module_id}>
              <td>{module.sort_order}</td>
              <td>{module.code}</td>
              <td>{module.name}</td>
              <td>{module.status}</td>
              <td>
                <button type="button" onClick={() => selectModule(module)}>Editar</button>{' '}
                <button type="button" onClick={() => deactivateModule(module)}>Desactivar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
