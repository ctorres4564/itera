import { describe, expect, it } from "vitest";
import tailwindConfig from "../../tailwind.config.js";

// Testa o contrato do Design System (docs/design-system.md), não classes CSS
// específicas em componentes — garante que os tokens essenciais continuam
// definidos centralmente, sem depender de nenhum uso pontual.
describe("Design System — tokens essenciais", () => {
  const colors = (tailwindConfig.theme?.extend?.colors ?? {}) as Record<string, string>;

  const essentialTokens = [
    "brand-primary",
    "brand-primary-hover",
    "brand-secondary",
    "accent",
    "background",
    "surface",
    "surface-elevated",
    "surface-muted",
    "text-primary",
    "text-secondary",
    "text-muted",
    "text-inverse",
    "border-default",
    "border-strong",
    "success",
    "success-surface",
    "warning",
    "warning-surface",
    "error",
    "error-surface",
    "info",
    "focus",
  ];

  it.each(essentialTokens)("define o token de cor '%s'", (token) => {
    expect(colors[token]).toBeTruthy();
  });

  it("define uma sombra semântica para modais", () => {
    const shadows = (tailwindConfig.theme?.extend?.boxShadow ?? {}) as Record<string, string>;
    expect(shadows.modal).toBeTruthy();
  });
});
