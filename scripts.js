// script.js




document.addEventListener('DOMContentLoaded', function() {
    const sosButton = document.getElementById('sosButton');
    let clickCount = 0;
    let clickTimer = null;

    sosButton.addEventListener('click', () => {
        clickCount++;
        
        if (clickTimer === null) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
                clickTimer = null;
            }, 300);
        }

        if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            clickTimer = null;
            
            // Trigger emergency call
            if (confirm('Are you sure you want to make an emergency call?')) {
                window.location.href = 'tel:911';
            }
        }
    });

    document.getElementById('mobile-menu-button').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        this.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
    });
});

// Open the modal when the "Fill Details Manually" button is clicked
document.getElementById('fillDetailsButton').addEventListener('click', function() {
    document.getElementById('manualDetailsModal').classList.remove('hidden');
});

// Close the modal when the "Close" button is clicked
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('manualDetailsModal').classList.add('hidden');
});

// Handle form submission
document.getElementById('incidentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const numPatients = document.getElementById('numPatients').value;
    const severity = document.getElementById('severity').value;
    const description = document.getElementById('description').value;

    // Prepare data to send
    const data = {
        numPatients: numPatients,
        severity: severity,
        description: description,
        timestamp: new Date().toISOString()
    };

    // Send data to the server
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            alert('Incident reported successfully!');
            document.getElementById('manualDetailsModal').classList.add('hidden');
            document.getElementById('incidentForm').reset();
        } else {
            alert('Error reporting incident.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error reporting incident.');
    });
});