const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function buildHeaders(token?: string, tenantId?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (tenantId) {
    headers['x-tenant-id'] = tenantId;
  }

  return headers;
}

export async function apiPost(path: string, body: unknown, token?: string, tenantId?: string) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(token, tenantId),
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud');
  }

  return response.json();
}

export async function apiPut(path: string, body: unknown, token?: string, tenantId?: string) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: buildHeaders(token, tenantId),
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud');
  }

  return response.json();
}

export async function apiDelete(path: string, token?: string, tenantId?: string) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(token, tenantId)
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud');
  }

  return response.json();
}

export async function apiGet(path: string, token?: string, tenantId?: string) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: buildHeaders(token, tenantId)
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud');
  }

  return response.json();
}
