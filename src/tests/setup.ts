import '@testing-library/jest-dom';
import { afterEach } from 'vitest';

// Evita que o localStorage real do jsdom vaze estado de progresso persistido
// entre testes que renderizam <Workspace /> sem injetar um repositório de teste.
afterEach(() => {
  window.localStorage.clear();
});
