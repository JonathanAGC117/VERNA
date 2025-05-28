document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-reimaginar");
  if (boton) {
    boton.addEventListener("click", generateImage);
  }
});

async function generateImage() {
  const userPrompt = document.getElementById("userPrompt").value.trim();
  const basePrompt = document.getElementById("promptBase").textContent.trim();

  if (!userPrompt) {
    alert("Por favor escribe cómo deseas reimaginar esta obra.");
    return;
  }

  const promptFinal = `${basePrompt}. Reimaginada como ${userPrompt}.`;

  const imageContainer = document.getElementById("imageContainer");
  const imageResultElement = document.getElementById("imageResult");

  setLoadingState(true);

  const API_URL = "https://api.vyro.ai/v2/image/generations";
  const API_TOKEN = "vk-gM01EQXGif6S23SYFob3D0sR5XZKx3GDXrQWnbwa5FKux";

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);

  const formdata = new FormData();
  formdata.append("prompt", promptFinal);
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
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    imageResultElement.src = imageUrl;
    imageResultElement.alt = `Imagen generada: ${promptFinal}`;
    imageContainer.style.display = "block";
  } catch (error) {
    console.error("Error al generar imagen:", error);
    alert("❌ Error al conectarse con la API.");
  } finally {
    setLoadingState(false);
  }
}

function setLoadingState(isLoading) {
  const btn = document.getElementById("btn-reimaginar");
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "🧠 Generando..." : "✨ IA: Reimaginar";
}

function downloadImage() {
  const imageResultElement = document.getElementById("imageResult");
  const url = imageResultElement.src;
  if (!url) return;

  const link = document.createElement("a");
  link.href = url;
  link.download = "imagen-generada.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
