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
        </article>
        <article>
          <h2>Tenants</h2>
          <p>Gestion de organizaciones.</p>
        </article>
        <article>
          <h2>Roles</h2>
          <p>Roles y permisos basicos.</p>
        </article>
      </section>
    </main>
  );
}
