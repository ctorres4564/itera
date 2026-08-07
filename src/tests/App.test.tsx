import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import App from '../App';

describe('App', () => {
  it('renders the Workspace header and sidebar', () => {
    render(<App />);
    
    expect(screen.getByText('ITERA')).toBeInTheDocument();
    expect(screen.getByText('Python para iniciantes')).toBeInTheDocument();
    expect(screen.getByText('1.1 — print()')).toBeInTheDocument();
  });
});
