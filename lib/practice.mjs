// An offline, session-only Daily Aim practice model. No external I/O.
export const FORMAT = 'daily-aim-practice-v1';
const MAX_TEXT = 2000;
const ALLOWED = new Set(['planned', 'done', 'partly', 'not-done']);

export function clean(value) {
  return String(value ?? '').replace(/\r\n?/g, '\n').trim().slice(0, MAX_TEXT);
}
export function initialState() {
  return { format: FORMAT, aim: '', reason: '', nextMove: '', result: 'planned', evidence: '' };
}
export function validate(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const required = ['format','aim','reason','nextMove','result','evidence'];
  if (Object.keys(value).sort().join(',') !== required.sort().join(',')) return false;
  if (value.format !== FORMAT || !ALLOWED.has(value.result)) return false;
  return ['aim','reason','nextMove','evidence'].every(k =>
    typeof value[k] === 'string' && value[k].length <= MAX_TEXT && !value[k].includes('\0'));
}
export function update(current, changes) {
  if (!validate(current)) throw new TypeError('Invalid current practice');
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) throw new TypeError('Invalid changes');
  const next = { ...current };
  for (const [key, value] of Object.entries(changes)) {
    if (key === 'result') {
      if (!ALLOWED.has(value)) throw new TypeError('Unknown outcome');
      next.result = value;
    } else if (['aim', 'reason', 'nextMove', 'evidence'].includes(key)) {
      next[key] = clean(value);
    } else throw new TypeError('Unexpected practice field');
  }
  if (!validate(next)) throw new TypeError('Invalid result');
  return next;
}
export function progress(state) {
  if (!validate(state)) throw new TypeError('Invalid practice');
  if (!state.aim) return { step: 1, message: 'Name one meaningful aim.' };
  if (!state.nextMove) return { step: 2, message: 'Choose one next move.' };
  if (state.result === 'planned') return { step: 3, message: 'Act, then record what happened.' };
  if (!state.evidence) return { step: 4, message: 'Record evidence or a concrete observation.' };
  return { step: 5, message: 'Review what changed and decide your next move.' };
}
export function importPractice(jsonText) {
  if (typeof jsonText !== 'string' || jsonText.length > 14000) throw new Error('Import exceeds safe size');
  let object;
  try { object = JSON.parse(jsonText); } catch { throw new Error('Not valid JSON'); }
  if (!validate(object)) throw new Error('Practice format or fields are invalid');
  return { ...object };
}
export function toMarkdown(state) {
  if (!validate(state)) throw new TypeError('Invalid practice');
  const safe = v => (v || 'Not recorded').replace(/^/gm, '> ');
  return `# Daily Aim — Practice Receipt\n\n## Aim\n${safe(state.aim)}\n\n## Why it matters\n${safe(state.reason)}\n\n## Next move\n${safe(state.nextMove)}\n\n## Result\n${safe(state.result)}\n\n## Observation / Evidence\n${safe(state.evidence)}\n\nSelf-reported practice record; not independent proof.\n`;
}
