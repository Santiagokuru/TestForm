const form = document.getElementById('miFormulario');
const submitBtn = document.getElementById('submitBtn');
const loadingContainer = document.getElementById('loadingContainer');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');
const emailInput = document.getElementById('email');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Preparar UI
    submitBtn.style.display = 'none';
    loadingContainer.style.display = 'block';

    // 2. Iniciar animación
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 50);

    // 3. Esperar 4 segundos antes de enviar
    setTimeout(() => {
        enviarDatosAjax();
    }, 4000);
});

function enviarDatosAjax() {
    const email = emailInput.value;
    // Tu URL de n8n
    const url = "https://n8n-n8n.ppdj7d.easypanel.host/webhook-test/6cad4f16-d4a9-4b0c-8067-79b5443c19a3";

    loadingText.textContent = "Enviando datos a n8n...";

    const data = {
        email: email,
        fecha: new Date().toISOString() // Enviamos fecha para verificar recepción
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Accept': 'application/json' // Opcional, buena práctica
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("Status Code:", response.status); // Ver código en consola (200, 404, 500)

        if (response.ok) {
            loadingText.textContent = "¡Demo activada correctamente!";
            loadingText.style.color = "green";
            // Opcional: Limpiar formulario
            emailInput.value = "";
            return response.text(); // O response.json() si n8n devuelve JSON
        } else {
            // Si llega aquí, n8n respondió pero con error (ej. 404 no encontrado)
            loadingText.textContent = "Error: n8n no está escuchando (404) o falló.";
            loadingText.style.color = "red";
            console.error("Error del servidor:", response.statusText);
            
            if(response.status === 404) {
                alert("ERROR 404: Como es una URL de prueba (.../webhook-test/...), asegúrate de presionar el botón 'Execute Workflow' en n8n antes de enviar el formulario.");
            }
        }
    })
    .catch(error => {
        // Errores de red o CORS
        console.error('Error de Fetch:', error);
        loadingText.textContent = "Error de conexión (Posible bloqueo CORS). Revisa la consola.";
        loadingText.style.color = "red";
    });
}