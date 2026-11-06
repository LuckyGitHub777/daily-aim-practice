import {initialState, update, progress, importPractice, toMarkdown} from './lib/practice.mjs';
const q = id => document.getElementById(id);
let state = initialState();
const names = ['aim','reason','nextMove','evidence'];
function render() {
  for (const key of names) q(key).value = state[key];
  q('result').value = state.result;
  const step = progress(state);
  q('step').textContent = `Step ${step.step} of 5`;
  q('guidance').textContent = step.message;
}
function sync() {
  state = update(state, Object.fromEntries([...names.map(key => [key,q(key).value]),['result',q('result').value]]));
  const step = progress(state);
  q('step').textContent = `Step ${step.step} of 5`;
  q('guidance').textContent = step.message;
  q('notice').textContent = 'Unsaved in this tab — export to keep your work.';
}
function download(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content],{type}));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
q('practice-form').addEventListener('submit',event=>event.preventDefault());
for (const key of names) q(key).addEventListener('input',sync);
q('result').addEventListener('change',sync);
q('export-json').addEventListener('click',() => {
  sync(); download(JSON.stringify(state,null,2)+'\n','daily-aim.json','application/json');
  q('notice').textContent = 'JSON export prepared. Confirm the file was saved.';
});
q('export-md').addEventListener('click',() => {
  sync(); download(toMarkdown(state),'daily-aim.md','text/markdown');
  q('notice').textContent = 'Markdown export prepared. Confirm the file was saved.';
});
q('import-json').addEventListener('change', async event => {
  const file = event.target.files?.[0]; event.target.value = '';
  if (!file) return;
  if (file.size > 14000) { q('notice').textContent='Import rejected: file too large.'; return; }
  try { state=importPractice(await file.text()); render(); q('notice').textContent='Imported in this tab. Export to keep changes.'; }
  catch { q('notice').textContent='Import rejected: invalid practice file.'; }
});
q('clear').addEventListener('click',() => {
  if (!confirm('Clear this tab’s unsaved practice? Export first if you want to keep it.')) return;
  state=initialState(); render(); q('notice').textContent='Cleared. No browser copy was stored.';
});
render();
