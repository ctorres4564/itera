import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it, expect } from 'vitest';

import App from '../App';
import { installMockWorker } from './testUtils/mockWorker';

describe('App', () => {
  beforeEach(() => {
    installMockWorker();
  });

  it('renders the Workspace header and sidebar', () => {
    render(<App />);
    
    expect(screen.getByText('ITERA')).toBeInTheDocument();
    expect(screen.getByText('Python para iniciantes')).toBeInTheDocument();
    expect(screen.getByText('1.1 — print()')).toBeInTheDocument();
  });
});
