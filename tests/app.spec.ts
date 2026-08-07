import { test, expect } from '@playwright/test';

test('has title and landing page content', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toHaveText('ITERA');
  await expect(page.getByText('Python para iniciantes')).toBeVisible();
  await expect(page.getByText('1.1 — print()')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Editor de código' })).toBeVisible();
});

test('executa código Python real no motor (Worker + Pyodide) e exibe a saída', async ({ page }) => {
  // Pyodide é baixado de verdade do CDN na primeira carga do Worker; dar folga generosa.
  test.setTimeout(120_000);
  await page.goto('/');

  const editor = page.getByRole('textbox', { name: 'Editor de código' });
  await editor.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('print("ola do motor python")');

  const executeButton = page.getByRole('button', { name: 'Executar' });
  // Só existe um botão com esse nome exato depois que o motor termina de carregar.
  await expect(executeButton).toBeEnabled({ timeout: 90_000 });
  await executeButton.click();

  // exact: true evita colidir com o literal de string destacado dentro do editor
  await expect(page.getByText('ola do motor python', { exact: true })).toBeVisible({ timeout: 15_000 });
});

test('fluxo pedagógico completo: Executar produz saída real e Verificar conclui a unidade', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');

  const editor = page.getByRole('textbox', { name: 'Editor de código' });
  await editor.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('print("Meu diário de saúde")');

  const executeButton = page.getByRole('button', { name: 'Executar' });
  await expect(executeButton).toBeEnabled({ timeout: 90_000 });
  await executeButton.click();

  await expect(page.getByText('Meu diário de saúde', { exact: true })).toBeVisible({ timeout: 15_000 });

  const verifyButton = page.getByRole('button', { name: 'Verificar' });
  await expect(verifyButton).toBeEnabled();
  await verifyButton.click();

  await expect(page.getByText('A mensagem foi exibida corretamente.')).toBeVisible();
  await expect(page.getByText('Concluído')).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
});

test('persistência local: código, conclusão e progresso sobrevivem a um reload da página', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');

  const editor = page.getByRole('textbox', { name: 'Editor de código' });
  await editor.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('print("Meu diário de saúde")');

  const executeButton = page.getByRole('button', { name: 'Executar' });
  await expect(executeButton).toBeEnabled({ timeout: 90_000 });
  await executeButton.click();
  await expect(page.getByText('Meu diário de saúde', { exact: true })).toBeVisible({ timeout: 15_000 });

  const verifyButton = page.getByRole('button', { name: 'Verificar' });
  await expect(verifyButton).toBeEnabled();
  await verifyButton.click();
  await expect(page.getByText('Concluído')).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

  await page.reload();

  // Depois do reload: código, conclusão e progresso continuam preservados.
  // stdout/feedback da última execução voltam vazios de propósito (não são
  // persistidos) — não são verificados aqui.
  await expect(editor).toBeVisible();
  await expect(page.getByText('"Meu diário de saúde"', { exact: true })).toBeVisible();
  await expect(page.getByText('Concluído')).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
});
