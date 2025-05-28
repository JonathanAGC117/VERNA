const API_URL = "https://api.vyro.ai/v2/image/generations";
const API_TOKEN = "vk-gM01EQXGif6S23SYFob3D0sR5XZKx3GDXrQWnbwa5FKux";

const imageContainer = document.getElementById("imageContainer");
const imageResultElement = document.getElementById("imageResult");

// Mostrar obra seleccionada
function mostrarObra(elemento) {
  const imagen = elemento.getAttribute("data-imagen");
  const titulo = elemento.getAttribute("data-titulo");
  const descripcion = elemento.getAttribute("data-descripcion");

  document.getElementById("imagen-obra").src = imagen;
  document.getElementById("imagen-obra").alt = titulo;
  document.getElementById("descripcion-obra").textContent = descripcion;

  imageContainer.style.display = "none";
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const primeraObra = document.querySelector("#obra-menu li");
  if (primeraObra) {
    mostrarObra(primeraObra);
  }

  const btnIA = document.getElementById("btn-reimaginar");
  if (btnIA) {
    btnIA.addEventListener("click", generateImage);
  }
});

// Generar imagen con IA usando blob
async function generateImage() {
  const promptUsuario = prompt("Describe cómo te gustaría reimaginar esta obra:");
  if (!promptUsuario) return;

  setLoadingState(true);

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);

  const formdata = new FormData();
  formdata.append("prompt", promptUsuario);
  formdata.append("style", "realistic");
  formdata.append("aspect_ratio", "1:1");
  formdata.append("seed", "5");

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const blob = await response.blob(); // 👈 ¡Aquí está el cambio clave!

    const imageUrl = URL.createObjectURL(blob);

    imageResultElement.src = imageUrl;  
    imageResultElement.alt = `Imagen generada: ${promptUsuario}`;
    imageContainer.style.display = "block";

  } catch (error) {
    console.error("Error al generar imagen:", error);
    alert("❌ Error al conectarse con la API.");
  } finally {
    setLoadingState(false);
  }
}

// Cambiar estado del botón mientras genera
function setLoadingState(isLoading) {
  const btn = document.getElementById("btn-reimaginar");
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "🧠 Generando..." : "✨ IA: Reimaginar";
}

// Descargar imagen
function downloadImage() {
  const url = imageResultElement.src;
  if (!url) return;

  const link = document.createElement("a");
  link.href = url;
  link.download = "imagen-generada.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
