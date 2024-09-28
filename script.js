document.addEventListener('DOMContentLoaded', function() {
    // Existing code for prediction form and gauge
    const form = document.getElementById('prediction-form');
    const resultDiv = document.getElementById('result');
    const scoreSpan = document.getElementById('score');
    const evDensitySlider = document.getElementById('ev_density');
    const evDensityValue = document.getElementById('ev_density_value');
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

    // Update slider value
    evDensitySlider.addEventListener('input', function() {
        evDensityValue.textContent = evDensitySlider.value + '%';
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);  // Automatically gathers all inputs

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

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const contactData = new FormData(contactForm);
            
            fetch('submit_contact.php', {
                method: 'POST',
                body: contactData
            })
            .then(response => response.text())
            .then(message => {
                alert(message); // Show confirmation message
                contactForm.reset(); // Reset the form after submission
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while sending your message.');
            });
        });
    }

    // Input animations for prediction form
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
