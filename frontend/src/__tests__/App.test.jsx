import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';
import axios from 'axios';

jest.mock('axios');

describe('App Dashboard', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.endsWith('/dashboard/stats')) {
        return Promise.resolve({
          data: {
            total_clients: 2,
            active_clients: 1,
            total_cases: 3,
            active_cases: 2,
            pending_cases: 1,
            closed_cases: 0,
            upcoming_appointments: 1,
            total_documents: 4,
          },
        });
      }
      if (url.endsWith('/clients')) return Promise.resolve({ data: [] });
      if (url.endsWith('/cases')) return Promise.resolve({ data: [] });
      if (url.endsWith('/documents')) return Promise.resolve({ data: [] });
      if (url.endsWith('/appointments')) return Promise.resolve({ data: [] });
      if (url.endsWith('/case-updates')) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: {} });
    });
  });

  it('renderiza labels de estadísticas del Dashboard', async () => {
    render(<App />);

    // Espera a que se rendericen las tarjetas tras cargar datos
    expect(await screen.findByText(/Total Clientes/i)).toBeInTheDocument();
    expect(await screen.findByText(/Casos Activos/i)).toBeInTheDocument();
  });
});

