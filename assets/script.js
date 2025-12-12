const form = document.getElementById('miFormulario');
const submitBtn = document.getElementById('submitBtn');
const loadingContainer = document.getElementById('loadingContainer');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');
const emailInput = document.getElementById('email');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir recarga de página

    // 1. Preparar UI
    submitBtn.style.display = 'none';
    loadingContainer.style.display = 'block';

    // 2. Iniciar animación de barra (pequeño delay para asegurar renderizado)
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 50);

    // 3. Esperar 4 segundos antes de enviar el AJAX
    setTimeout(() => {
        enviarDatosAjax();
    }, 4000);
});

function enviarDatosAjax() {
    const email = emailInput.value;
    const url = "https://n8n-n8n.ppdj7d.easypanel.host/webhook-test/6cad4f16-d4a9-4b0c-8067-79b5443c19a3";

    // Actualizar texto para que el usuario sepa que está enviando
    loadingText.textContent = "Enviando datos...";

    // Petición AJAX usando fetch
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    })
    .then(response => {
        // Nota: Como https://ajax.com probablemente no exista o no acepte POST,
        // esto podría dar error en consola. Pero la lógica es correcta.
        if (response.ok) {
            loadingText.textContent = "¡Enviado con éxito!";
            return response.json();
        } else {
            loadingText.textContent = "Error al conectar con el servidor.";
            console.log("Error de servidor");
        }
    })
    .catch(error => {
        // Capturar errores de red (muy probable con una URL de ejemplo)
        console.error('Error:', error);
        loadingText.textContent = "Hubo un error en la petición (Revisar Consola).";
        loadingText.style.color = "red";
    });
}