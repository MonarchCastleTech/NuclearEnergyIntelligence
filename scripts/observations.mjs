export function latestObservations(lines, parseCsvLine) {
  const latest = new Map();
  for (const line of lines.slice(1)) {
    const [entity, , yearText, valueText] = parseCsvLine(line);
    if (!entity || !yearText?.trim() || !valueText?.trim()) continue;
    const year = Number(yearText);
    const value = Number(valueText);
    if (!Number.isInteger(year) || year < 1900 || !Number.isFinite(value) || value < 0 || value > 100) continue;
    const previous = latest.get(entity);
    if (!previous || year > previous.year) latest.set(entity, { year, value });
  }
  return latest;
}

export function validateCoverage(matches, expected, dataThroughYear, currentYear = new Date().getUTCFullYear()) {
  if (expected === 0 || matches !== expected || dataThroughYear < currentYear - 3 || dataThroughYear > currentYear) {
    throw new Error(`source validation failed (${matches}/${expected} matches; latest year ${dataThroughYear})`);
  }
}
