(function () {
  const duration = 226;
  const toggle = document.querySelector('#audioToggle');
  const progress = document.querySelector('#audioProgress');
  const fill = document.querySelector('#audioProgressFill');
  const currentLabel = document.querySelector('#audioCurrent');
  let current = 0;
  let playing = false;
  let lastTick = 0;
  let frame = 0;

  function formatTime(value) {
    const seconds = Math.max(0, Math.min(duration, Math.floor(value)));
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function render() {
    currentLabel.textContent = formatTime(current);
    fill.style.width = `${(current / duration) * 100}%`;
  }

  function tick(now) {
    if (!playing) return;
    if (lastTick) current += (now - lastTick) / 1000;
    lastTick = now;
    if (current >= duration) {
      current = duration;
      playing = false;
      toggle.textContent = '▶';
      toggle.setAttribute('aria-label', '播放录音');
      render();
      return;
    }
    render();
    frame = requestAnimationFrame(tick);
  }

  toggle.addEventListener('click', function () {
    if (current >= duration) current = 0;
    playing = !playing;
    toggle.textContent = playing ? 'Ⅱ' : '▶';
    toggle.setAttribute('aria-label', playing ? '暂停录音' : '播放录音');
    lastTick = 0;
    cancelAnimationFrame(frame);
    if (playing) frame = requestAnimationFrame(tick);
    render();
  });

  progress.addEventListener('click', function (event) {
    const rect = progress.getBoundingClientRect();
    current = Math.max(0, Math.min(duration, ((event.clientX - rect.left) / rect.width) * duration));
    lastTick = 0;
    render();
  });

  render();
})();
