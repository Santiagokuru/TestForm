const form = document.getElementById('miFormulario');
const submitBtn = document.getElementById('submitBtn');
const loadingContainer = document.getElementById('loadingContainer');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');
const emailInput = document.getElementById('email');

// Evento principal
form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    // 1. UI: Ocultar botón y mostrar barra
    submitBtn.style.display = 'none';
    loadingContainer.style.display = 'block';

    // 2. Animación de barra
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 50);

    // 3. Esperar 4 segundos antes de enviar el JSON
    setTimeout(() => {
        enviarDatosAPI();
    }, 4000);
});

// Función asíncrona para enviar datos y redirigir con el email
async function enviarDatosAPI() {
    const email = emailInput.value;
    const url = "https://n8n-n8n.ppdj7d.easypanel.host/webhook-test/6cad4f16-d4a9-4b0c-8067-79b5443c19a3";

    loadingText.textContent = "Enviando datos...";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            loadingText.textContent = "¡Demo activada! Redirigiendo...";
            loadingText.style.color = "#28a745"; // Verde
            console.log("Datos enviados correctamente.");

            // Esperamos 1.5 segundos para que el usuario lea el mensaje
            setTimeout(() => {
                
                // --- LÓGICA DE REDIRECCIÓN CON EMAIL ---
                
                // 1. Codificamos el email para proteger símbolos como '+' o '@'
                //    Ejemplo: 'juan+test@gmail.com' se convierte en 'juan%2Btest%40gmail.com'
                const emailCodificado = encodeURIComponent(email);
                
                // 2. Construimos la URL agregando el parámetro ?email=
                //    Nota: Depende de la página destino leer este parámetro 'email'.
                //    Si usan otro nombre (como 'user' o 'login'), habría que cambiarlo aquí.
                const urlDestino = `https://dev.platform.simskills.io?email=${emailCodificado}`;
                
                // 3. Redirigimos
                window.location.href = urlDestino;

            }, 1500);

        } else {
            throw new Error(`Error status: ${response.status}`);
        }

    } catch (error) {
        console.error("Error al enviar:", error);
        loadingText.textContent = "Error de conexión. No se pudo redirigir.";
        loadingText.style.color = "red";
        
        if (error.message.includes('404')) {
            alert("Recuerda activar el botón 'Execute Workflow' en n8n.");
        }
    }
}
