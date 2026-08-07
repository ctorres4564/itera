// Normaliza saída para comparação pedagógica sem esconder erros reais:
// unifica quebras de linha, remove espaços/tabs finais de cada linha e
// linhas vazias no final. Não mexe em espaços internos nem no conteúdo.
export function normalizeOutput(value: string): string {
  const lines = value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""));

  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  return lines.join("\n");
}
