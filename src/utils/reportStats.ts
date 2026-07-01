import { AnimalReport, ReportStatus } from '../models';

export interface ReportStats {
  total: number;
  lost: number;
  found: number;
  newestDate: string | null;
  mostCommonType: string | null;
}

/** Derives simple aggregate stats from the loaded reports (no hardcoded values). */
export function computeReportStats(reports: AnimalReport[]): ReportStats {
  const total = reports.length;
  let lost = 0;
  let found = 0;
  let newestDate: string | null = null;
  const typeCounts: Record<string, number> = {};

  for (const report of reports) {
    if (report.status === ReportStatus.Lost) lost += 1;
    if (report.status === ReportStatus.Found) found += 1;

    if (!newestDate || new Date(report.datePosted).getTime() > new Date(newestDate).getTime()) {
      newestDate = report.datePosted;
    }

    typeCounts[report.animalType] = (typeCounts[report.animalType] ?? 0) + 1;
  }

  let mostCommonType: string | null = null;
  let bestCount = 0;
  for (const [type, count] of Object.entries(typeCounts)) {
    if (count > bestCount) {
      bestCount = count;
      mostCommonType = type;
    }
  }

  return { total, lost, found, newestDate, mostCommonType };
}
