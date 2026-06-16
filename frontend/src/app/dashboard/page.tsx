'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';

type Summary = {
  users: number;
  courses: number;
  modules: number;
  lessons: number;
};

type Activity = {
  audit_id: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  created_at: string;
  user?: { email: string; first_name: string; last_name: string } | null;
  tenant?: { code: string; name: string } | null;
};

const emptySummary: Summary = { users: 0, courses: 0, modules: 0, lessons: 0 };

export default function DashboardPage() {
  const [status, setStatus] = useState('Cargando...');
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || '';

    Promise.all([
      apiGet('/health', token),
      apiGet('/dashboard/summary', token),
      apiGet('/dashboard/activity', token)
    ])
      .then(([, summaryData, activityData]) => {
        setStatus('API conectada');
        setSummary(summaryData);
        setActivity(activityData);
      })
      .catch(() => setStatus('No se pudo cargar el dashboard'));
  }, []);

  return (
    <main>
      <h1>Dashboard</h1>
      <p>{status}</p>

      <section>
        <article>
          <h2>Usuarios</h2>
          <strong>{summary.users}</strong>
          <p>Total de usuarios registrados.</p>
        </article>
        <article>
          <h2>Cursos</h2>
          <strong>{summary.courses}</strong>
          <p>Total de cursos creados.</p>
        </article>
        <article>
          <h2>Modulos</h2>
          <strong>{summary.modules}</strong>
          <p>Total de modulos academicos.</p>
        </article>
        <article>
          <h2>Lecciones</h2>
          <strong>{summary.lessons}</strong>
          <p>Total de lecciones disponibles.</p>
        </article>
      </section>

      <section>
        <article>
          <h2>Accesos rapidos</h2>
          <p><a href="/users">Usuarios</a></p>
          <p><a href="/roles">Roles</a></p>
          <p><a href="/permissions">Permisos</a></p>
          <p><a href="/audit">Auditoria</a></p>
          <p><a href="/courses">Cursos</a></p>
          <p><a href="/modules">Modulos</a></p>
          <p><a href="/lessons">Lecciones</a></p>
        </article>

        <article>
          <h2>Actividad reciente</h2>
          {activity.length === 0 ? <p>Sin actividad reciente.</p> : null}
          <ul>
            {activity.map((item) => (
              <li key={item.audit_id}>
                <strong>{item.action}</strong> en {item.entity_type} — {new Date(item.created_at).toLocaleString()}
                {item.user ? ` — ${item.user.email}` : ''}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
