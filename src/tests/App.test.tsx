import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import App from '../App';

describe('App', () => {
  it('renders the landing page with expected text', () => {
    render(<App />);
    
    expect(screen.getByText('ITERA')).toBeInTheDocument();
    expect(screen.getByText('Plataforma modular de aprendizagem')).toBeInTheDocument();
    expect(screen.getByText('Primeira fase em preparação')).toBeInTheDocument();
  });
});
