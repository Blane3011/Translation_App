// Keep your existing Settings object
window.Settings = {
  get(key, fallback=null){
    const data = JSON.parse(localStorage.getItem("appSettings")|| "{}");
    return key in data ? data[key] : fallback;
  },
  set(key, value){
    const data = JSON.parse(localStorage.getItem("appSettings")|| "{}");
    data[key] = value;
    localStorage.setItem("appSettings", JSON.stringify(data));
  },
  reset(){ localStorage.removeItem("appSettings"); }
};

// Apply settings to document (all pages)
function applySettings() {
  const theme = Settings.get("theme","dark");
  const fontSize = Settings.get("fontSize",16);
  const lineHeight = Settings.get("lineHeight",1.4);

  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.setProperty("--base-font-size", fontSize + "px");
  document.documentElement.style.setProperty("--base-line-height", lineHeight);
}

// Apply on page load
document.addEventListener("DOMContentLoaded", () => {
  applySettings();

  // Bind settings page sliders if present
  const fontSlider = document.getElementById("fontSize");
  const lineSlider = document.getElementById("lineHeight");
  const themeSelect = document.getElementById("theme");
  const resetBtn = document.getElementById("resetSettings");

  if(fontSlider){
    fontSlider.value = Settings.get("fontSize",16);
    fontSlider.addEventListener("input", ()=> {
      Settings.set("fontSize", parseInt(fontSlider.value,10));
      applySettings();
    });
  }

  if(lineSlider){
    lineSlider.value = Settings.get("lineHeight",1.4);
    lineSlider.addEventListener("input", ()=> {
      Settings.set("lineHeight", parseFloat(lineSlider.value));
      applySettings();
    });
  }

  if(themeSelect){
    themeSelect.value = Settings.get("theme","dark");
    themeSelect.addEventListener("change", ()=> {
      Settings.set("theme", themeSelect.value);
      applySettings();
    });
  }

  if(resetBtn){
    resetBtn.addEventListener("click", ()=>{
      Settings.reset();
      applySettings();
      if(fontSlider) fontSlider.value = 16;
      if(lineSlider) lineSlider.value = 1.4;
      if(themeSelect) themeSelect.value = "dark";
    });
  }
});

// Live update across other tabs/windows
window.addEventListener("storage", (event)=>{
  if(event.key==="appSettings") applySettings();
});

import { saveConversation, getSavedConversations } from './conversationStorage.js';

// Example conversations
const libraryConversation = [
  { original: "Hello, can you help me?", translation: "Hola, ¿puedes ayudarme?", source: "user" },
  { original: "Sí, ¿qué necesitas?", translation: "Yes, what do you need?", source: "other" },
  { original: "Can you tell me where the library is?", translation: "¿Puedes decirme dónde está la biblioteca?", source: "user" },
  { original: "Por supuesto, está justo al final de la calle a la izquierda.", translation: "Of course, it’s just at the end of the street on the left.", source: "other" },
  { original: "Thank you so much, have a good day!", translation: "¡Muchas gracias, que tengas un buen día!", source: "user" },
  { original: "¡De nada, igualmente!", translation: "You’re welcome, same to you!", source: "other" }
];

const foodConversation = [
  { original: "Hi, I would like to order a coffee, please.", translation: "Hola, me gustaría pedir un café, por favor.", source: "user" },
  { original: "Claro, ¿qué tipo de café quieres?", translation: "Sure, what kind of coffee do you want?", source: "other" },
  { original: "Just a black coffee, thanks.", translation: "Solo un café solo, gracias.", source: "user" },
  { original: "Perfecto, será listo en 5 minutos.", translation: "Perfect, it will be ready in 5 minutes.", source: "other" },
  { original: "Thank you!", translation: "¡Gracias!", source: "user" },
  { original: "¡De nada!", translation: "You’re welcome!", source: "other" }
];

// Get all saved conversations
const savedConvos = getSavedConversations();

// Only add examples if they don't already exist
if (!savedConvos["Library Directions"]) {
  saveConversation("Library Directions", libraryConversation);
}

if (!savedConvos["Ordering Food"]) {
  saveConversation("Ordering Food", foodConversation);
}