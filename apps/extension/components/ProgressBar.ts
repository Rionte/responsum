export function renderProgressBar(done: number, total: number): string {
  if (!total) return "";
  const pct = Math.round((done / total) * 100);
  return `<div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
    <div class="track"><div class="bar" style="width:${pct}%"></div></div>
    <span>${done}/${total} done (${pct}%)</span>
  </div>`;
}
