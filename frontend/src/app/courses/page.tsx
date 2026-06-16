'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/api';

type CourseRow = {
  course_id: string;
  tenant_id: string;
  instructor_id?: string | null;
  code: string;
  name: string;
  description?: string | null;
  category?: string | null;
  status: string;
  instructor?: { email?: string; first_name?: string; last_name?: string } | null;
};

const emptyForm = { tenant_id: '', code: '', name: '', description: '', category: '', instructor_id: '', status: 'draft' };
const emptyEdit = { code: '', name: '', description: '', category: '', instructor_id: '', status: 'draft' };

export default function CoursesPage() {
  const [tenantId, setTenantId] = useState('');
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [selected, setSelected] = useState<CourseRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(emptyEdit);
  const [message, setMessage] = useState('');

  const token = () => localStorage.getItem('access_token') || '';

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? courses.filter((c) => `${c.code} ${c.name} ${c.category || ''} ${c.status}`.toLowerCase().includes(q)) : courses;
  }, [query, courses]);

  async function loadCourses(currentTenantId = tenantId) {
    if (!currentTenantId) return setMessage('Ingresa Tenant ID.');
    try {
      setCourses(await apiGet('/courses', token(), currentTenantId));
      setMessage('Cursos cargados.');
    } catch {
      setMessage('No fue posible cargar cursos.');
    }
  }

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await apiPost('/courses', form, token(), form.tenant_id || tenantId);
      setForm({ ...emptyForm, tenant_id: form.tenant_id || tenantId });
      await loadCourses(form.tenant_id || tenantId);
      setMessage('Curso creado.');
    } catch {
      setMessage('No fue posible crear curso.');
    }
  }

  function selectCourse(course: CourseRow) {
    setSelected(course);
    setEdit({
      code: course.code,
      name: course.name,
      description: course.description || '',
      category: course.category || '',
      instructor_id: course.instructor_id || '',
      status: course.status
    });
  }

  async function updateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return setMessage('Selecciona un curso.');
    try {
      await apiPut(`/courses/${selected.course_id}`, edit, token(), selected.tenant_id);
      setSelected(null);
      await loadCourses(selected.tenant_id);
      setMessage('Curso actualizado.');
    } catch {
      setMessage('No fue posible actualizar curso.');
    }
  }

  async function deactivateCourse(course: CourseRow) {
    try {
      await apiDelete(`/courses/${course.course_id}`, token(), course.tenant_id);
      await loadCourses(course.tenant_id);
      setMessage('Curso desactivado.');
    } catch {
      setMessage('No fue posible desactivar curso.');
    }
  }

  return (
    <main>
      <h1>Cursos</h1>
      <p>Gestion academica inicial de cursos.</p>
      <section>
        <article>
          <h2>Consultar</h2>
          <input value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="Tenant ID" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar curso" />
          <button type="button" onClick={() => loadCourses()}>Cargar cursos</button>
        </article>
        <article>
          <h2>Crear curso</h2>
          <form onSubmit={createCourse}>
            <input value={form.tenant_id} onChange={(e) => setForm({ ...form, tenant_id: e.target.value })} placeholder="Tenant ID" />
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Codigo" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Categoria" />
            <input value={form.instructor_id} onChange={(e) => setForm({ ...form, instructor_id: e.target.value })} placeholder="Instructor ID" />
            <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Estado" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripcion" />
            <button type="submit">Crear curso</button>
          </form>
        </article>
        <article>
          <h2>Editar curso</h2>
          {selected ? <p>Seleccionado: {selected.code}</p> : <p>Selecciona un curso.</p>}
          <form onSubmit={updateCourse}>
            <input value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value })} placeholder="Codigo" />
            <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="Nombre" />
            <input value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} placeholder="Categoria" />
            <input value={edit.instructor_id} onChange={(e) => setEdit({ ...edit, instructor_id: e.target.value })} placeholder="Instructor ID" />
            <input value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })} placeholder="Estado" />
            <input value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} placeholder="Descripcion" />
            <button type="submit">Guardar curso</button>
          </form>
        </article>
      </section>
      <p>{message}</p>
      <table>
        <thead><tr><th>Codigo</th><th>Nombre</th><th>Categoria</th><th>Instructor</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {filtered.map((course) => (
            <tr key={course.course_id}>
              <td>{course.code}</td>
              <td>{course.name}</td>
              <td>{course.category}</td>
              <td>{course.instructor?.email || course.instructor_id || ''}</td>
              <td>{course.status}</td>
              <td><button type="button" onClick={() => selectCourse(course)}>Editar</button>{' '}<button type="button" onClick={() => deactivateCourse(course)}>Desactivar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
