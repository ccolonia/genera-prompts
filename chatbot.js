const chatWindow = document.getElementById("chat-window");
const optionsContainer = document.getElementById("options-container");

// Flujo de preguntas con opciones predefinidas
const flow = [
  {
    question: "¿En qué industria trabajas o cuál es tu área de interés?",
    options: ["Marketing Digital", "Diseño UX/UI", "Música y Contenido Audiovisual", "Educación", "Tecnología", "Otro"]
  },
  {
    question: "¿Cuál es el objetivo del prompt que quieres generar?",
    options: ["Crear contenido persuasivo", "Generar imágenes", "Escribir código", "Automatizar tareas", "Analizar datos", "Otro"]
  },
  {
    question: "¿A quién va dirigido este prompt?",
    options: ["Emprendedores digitales", "Jóvenes de 18 a 25 años", "Profesionales de marketing", "Usuarios de apps móviles", "Otro"]
  },
  {
    question: "¿En qué herramienta de IA vas a usar el prompt?",
    options: ["ChatGPT", "Google Bard", "Bing Chat", "Midjourney", "Leonardo AI", "Otra"]
  }
];

let currentStep = 0;
let responses = {};

function appendMessage(role, message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", role);
  msgDiv.textContent = message;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showOptions(options) {
  optionsContainer.innerHTML = "";
  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = option;
    btn.onclick = () => handleAnswer(option);
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(answer) {
  responses[`step${currentStep}`] = answer;
  appendMessage("user", answer);
  optionsContainer.innerHTML = "";

  currentStep++;

  if (currentStep < flow.length) {
    setTimeout(() => {
      appendMessage("bot", flow[currentStep].question);
      showOptions(flow[currentStep].options);
    }, 600);
  } else {
    setTimeout(generateFinalPrompt, 600);
  }
}

function exportPrompt() {
  const chatContent = document.getElementById("chat-window").innerText;

  // Crear un Blob con el contenido del prompt
  const blob = new Blob([chatContent], { type: "text/plain;charset=utf-8" });

  // Crear un enlace de descarga
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "super-prompt.txt";
  link.click();
}

function restartChat() {
  // Limpiar mensajes del chat
  document.getElementById("chat-window").innerHTML = "";

  // Limpiar opciones
  document.getElementById("options-container").innerHTML = "";

  // Ocultar botón de reinicio
  document.getElementById("restart-container").style.display = "none";

  // Desactivar botón de exportar
  document.getElementById("export-btn").setAttribute("disabled", true);

  // Reiniciar variables
  currentStep = 0;
  responses = {};

  // Volver a mostrar la primera pregunta
  appendMessage("bot", flow[0].question);
  showOptions(flow[0].options);
}

// Mostrar primera pregunta al cargar
window.onload = () => {
  appendMessage("bot", flow[0].question);
  showOptions(flow[0].options);
};

function generateFinalPrompt() {
  const industry = responses.step0;
  const objective = responses.step1;
  const audience = responses.step2;
  const tool = responses.step3;

  const superPrompt = `
# 🚀 SÚPER PROMPT GENERADO

/// IDENTIDAD  
Eres un experto en ${industry}, especializado en ${objective}.

/// OBJETIVO  
Crear un output enfocado en ${objective}, para ${audience} usando ${tool}.

/// CONTEXTO  
Trabajas para un cliente o usuario que busca optimizar su trabajo con inteligencia artificial.

/// MECÁNICA  
Fase 1: Entrevista inicial con el usuario  
Fase 2: Análisis de necesidades  
Fase 3: Generación paso a paso  

/// FORMATO  
- Título claro  
- Descripción detallada  
- Ejemplos prácticos  
- Instrucciones ejecutables  

/// LENGUAJE  
Tono: profesional, claro y útil.

/// REFERENCIAS  
Inspírate en ejemplos exitosos de prompts en ${tool}.

/// REGLAS GENERALES  
1. Responde siempre en español.  
2. Usa lenguaje accesible sin tecnicismos innecesarios.  
3. Siempre prioriza mensajes claros y con llamados a la acción.
`;

appendMessage("bot", "Aquí tienes tu SÚPER PROMPT estructurado:");
appendMessage("bot", superPrompt);
document.getElementById("export-btn").removeAttribute("disabled");
document.getElementById("restart-container").style.display = "block";
}