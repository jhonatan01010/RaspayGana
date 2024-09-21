const canvas = document.getElementById("scratch-card");
const ctx = canvas.getContext("2d");
const modal = document.getElementById("winModal");
const closeModalBtn = document.getElementById("closeModal");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");

// Crear la capa de raspado encima (color gris opaco)
ctx.fillStyle = "rgba(176, 196, 222, 1)"; // Color gris opaco
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Función para obtener las coordenadas de toque o clic
function getPointerPos(e) {
    let x, y;
    if (e.touches) { // Si es un toque (dispositivo móvil)
        x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
        y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    } else { // Si es un clic de ratón
        x = e.offsetX;
        y = e.offsetY;
    }
    return { x, y };
}

// Agregar la funcionalidad de raspado
let isScratching = false;

function startScratching(e) {
    isScratching = true;
}

function stopScratching() {
    isScratching = false;
    checkScratchCompletion(); // Verificar si se ha raspado suficiente
}

function scratch(e) {
    if (!isScratching) return;
    const { x, y } = getPointerPos(e);
    
    // Raspado en forma circular
    ctx.globalCompositeOperation = 'destination-out'; // Permite que se borre la capa superior
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2, false); // Área de raspado circular
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over'; // Restablece la configuración
    
    checkScratchCompletion(); // Comprobar cada vez que se raspa
}

// Verificar si el área raspada es suficiente para revelar la imagen
function checkScratchCompletion() {
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let scratchCount = 0;

    // Contar cuántos píxeles aún no han sido raspados
    for (let i = 3; i < pixelData.length; i += 4) {
        if (pixelData[i] === 255) { // Verifica si el pixel es opaco (no ha sido raspado)
            scratchCount++;
        }
    }

    // Si el área raspada es suficientemente grande, mostrar el modal
    if (scratchCount < (canvas.width * canvas.height) * 0.3) { // Si se ha raspado el 70%
        canvas.style.display = 'none'; // Ocultar el canvas
        modal.style.display = 'flex';  // Mostrar el modal
    }
}

// Eventos de mouse (escritorio)
canvas.addEventListener("mousedown", startScratching);
canvas.addEventListener("mouseup", stopScratching);
canvas.addEventListener("mousemove", scratch);

// Eventos de touch (dispositivos móviles)
canvas.addEventListener("touchstart", startScratching);
canvas.addEventListener("touchend", stopScratching);
canvas.addEventListener("touchmove", scratch);

// Cerrar el modal al hacer clic en la 'X'
closeModalBtn.addEventListener("click", () => {
    modal.style.display = 'none'; // Ocultar el modal cuando se cierra
});

// Manejar clic en botón "Sí"
btnYes.addEventListener("click", () => {
    // URL para abrir la aplicación de mensajería con un mensaje predefinido
    const message = encodeURIComponent("Sí quiero");
    const phoneNumber = "41079171"; // Puedes agregar un número de teléfono si lo deseas
    const smsUrl = `sms:${phoneNumber}?body=${message}`;
    
    // Abre la aplicación de mensajería
    window.location.href = smsUrl;
    
    modal.style.display = 'none'; // Ocultar el modal
});
