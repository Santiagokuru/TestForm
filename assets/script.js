// 1. Selección de elementos del DOM
const form = document.getElementById('miFormulario');
const submitBtn = document.getElementById('submitBtn');
const loadingContainer = document.getElementById('loadingContainer');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');
const emailInput = document.getElementById('email');

// 2. Evento principal de envío
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // --- VALIDACIÓN: BLOQUEAR CORREOS PERSONALES ---
    const emailVal = emailInput.value.toLowerCase().trim();

    // Lista extendida de dominios no corporativos
    const dominiosProhibidos = ['@gmail.com', '@hotmail.com', '@yahoo.com', '@outlook.com', '@live.com'];
    const esProhibido = dominiosProhibidos.some(dominio => emailVal.endsWith(dominio));

    if (esProhibido) {
        Swal.fire({
            title: '¡Uups! Prueba con otro correo',
            text: 'Para esta campaña, por favor utiliza un correo corporativo.',
            icon: 'warning',
            confirmButtonColor: '#F2B23E',
            confirmButtonText: 'Entendido'
        });
        return; // Detiene la ejecución si el correo no es válido
    }

    // --- UI: INICIO DEL PROCESO DE CARGA ---
    // Deshabilitamos el botón y lo ocultamos para evitar múltiples envíos
    submitBtn.disabled = true;
    submitBtn.style.display = 'none';
    
    // Mostramos el contenedor de carga
    loadingContainer.style.display = 'block';
    loadingBar.style.width = '0%';
    loadingText.textContent = "Preparando demo...";
    loadingText.style.color = "initial";

    // Animación visual de la barra (se llena en 2 segundos)
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 50);

    // Esperamos 2 segundos (tiempo de la animación) antes de llamar a la API
    setTimeout(() => {
        enviarDatosAPI(emailVal);
    }, 2000);
});

// 3. Función asíncrona para comunicación con n8n
async function enviarDatosAPI(email) {
    const url = "https://n8n-n8n.ppdj7d.easypanel.host/webhook-test/6cad4f16-d4a9-4b0c-8067-79b5443c19a3";

    loadingText.textContent = "Enviando datos de registro...";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email,
                fecha: new Date().toISOString() // Opcional: añade marca de tiempo
            })
        });

        if (response.ok) {
            loadingText.textContent = "¡Demo activada! Redirigiendo...";
            loadingText.style.color = "#28a745";

            // Pequeña pausa para que el usuario lea el mensaje de éxito
            setTimeout(() => {
                const emailCodificado = encodeURIComponent(email);
                const urlDestino = `https://dev.platform.simskills.io/login?email=${emailCodificado}`;
                window.location.href = urlDestino;
            }, 1500);

        } else {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

    } catch (error) {
        console.error("Error al enviar:", error);
        
        // UI en caso de error
        loadingText.textContent = "Hubo un error de conexión.";
        loadingText.style.color = "red";
        
        // Restauramos el botón para que el usuario pueda intentar de nuevo
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.style.display = 'block';
            loadingContainer.style.display = 'none';
        }, 3000);

        if (error.message.includes('404')) {
            alert("Error 404: Asegúrate de que el flujo en n8n esté activo (Execute Workflow).");
        }
    }
}
