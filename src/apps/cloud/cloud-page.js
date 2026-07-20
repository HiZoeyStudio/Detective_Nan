function updateCloudClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  document.querySelector('#cloudClock').textContent = `${time}\n${date}`;
}

updateCloudClock();
setInterval(updateCloudClock, 1000);
