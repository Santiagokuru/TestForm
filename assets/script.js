const form = document.getElementById('miFormulario');
const submitBtn = document.getElementById('submitBtn');
const loadingContainer = document.getElementById('loadingContainer');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');
const emailInput = document.getElementById('email');

// Evento principal
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // --- NUEVA VALIDACIÓN: BLOQUEAR YAHOO Y HOTMAIL ---
    // 1. Obtenemos el valor del email y lo convertimos a minúsculas para evitar errores (ej: User@Yahoo.com)
    const emailVal = emailInput.value.toLowerCase().trim();

    // 2. Comprobamos si termina en los dominios prohibidos
    if (emailVal.endsWith('@gmail.com') || emailVal.endsWith('@hotmail.com')|| emailVal.endsWith('@yahoo.com')) {
        // 3. Mostramos un mensaje de error al usuario
        Swal.fire({
            title: 'Uups!Prueba con otro correo',
            text: 'Para esta campaña, por favor utiliza un correo corporativo',
            icon: 'warning',
            confirmButtonColor: '#F2B23E',
            confirmButtonText: 'Entendido'

        })
        // 4. IMPORTANTE: Usamos 'return' para detener el código aquí.
        // Así no se ejecuta la barra de carga ni el envío de datos.
        return;
    }
    // --------------------------------------------------

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
    }, 2000); // Nota: En tu código original decía 2000 (2 seg), aunque el comentario decía 4.
});

// Función asíncrona para enviar datos y redirigir con el email
async function enviarDatosAPI() {
    const email = emailInput.value;
    const url = "https://n8n-n8n.ppdj7d.easypanel.host/webhook/6cad4f16-d4a9-4b0c-8067-79b5443c19a3";

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
            loadingText.style.color = "#28a745";
            console.log("Datos enviados correctamente.");

            setTimeout(() => {
                const emailCodificado = encodeURIComponent(email);
                const urlDestino = `https://dev.platform.simskills.io/login?email=${emailCodificado}`;
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