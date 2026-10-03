import { describe, expect, it } from "vitest";
import { getDocumentStatus } from "./document-status";

const today = new Date("2026-10-03T12:00:00");

describe("getDocumentStatus", () => {
  it("retorna expirado quando a data já passou", () => {
    expect(getDocumentStatus("2026-10-02", today)).toBe("expirado");
  });

  it("retorna próximo do vencimento no próprio dia do vencimento", () => {
    expect(getDocumentStatus("2026-10-03", today)).toBe("proximo_vencimento");
  });

  it("retorna próximo do vencimento com exatamente 15 dias", () => {
    expect(getDocumentStatus("2026-10-18", today)).toBe("proximo_vencimento");
  });

  it("retorna válido com 16 dias ou mais", () => {
    expect(getDocumentStatus("2026-10-19", today)).toBe("valido");
  });
});