'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { apiGet, apiPost } from '../../lib/api';

const emptyForm = {
  tenant_name: '',
  tenant_code: '',
  admin_email: '',
  admin_password: '',
  admin_first_name: '',
  admin_last_name: ''
};

export default function InstallPage() {
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [message, setMessage] = useState('Validando estado de instalacion...');
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    apiGet('/install/status')
      .then((data) => {
        setInstalled(data.installed);
        setMessage(data.installed ? 'La plataforma ya fue instalada.' : 'Completa el asistente de instalacion inicial.');
      })
      .catch(() => setMessage('No fue posible validar el estado de instalacion.'));
  }, []);

  async function setup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await apiPost('/install/setup', form);
      setInstalled(true);
      setMessage('Instalacion completada. Ya puedes iniciar sesion con el administrador creado.');
      setForm(emptyForm);
    } catch {
      setMessage('No fue posible completar la instalacion. Verifica los datos o si la plataforma ya fue instalada.');
    }
  }

  return (
    <main>
      <h1>Instalacion de INFOMATT</h1>
      <p>{message}</p>

      {installed === false && (
        <section>
          <article>
            <h2>Organizacion inicial</h2>
            <form onSubmit={setup}>
              <input value={form.tenant_name} onChange={(e) => setForm({ ...form, tenant_name: e.target.value })} placeholder="Nombre de la organizacion" />
              <input value={form.tenant_code} onChange={(e) => setForm({ ...form, tenant_code: e.target.value })} placeholder="Codigo de organizacion" />
              <h2>Administrador principal</h2>
              <input value={form.admin_first_name} onChange={(e) => setForm({ ...form, admin_first_name: e.target.value })} placeholder="Nombres" />
              <input value={form.admin_last_name} onChange={(e) => setForm({ ...form, admin_last_name: e.target.value })} placeholder="Apellidos" />
              <input value={form.admin_email} onChange={(e) => setForm({ ...form, admin_email: e.target.value })} placeholder="Correo administrador" />
              <input value={form.admin_password} onChange={(e) => setForm({ ...form, admin_password: e.target.value })} placeholder="Contrasena" type="password" />
              <button type="submit">Instalar plataforma</button>
            </form>
          </article>
        </section>
      )}

      {installed === true && <a href="/login">Ir al login</a>}
    </main>
  );
}
