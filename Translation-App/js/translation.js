import { saveConversation } from "./conversationStorage.js";

let messages = [];
let speechSupported = "speechSynthesis" in window;
let mode = "user"; // "user" or "other"

const microphoneButton = document.getElementById("microphoneButton");
const languageButton = document.getElementById("languageButton");
const saveButton = document.getElementById("saveButton");
let nameInputModal;
let recognition = null;

document.addEventListener("DOMContentLoaded", () => {
  const modalElement = document.getElementById("textInputModal");
  nameInputModal = new bootstrap.Modal(modalElement);

  if (!speechSupported) {
    alert("Sorry, your browser does not support speech synthesis. Please use Chrome or Edge.");
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Sorry, your browser does not support speech recognition.");
  } else {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-GB";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => console.log("Speech recognition started");
    recognition.onend = stopRecording;
    recognition.onerror = (e) => console.error("Recognition error:", e);
    recognition.onresult = handleRecognitionResult;
  }
});

// -----------------------
// Event Listeners
// -----------------------
microphoneButton.addEventListener("click", startRecording);
languageButton.addEventListener("click", toggleModeAndFlag);
saveButton.addEventListener("click", (e) => { e.preventDefault(); askForText(); });

document.getElementById("submitTextBtn").addEventListener("click", () => {
  const nameInput = document.getElementById("conversationNameInput");
  const name = nameInput.value.trim();

  if (!name) return alert("Please enter a conversation name.");
  if (messages.length === 0) return alert("No messages to save.");

  saveConversation(name, messages);
  nameInput.value = "";
  nameInputModal.hide();
});

// -----------------------
// Functions
// -----------------------
function startRecording(e) {
  try {
    e.preventDefault();
    recognition.start();
    document.getElementById("microphoneIcon").src = "Images/Icons/activeMicrophone.png";
    microphoneButton.disabled = true;
    languageButton.disabled = true;
  } catch (err) {
    console.warn("Could not start recognition:", err);
  }
}

function stopRecording() {
  document.getElementById("microphoneIcon").src = "Images/Icons/microphone.png";
  microphoneButton.disabled = false;
  languageButton.disabled = false;
}

// Toggle mode manually via button
function toggleModeAndFlag(e) {
  e.preventDefault();
  const flagImg = languageButton.querySelector("img");

  if (mode === "user") {
    mode = "other";
    flagImg.src = "Images/Icons/Spain.png";
  } else {
    mode = "user";
    flagImg.src = "Images/Icons/united-kingdom.png";
  }
}

// Handle transcription results
async function handleRecognitionResult(event) {
  const transcript = event.results[0][0].transcript;
  console.log("Transcript:", transcript);

  // Use current mode for this message
  await addMessage(transcript, mode);

  // Switch mode for the next message
  const flagImg = languageButton.querySelector("img");
  if (mode === "user") {
    mode = "other";
    flagImg.src = "Images/Icons/Spain.png";
  } else {
    mode = "user";
    flagImg.src = "Images/Icons/united-kingdom.png";
  }
}

// Add a message to chat and translate
async function addMessage(originalText, source) {
  const messageContainer = await createMessageCard(originalText, "TRANSLATING...", source);

  let translatedText = "";
  if (source === "user") translatedText = await translateText(originalText, "en", "es");
  if (source === "other") translatedText = await translateText(originalText, "es", "en");

  updateMessageBubble(messageContainer, originalText, translatedText);
  messages.push({ original: originalText, translation: translatedText, source });

  if (speechSupported) {
    if (source === "user") readMessageAloud(translatedText, "en-GB");
    if (source === "other") readMessageAloud(translatedText, "es-ES");
  }
}

async function createMessageCard(originalText, translatedText, source) {
  const container = document.createElement("div");
  container.className = source === "user" ? "userMessageContainer" : "otherMessageContainer";

  container.innerHTML = `
    <div class="${source === "user" ? "userMessage" : "otherMessage"}">
      <p>${originalText}</p>
      <p class="fst-italic">${translatedText}</p>
    </div>
  `;

  document.getElementById("messageBox").appendChild(container);
  return container;
}

function updateMessageBubble(container, originalText, translatedText) {
  const bubble = container.querySelector(".userMessage, .otherMessage");
  if (!bubble) return console.error("Bubble element not found.");

  const [originalP, translatedP] = bubble.querySelectorAll("p");
  originalP.textContent = originalText;
  translatedP.textContent = translatedText;
}

async function translateText(text, sourceLang = "en", targetLang = "es") {
  try {
    const res = await fetch("https://translation-app-7o5f.onrender.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: sourceLang, target: targetLang, format: "text" }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    return data.translatedText;
  } catch (err) {
    console.error("Translation failed:", err);
    return "Translation error";
  }
}

function readMessageAloud(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function askForText() {
  nameInputModal.show();
}