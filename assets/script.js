// Selección de elementos del DOM
const form = document.getElementById('miFormulario');
const submitBtn = document.getElementById('submitBtn');
const loadingContainer = document.getElementById('loadingContainer');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');
const emailInput = document.getElementById('email');

// Evento principal del formulario
form.addEventListener('submit', function(e) {
    e.preventDefault(); // 1. Evitar recarga

    // 2. UI: Ocultar botón y mostrar barra
    submitBtn.style.display = 'none';
    loadingContainer.style.display = 'block';

    // 3. Animación de barra
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 50);

    // 4. Esperar 4 segundos antes de enviar el JSON
    setTimeout(() => {
        enviarDatosAPI();
    }, 4000);
});

// Función asíncrona para enviar JSON con Fetch
async function enviarDatosAPI() {
    const email = emailInput.value;
    const url = "https://n8n-n8n.ppdj7d.easypanel.host/webhook-test/6cad4f16-d4a9-4b0c-8067-79b5443c19a3";

    // 5. Crear el objeto con los datos
    const datosParaEnviar = {
        email: email
        // Si quieres agregar más datos en el futuro, hazlo aquí:
        // nombre: "Juan",
        // fecha: new Date().toISOString()
    };

    loadingText.textContent = "Enviando JSON...";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // ESTO ES VITAL: Define que el cuerpo es JSON
                'Content-Type': 'application/json'
            },
            // ESTO ES VITAL: Transforma el objeto JS a String JSON
            body: JSON.stringify(datosParaEnviar)
        });

        // Verificamos respuesta
        if (response.ok) {
            loadingText.textContent = "¡Demo activada con éxito!";
             loadingText.style.color = "#28a745"; // Color verde
            console.log("Datos enviados. Iniciando cuenta regresiva para redirección.");
            
            setTimeout(() => {
                // 3. Redirigir a page
                window.location.href = "https://es.wikipedia.org/wiki/Wikipedia:Portada";
            }, 1500);
            
        } else {
            throw new Error(`Error status: ${response.status}`);
        }

    } catch (error) {
        console.error("Error al enviar:", error);
        loadingText.textContent = "Error de conexión. Revisa la consola.";
        loadingText.style.color = "red";
        
        if (error.message.includes('404')) {
            alert("Recuerda activar el botón 'Execute Workflow' en n8n.");
        }
    }
}
