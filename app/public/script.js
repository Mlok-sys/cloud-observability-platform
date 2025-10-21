document.getElementById('simulate').addEventListener('click', () => {
    fetch('/fail').then(r => r.text()).then(alert);
});

async function updateStats() {
    try {
        const res = await fetch('/metrics');
        const text = await res.text();

        const requests = text.match(/http_requests_total[^0-9]*(\d+)/);
        document.getElementById('requests').innerText = requests ? requests[1] : '0';

        const uptime = (process.uptime ? process.uptime() : 'N/A');
        document.getElementById('uptime').innerText = uptime;

    } catch {
        document.getElementById('requests').innerText = 'Error';
    }
}

setInterval(updateStats, 5000);
updateStats();
