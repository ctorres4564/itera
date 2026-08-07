import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PythonWorkerClient, type RunConfig } from "../activities/code/worker/workerClient";
import { CodeActivityEngine } from "../activities/code/engine/CodeActivityEngine";
import { installMockWorker, latestWorker } from "./testUtils/mockWorker";

const DEFAULT_CONFIG: RunConfig = { timeoutMs: 3000, maxOutputCharacters: 5000 };

beforeEach(() => {
  installMockWorker();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("PythonWorkerClient - protocolo Worker/motor (Worker mockado)", () => {
  it("resolve com stdout quando o código roda com sucesso", async () => {
    const client = new PythonWorkerClient();
    const worker = latestWorker();
    worker.emit({ type: "ready" });

    const promise = client.run("print('ola')", DEFAULT_CONFIG);
    const request = worker.posted[0];
    worker.emit({
      type: "result",
      requestId: request.requestId,
      result: { status: "success", message: "Execução concluída.", output: "ola\n" },
    });

    const result = await promise;
    expect(result.status).toBe("success");
    expect(result.output).toBe("ola\n");
  });

  it("resolve com no_output quando não há saída", async () => {
    const client = new PythonWorkerClient();
    const worker = latestWorker();
    worker.emit({ type: "ready" });

    const promise = client.run("x = 1", DEFAULT_CONFIG);
    const request = worker.posted[0];
    worker.emit({
      type: "result",
      requestId: request.requestId,
      result: { status: "no_output", message: "O código não produziu nenhuma saída.", output: "" },
    });

    expect((await promise).status).toBe("no_output");
  });

  it("resolve com syntax_error para código com erro de sintaxe", async () => {
    const client = new PythonWorkerClient();
    const worker = latestWorker();
    worker.emit({ type: "ready" });

    const promise = client.run("print(", DEFAULT_CONFIG);
    const request = worker.posted[0];
    worker.emit({
      type: "result",
      requestId: request.requestId,
      result: { status: "syntax_error", message: "SyntaxError", output: "" },
    });

    expect((await promise).status).toBe("syntax_error");
  });

  it("resolve com runtime_error para exceção em tempo de execução", async () => {
    const client = new PythonWorkerClient();
    const worker = latestWorker();
    worker.emit({ type: "ready" });

    const promise = client.run("1 / 0", DEFAULT_CONFIG);
    const request = worker.posted[0];
    worker.emit({
      type: "result",
      requestId: request.requestId,
      result: { status: "runtime_error", message: "ZeroDivisionError", output: "" },
    });

    expect((await promise).status).toBe("runtime_error");
  });

  it("resolve com output_limit quando o worker sinaliza saída excessiva", async () => {
    const client = new PythonWorkerClient();
    const worker = latestWorker();
    worker.emit({ type: "ready" });

    const promise = client.run("while True: print('x' * 100)", DEFAULT_CONFIG);
    const request = worker.posted[0];
    worker.emit({
      type: "result",
      requestId: request.requestId,
      result: {
        status: "output_limit",
        message: "A saída excedeu o limite de 5000 caracteres.",
        output: "x".repeat(5000),
      },
    });

    const result = await promise;
    expect(result.status).toBe("output_limit");
    expect(result.output).toHaveLength(5000);
  });

  it("recusa execuções concorrentes sem tocar a execução em andamento", async () => {
    const client = new PythonWorkerClient();
    const worker = latestWorker();
    worker.emit({ type: "ready" });

    const first = client.run("print('a')", DEFAULT_CONFIG);
    const second = client.run("print('b')", DEFAULT_CONFIG);

    const secondResult = await second;
    expect(secondResult.status).toBe("internal_error");
    expect(worker.posted).toHaveLength(1);

    worker.emit({
      type: "result",
      requestId: worker.posted[0].requestId,
      result: { status: "success", message: "ok", output: "a" },
    });
    expect((await first).status).toBe("success");
  });

  it("timeout encerra o worker, recria um novo e volta a ready", async () => {
    vi.useFakeTimers();
    const client = new PythonWorkerClient();
    const firstWorker = latestWorker();
    firstWorker.emit({ type: "ready" });
    expect(client.getStatus()).toBe("ready");

    const promise = client.run("while True: pass", { timeoutMs: 1000, maxOutputCharacters: 5000 });
    vi.advanceTimersByTime(1000);

    const result = await promise;
    expect(result.status).toBe("timeout");
    expect(firstWorker.terminated).toBe(true);

    const secondWorker = latestWorker();
    expect(secondWorker).not.toBe(firstWorker);
    expect(client.getStatus()).toBe("loading");

    secondWorker.emit({ type: "ready" });
    expect(client.getStatus()).toBe("ready");
  });

  it("ignora resultado tardio de um worker antigo após timeout (requestId obsoleto)", async () => {
    vi.useFakeTimers();
    const client = new PythonWorkerClient();
    const oldWorker = latestWorker();
    oldWorker.emit({ type: "ready" });

    const timedOut = client.run("while True: pass", { timeoutMs: 1000, maxOutputCharacters: 5000 });
    const staleRequestId = oldWorker.posted[0].requestId;
    vi.advanceTimersByTime(1000);
    expect((await timedOut).status).toBe("timeout");

    const newWorker = latestWorker();
    newWorker.emit({ type: "ready" });

    const nextRun = client.run("print('ok')", { timeoutMs: 1000, maxOutputCharacters: 5000 });
    const currentRequestId = newWorker.posted[0].requestId;

    // Mensagem tardia do worker antigo (já terminado) não deve afetar a execução atual.
    oldWorker.emit({
      type: "result",
      requestId: staleRequestId,
      result: { status: "success", message: "stale", output: "stale" },
    });

    newWorker.emit({
      type: "result",
      requestId: currentRequestId,
      result: { status: "success", message: "ok", output: "ok" },
    });

    const result = await nextRun;
    expect(result.status).toBe("success");
    expect(result.output).toBe("ok");
  });

  it("recupera de falha interna do worker (onerror) e recria o worker", async () => {
    const client = new PythonWorkerClient();
    const worker = latestWorker();
    worker.emit({ type: "ready" });

    const promise = client.run("print(1)", DEFAULT_CONFIG);
    worker.emitError();

    const result = await promise;
    expect(result.status).toBe("internal_error");
    expect(worker.terminated).toBe(true);
    expect(latestWorker()).not.toBe(worker);
  });

  it("marca status como error após load_error e recusa execução", async () => {
    const client = new PythonWorkerClient();
    const worker = latestWorker();
    worker.emit({ type: "load_error", message: "Falha ao carregar Pyodide." });

    expect(client.getStatus()).toBe("error");
    const result = await client.run("print(1)", DEFAULT_CONFIG);
    expect(result.status).toBe("internal_error");
    expect(worker.posted).toHaveLength(0);
  });

  it("recusa execução antes do motor ficar pronto", async () => {
    const client = new PythonWorkerClient();
    const worker = latestWorker();

    const result = await client.run("print(1)", DEFAULT_CONFIG);
    expect(result.status).toBe("internal_error");
    expect(worker.posted).toHaveLength(0);
  });
});

describe("CodeActivityEngine - wrapper fino sobre o worker client", () => {
  it("delega execute() ao worker client e reflete o status do motor", async () => {
    const statuses: string[] = [];
    const engine = new CodeActivityEngine((status) => statuses.push(status));
    const worker = latestWorker();
    worker.emit({ type: "ready" });

    expect(engine.getStatus()).toBe("ready");
    expect(statuses).toContain("ready");

    const promise = engine.execute("print('oi')", DEFAULT_CONFIG);
    worker.emit({
      type: "result",
      requestId: worker.posted[0].requestId,
      result: { status: "success", message: "ok", output: "oi\n" },
    });

    expect((await promise).output).toBe("oi\n");
  });
});
