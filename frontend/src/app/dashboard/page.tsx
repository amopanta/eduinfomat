'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';

export default function DashboardPage() {
  const [status, setStatus] = useState('Cargando...');

  useEffect(() => {
    const token = localStorage.getItem('access_token') || '';
    apiGet('/health', token)
      .then(() => setStatus('API conectada'))
      .catch(() => setStatus('No se pudo conectar con la API'));
  }, []);

  return (
    <main>
      <h1>Dashboard</h1>
      <p>{status}</p>
      <section>
        <article>
          <h2>Usuarios</h2>
          <p>Gestion de usuarios del tenant.</p>
          <a href="/users">Abrir usuarios</a>
        </article>
        <article>
          <h2>Roles</h2>
          <p>Gestion de roles de plataforma.</p>
          <a href="/roles">Abrir roles</a>
        </article>
        <article>
          <h2>Permisos</h2>
          <p>Gestion de permisos y asignacion a roles.</p>
          <a href="/permissions">Abrir permisos</a>
        </article>
        <article>
          <h2>Auditoria</h2>
          <p>Consulta de eventos y trazabilidad.</p>
          <a href="/audit">Abrir auditoria</a>
        </article>
        <article>
          <h2>Tenants</h2>
          <p>Gestion de organizaciones.</p>
        </article>
      </section>
    </main>
  );
}
