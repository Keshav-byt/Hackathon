document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prediction-form');
    const resultDiv = document.getElementById('result');
    const scoreSpan = document.getElementById('score');
    let gauge;

    // Initialize gauge
    function initGauge() {
        const opts = {
            angle: 0.15,
            lineWidth: 0.44,
            radiusScale: 1,
            pointer: {
                length: 0.6,
                strokeWidth: 0.035,
                color: '#000000'
            },
            limitMax: false,
            limitMin: false,
            colorStart: '#6FADCF',
            colorStop: '#8FC0DA',
            strokeColor: '#E0E0E0',
            generateGradient: true,
            highDpiSupport: true,
        };
        const target = document.getElementById('gauge');
        gauge = new Gauge(target).setOptions(opts);
        gauge.maxValue = 100;
        gauge.setMinValue(0);
        gauge.animationSpeed = 32;
        gauge.set(0);
    }

    initGauge();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('population_density', document.getElementById('population_density').value);
        formData.append('traffic_flow', document.getElementById('traffic_flow').value);
        formData.append('existing_stations', document.getElementById('existing_stations').value);
        formData.append('ev_density', document.getElementById('ev_density').value);

        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            scoreSpan.textContent = data.prediction;
            gauge.set(data.prediction);
            resultDiv.classList.remove('hidden');
            resultDiv.classList.add('fade-in');
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p class="error">An error occurred while making the prediction.</p>';
            resultDiv.classList.remove('hidden');
            resultDiv.classList.add('fade-in');
        });
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('population_density', document.getElementById('population_density').value);
        formData.append('traffic_flow', document.getElementById('traffic_flow').value);  // Now a dropdown value
        formData.append('remaining_power', document.getElementById('remaining_power').value);
        formData.append('ev_density', document.getElementById('ev_density').value);
    
        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            scoreSpan.textContent = data.prediction;
            gauge.set(data.prediction);
            resultDiv.classList.remove('hidden');
            resultDiv.classList.add('fade-in');
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p class="error">An error occurred while making the prediction.</p>';
            resultDiv.classList.remove('hidden');
            resultDiv.classList.add('fade-in');
        });
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('seater', document.getElementById('seater').value);  // Use seater instead of population_density
        formData.append('traffic_flow', document.getElementById('traffic_flow').value);
        formData.append('remaining_power', document.getElementById('remaining_power').value);
        formData.append('ev_density', document.getElementById('ev_density').value);
    
        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            scoreSpan.textContent = data.prediction;
            gauge.set(data.prediction);
            resultDiv.classList.remove('hidden');
            resultDiv.classList.add('fade-in');
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p class="error">An error occurred while making the prediction.</p>';
            resultDiv.classList.remove('hidden');
            resultDiv.classList.add('fade-in');
        });
    });
    
    
    // Add input animations
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});