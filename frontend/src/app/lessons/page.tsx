'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/api';

type LessonRow = {
  lesson_id: string;
  module_id: string;
  code: string;
  name: string;
  lesson_type: string;
  content?: string | null;
  sort_order: number;
  status: string;
};

const emptyForm = { code: '', name: '', lesson_type: 'TEXT', content: '', sort_order: 0, status: 'draft' };

export default function LessonsPage() {
  const [moduleId, setModuleId] = useState('');
  const [query, setQuery] = useState('');
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [selected, setSelected] = useState<LessonRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const token = () => localStorage.getItem('access_token') || '';

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? lessons.filter((l) => `${l.code} ${l.name} ${l.lesson_type} ${l.status}`.toLowerCase().includes(q)) : lessons;
  }, [query, lessons]);

  async function loadLessons(currentModuleId = moduleId) {
    if (!currentModuleId) return setMessage('Ingresa Module ID.');
    try {
      setLessons(await apiGet(`/modules/${currentModuleId}/lessons`, token()));
      setMessage('Lecciones cargadas.');
    } catch {
      setMessage('No fue posible cargar lecciones.');
    }
  }

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!moduleId) return setMessage('Ingresa Module ID.');
    try {
      await apiPost(`/modules/${moduleId}/lessons`, form, token());
      setForm(emptyForm);
      await loadLessons(moduleId);
      setMessage('Leccion creada.');
    } catch {
      setMessage('No fue posible crear leccion.');
    }
  }

  function selectLesson(lesson: LessonRow) {
    setSelected(lesson);
    setEdit({
      code: lesson.code,
      name: lesson.name,
      lesson_type: lesson.lesson_type,
      content: lesson.content || '',
      sort_order: lesson.sort_order,
      status: lesson.status
    });
  }

  async function updateLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return setMessage('Selecciona una leccion.');
    try {
      await apiPut(`/lessons/${selected.lesson_id}`, edit, token());
      setSelected(null);
      await loadLessons(selected.module_id);
      setMessage('Leccion actualizada.');
    } catch {
      setMessage('No fue posible actualizar leccion.');
    }
  }

  async function deactivateLesson(lesson: LessonRow) {
    try {
      await apiDelete(`/lessons/${lesson.lesson_id}`, token());
      await loadLessons(lesson.module_id);
      setMessage('Leccion desactivada.');
    } catch {
      setMessage('No fue posible desactivar leccion.');
    }
  }

  return (
    <main>
      <h1>Lecciones</h1>
      <p>Gestion de lecciones asociadas a un modulo.</p>

      <section>
        <article>
          <h2>Consultar</h2>
          <input value={moduleId} onChange={(e) => setModuleId(e.target.value)} placeholder="Module ID" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar leccion" />
          <button type="button" onClick={() => loadLessons()}>Cargar lecciones</button>
        </article>

        <article>
          <h2>Crear leccion</h2>
          <form onSubmit={createLesson}>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Codigo" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" />
            <select value={form.lesson_type} onChange={(e) => setForm({ ...form, lesson_type: e.target.value })}>
              <option value="TEXT">TEXT</option>
              <option value="VIDEO">VIDEO</option>
              <option value="PDF">PDF</option>
              <option value="LINK">LINK</option>
            </select>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Contenido o URL" />
            <input value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} placeholder="Orden" type="number" />
            <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Estado" />
            <button type="submit">Crear leccion</button>
          </form>
        </article>

        <article>
          <h2>Editar leccion</h2>
          {selected ? <p>Seleccionada: {selected.code}</p> : <p>Selecciona una leccion.</p>}
          <form onSubmit={updateLesson}>
            <input value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value })} placeholder="Codigo" />
            <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="Nombre" />
            <select value={edit.lesson_type} onChange={(e) => setEdit({ ...edit, lesson_type: e.target.value })}>
              <option value="TEXT">TEXT</option>
              <option value="VIDEO">VIDEO</option>
              <option value="PDF">PDF</option>
              <option value="LINK">LINK</option>
            </select>
            <textarea value={edit.content} onChange={(e) => setEdit({ ...edit, content: e.target.value })} placeholder="Contenido o URL" />
            <input value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} placeholder="Orden" type="number" />
            <input value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })} placeholder="Estado" />
            <button type="submit">Guardar leccion</button>
          </form>
        </article>
      </section>

      <p>{message}</p>

      <table>
        <thead><tr><th>Orden</th><th>Codigo</th><th>Nombre</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {filtered.map((lesson) => (
            <tr key={lesson.lesson_id}>
              <td>{lesson.sort_order}</td>
              <td>{lesson.code}</td>
              <td>{lesson.name}</td>
              <td>{lesson.lesson_type}</td>
              <td>{lesson.status}</td>
              <td>
                <button type="button" onClick={() => selectLesson(lesson)}>Editar</button>{' '}
                <button type="button" onClick={() => deactivateLesson(lesson)}>Desactivar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
