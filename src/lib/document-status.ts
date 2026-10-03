import { differenceInCalendarDays, parseISO } from "date-fns";
import type { DocumentStatus } from "@/types";

export const EXPIRING_THRESHOLD_DAYS = 15;

export function getDocumentStatus(
  expiresAt: string,
  today: Date = new Date()
): DocumentStatus {
  const days = differenceInCalendarDays(parseISO(expiresAt), today);
  if (days < 0) return "expirado";
  if (days <= EXPIRING_THRESHOLD_DAYS) return "proximo_vencimento";
  return "valido";
}