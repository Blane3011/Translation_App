import { loadConversationByName, deleteConversation } from "./conversationStorage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const convoName = params.get("name");

  if (!convoName) return;

  const conversation = await loadConversationByName(decodeURIComponent(convoName));

  if (!conversation) {
    alert("Conversation not available offline.");
    return;
  }

  const binButton = document.getElementById("binButton");
  const speakerButton = document.getElementById("speakerButton");
  const SMSButton = document.getElementById("SMSButton");
  const messageBox = document.getElementById("messageBox");

  renderConversationMessages(conversation, messageBox);

  // DELETE
  binButton?.addEventListener("click", () => {
    if (confirm(`Are you sure you want to delete "${conversation.name}"?`)) {
      deleteConversation(conversation.name);
      window.location.href = "Pages/savedConversationsScreen.html";
    }
  });

  // SPEAK
  speakerButton?.addEventListener("click", () => speakConversation(conversation, messageBox));

  // COPY
  SMSButton?.addEventListener("click", async () => {
    const convoText = conversation.messages
      .map(m => `[${m.source.toUpperCase()}] ${m.original} → ${m.translation}`)
      .join("\n");

    await navigator.clipboard.writeText(convoText);
    alert("Conversation copied to clipboard!");
  });
});