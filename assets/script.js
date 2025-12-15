// Selección de elementos del DOM
const form = document.getElementById('miFormulario');
const submitBtn = document.getElementById('submitBtn');
const loadingContainer = document.getElementById('loadingContainer');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');
const emailInput = document.getElementById('email');

// Evento principal
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Preparar la Interfaz (UI)
    submitBtn.style.display = 'none';       // Ocultar botón
    loadingContainer.style.display = 'block'; // Mostrar barra

    // 2. Iniciar animación de la barra (con pequeño retraso para renderizado)
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 50);

    // 3. Esperar 4 segundos antes de ejecutar el fetch
    setTimeout(() => {
        enviarDatosAPI();
    }, 4000);
});

// Función asíncrona para enviar los datos usando FETCH
async function enviarDatosAPI() {
    const email = emailInput.value;
    // Tu URL de n8n
    const url = "https://n8n-n8n.ppdj7d.easypanel.host/webhook-test/6cad4f16-d4a9-4b0c-8067-79b5443c19a3";

    // Actualizamos texto
    loadingText.textContent = "Enviando solicitud...";

    try {
        // Ejecutamos la petición fetch
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                timestamp: new Date().toISOString()
            })
        });

        // Verificamos si la respuesta fue exitosa (Códigos 200-299)
        if (response.ok) {
            loadingText.textContent = "¡Demo activada con éxito!";
            loadingText.style.color = "#4CAF50"; // Verde
            console.log("Éxito al enviar datos");
            
            // Opcional: Redirigir o limpiar formulario después de un momento
            // form.reset();
        } else {
            // Si el servidor responde con error (ej. 404 o 500)
            throw new Error(`Error del servidor: ${response.status}`);
        }

    } catch (error) {
        // Capturamos errores de red o CORS
        console.error("Hubo un problema:", error);
        loadingText.textContent = "Error al conectar. Revisa la consola.";
        loadingText.style.color = "#F44336"; // Rojo
        
        // Mensaje específico para n8n si es 404 (común en pruebas)
        if (error.message.includes('404')) {
            alert("Error 404: Asegúrate de presionar 'Execute Workflow' en n8n antes de enviar.");
        }
    }
}
