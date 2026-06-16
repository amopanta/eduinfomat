'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { apiGet } from '../../lib/api';

type AuditRow = {
  audit_id: string;
  created_at: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  tenant_id?: string | null;
  user_id?: string | null;
  metadata?: unknown;
  tenant?: { name?: string; code?: string } | null;
  user?: { email?: string; first_name?: string; last_name?: string } | null;
};

const emptyFilters = { action: '', entity_type: '', tenant_id: '', user_id: '', date_from: '', date_to: '' };

export default function AuditPage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [items, setItems] = useState<AuditRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState('');

  const token = () => localStorage.getItem('access_token') || '';

  function queryString(currentPage = page) {
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', '25');
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }

  async function loadAudit(currentPage = page) {
    try {
      const data = await apiGet(`/audit?${queryString(currentPage)}`, token());
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || currentPage);
      setMessage('Auditoria cargada.');
    } catch {
      setMessage('No fue posible cargar auditoria.');
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    loadAudit(1);
  }

  function exportUrl() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    return `${apiUrl}/audit/export/csv?${queryString(1)}`;
  }

  return (
    <main>
      <h1>Auditoria</h1>
      <p>Consulta de eventos del sistema.</p>
      <section>
        <article>
          <h2>Filtros</h2>
          <form onSubmit={submit}>
            <input value={filters.action} onChange={(e) => setFilters({ ...filters, action: e.target.value })} placeholder="Accion" />
            <input value={filters.entity_type} onChange={(e) => setFilters({ ...filters, entity_type: e.target.value })} placeholder="Entidad" />
            <input value={filters.tenant_id} onChange={(e) => setFilters({ ...filters, tenant_id: e.target.value })} placeholder="Tenant ID" />
            <input value={filters.user_id} onChange={(e) => setFilters({ ...filters, user_id: e.target.value })} placeholder="User ID" />
            <input value={filters.date_from} onChange={(e) => setFilters({ ...filters, date_from: e.target.value })} type="date" />
            <input value={filters.date_to} onChange={(e) => setFilters({ ...filters, date_to: e.target.value })} type="date" />
            <button type="submit">Buscar</button>
          </form>
        </article>
        <article>
          <h2>Exportar</h2>
          <p>Total actual: {total}</p>
          <a href={exportUrl()} target="_blank">Descargar CSV</a>
        </article>
      </section>
      <p>{message}</p>
      <table>
        <thead><tr><th>Fecha</th><th>Accion</th><th>Entidad</th><th>Tenant</th><th>Usuario</th><th>Detalle</th></tr></thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.audit_id}>
              <td>{new Date(row.created_at).toLocaleString()}</td>
              <td>{row.action}</td>
              <td>{row.entity_type}</td>
              <td>{row.tenant?.code || row.tenant_id || ''}</td>
              <td>{row.user?.email || row.user_id || ''}</td>
              <td>{JSON.stringify(row.metadata || {})}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Pagina {page}</p>
      <button type="button" onClick={() => loadAudit(Math.max(page - 1, 1))}>Anterior</button>{' '}
      <button type="button" onClick={() => loadAudit(page + 1)}>Siguiente</button>
    </main>
  );
}
