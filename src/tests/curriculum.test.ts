import { describe, it, expect } from "vitest";
import { courseSchema, trackSchema, unitSchema } from "../schemas/curriculum";

describe("Schemas de Currículo (Zod)", () => {
  describe("courseSchema", () => {
    it("deve aceitar um objeto de curso válido", () => {
      const validCourse = {
        id: "python-iniciante",
        title: "Python para iniciantes",
        version: "0.1.0",
        tracks: ["fundamentos-interacao"],
      };

      const result = courseSchema.safeParse(validCourse);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar curso sem os campos obrigatórios", () => {
      const invalidCourse = {
        id: "python-iniciante",
      };

      const result = courseSchema.safeParse(invalidCourse);
      expect(result.success).toBe(false);
    });
  });

  describe("trackSchema", () => {
    it("deve aceitar uma trilha válida", () => {
      const validTrack = {
        id: "fundamentos-interacao",
        courseId: "python-iniciante",
        title: "Fundamentos de interação",
        order: 1,
        units: ["1.1-print"],
      };

      const result = trackSchema.safeParse(validTrack);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar trilha com order inválido", () => {
      const invalidTrack = {
        id: "fundamentos-interacao",
        courseId: "python-iniciante",
        title: "Fundamentos de interação",
        order: -1, // Deve ser positivo
        units: ["1.1-print"],
      };

      const result = trackSchema.safeParse(invalidTrack);
      expect(result.success).toBe(false);
    });
  });

  describe("unitSchema", () => {
    it("deve aceitar uma unidade pedagógica completa e válida", () => {
      const validUnit = {
        id: "1.1-print",
        courseId: "python-iniciante",
        trackId: "fundamentos-interacao",
        title: "Exibindo mensagens com print()",
        order: 1,
        objectives: ["Exibir uma mensagem no painel de saída"],
        essential: {
          purpose: "Apresentar a saída básica de programas.",
          behavior: "Chamar print() exibe um texto no console.",
          example: "print('Olá')",
          application: "print('Meu diário de saúde')",
        },
        deepDive: {
          enabled: true,
          origin: "Origem do output...",
          evolution: "Python 2 vs Python 3...",
          internalBehavior: "Uso do stdout...",
          comparisons: "JS console.log vs Java...",
          goodPractices: "Mensagens claras...",
          curiosities: "História...",
          extraChallenge: "Exibir em duas linhas...",
        },
        activity: {
          type: "code",
          config: {
            language: "python",
            starterCode: "# Escreva seu código abaixo",
            expectedOutput: "Meu diário de saúde",
            timeoutMs: 3000,
            maxOutputCharacters: 5000,
          },
        },
        hints: [
          "Use uma função que exibe informações.",
          "A função se chama print.",
          "A mensagem deve ficar entre aspas.",
          "A mensagem e as aspas ficam dentro dos parênteses.",
          "Estrutura: print(\"mensagem\")",
        ],
      };

      const result = unitSchema.safeParse(validUnit);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar unidade com tipo de atividade inexistente ou incorreto", () => {
      const invalidUnit = {
        id: "1.1-print",
        courseId: "python-iniciante",
        trackId: "fundamentos-interacao",
        title: "Exibindo mensagens com print()",
        order: 1,
        objectives: ["Exibir uma mensagem"],
        essential: {
          purpose: "Apresentar a saída básica.",
          behavior: "Chamar print() exibe um texto.",
          example: "print('Olá')",
          application: "print('Meu diário de saúde')",
        },
        deepDive: {
          enabled: false,
          origin: "",
          evolution: "",
          internalBehavior: "",
          comparisons: "",
          goodPractices: "",
          curiosities: "",
          extraChallenge: "",
        },
        activity: {
          type: "multiple_choice_invalid", // Inexistente
          config: {
            language: "python",
            starterCode: "",
            expectedOutput: "",
            timeoutMs: 3000,
            maxOutputCharacters: 5000,
          },
        },
        hints: [],
      };

      const result = unitSchema.safeParse(invalidUnit);
      expect(result.success).toBe(false);
    });
  });
});
