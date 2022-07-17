
function maroul_per_koin(kpm) {
    if(isNaN(kpm)) {
        kpm = Koinz.koinz_per_maroul;
    }
    return (1 / kpm);
}

function range(start, end) {
    var arr = [];
    for(var i = start; i <= end; i++) {
        arr.push(i.toString());
    }
    return arr;
}

function create_chart() {
    // Chart the recent history of the maroul per koinz
    var ctx = document.getElementById('myChart').getContext('2d');
    globalThis.chart = new Chart(ctx, {
        type: 'line',
        animations: {
            duration: 0
        },
        data: {
            labels: [
                "-4:30",
                "-4:00",
                "-3:30",
                "-3:00",
                "-2:30",
                "-2:00",
                "-1:30",
                "-1:00",
                "-0:30",
                "LIVE",
            ],
            datasets: [{
                label: 'Maroul per Koin',
                data: Koinz.kpm_hist.map((x) => maroul_per_koin(x)).slice(-10),
                // We want a light blue color
                backgroundColor: 'rgba(0, 189, 214, 0.2)',
                borderColor: 'rgba(0, 189, 214, 1)',
                borderWidth: 2,
                tension: 0.4,
                cubicInterpolationMode: 'monotone',
            }]
        },
        options: {
            scales: {
                    y: {
                        // beginAtZero: true
                    }
                }
            }
        }
    );
}

function update_chart() {
    // If the chart is not yet created, create it
    if(!globalThis.chart) {
        create_chart();
    }
    // Update the chart's data
    globalThis.chart.data.datasets[0].data = Koinz.kpm_hist.map((x) => maroul_per_koin(x)).slice(-10);
    // Update the chart
    globalThis.chart.update();
}