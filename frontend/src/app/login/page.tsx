'use client';

import { useState } from 'react';
import { apiPost } from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');

    try {
      const result = await apiPost('/auth/login', { email, password });
      localStorage.setItem('access_token', result.access_token);
      setMessage('Login correcto');
      window.location.href = '/dashboard';
    } catch {
      setMessage('Credenciales invalidas');
    }
  }

  return (
    <main>
      <h1>Ingresar a IF.EDU.INFOMATT</h1>
      <form onSubmit={submit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
        <button type="submit">Ingresar</button>
      </form>
      <p>{message}</p>
    </main>
  );
}
