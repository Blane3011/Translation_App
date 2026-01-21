const STORAGE_KEY = "conversations";

/**
 * Get all saved conversations
 * @returns {Object<string, Array>}
 */
export function getSavedConversations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveConversation(name, messages) {
  const conversations = getSavedConversations();

  if (conversations[name]) {
    // Ask the user if they want to overwrite
    const overwrite = confirm(
      `A conversation named "${name}" already exists.\nDo you want to overwrite it?`
    );
    if (!overwrite) {
      console.log(`Save cancelled: conversation "${name}" not overwritten.`);
      return; // User chose not to overwrite
    }
  }

  // Determine languages used
  const languagesUsed = new Set();
  messages.forEach(m => {
    if (m.source === "user") languagesUsed.add("EN → ES");
    if (m.source === "other") languagesUsed.add("ES → EN");
  });

  // Save or overwrite the conversation
  conversations[name] = {
    name,
    createdAt: conversations[name]?.createdAt ?? new Date().toISOString(), // keep original createdAt if overwriting
    updatedAt: new Date().toISOString(),
    languages: [...languagesUsed],
    messages: structuredClone(messages)
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  console.log(`Conversation "${name}" saved successfully.`);
}

/**
 * Load a conversation by name
 * @param {string} name - The conversation name
 * @returns {Object|null} - Returns the conversation object or null if not found
 */
export function loadConversationByName(name) {
  const conversations = getSavedConversations();
  const convo = conversations[name];
  if (!convo) return null;

  // Return a deep copy to avoid accidental mutation
  return structuredClone(convo);
}

/**
 * Delete a conversation
 * @param {string} name
 */
export function deleteConversation(name) {
  const conversations = getSavedConversations();
  delete conversations[name];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

document.addEventListener("DOMContentLoaded", () =>
  {
  if(document.getElementById("conversationList")) {
    renderConversationList();
  }
  });

function renderConversationList() {
  const container = document.getElementById("conversationList");
  if (!container) return;

  container.innerHTML = "";

  const conversations = getSavedConversations();
  const entries = Object.values(conversations);

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="otherMessageContainer">
        <div class="otherMessage">
          No saved conversations yet
        </div>
      </div>
    `;
    return;
  }

  entries
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .forEach(convo => {
      const wrapper = document.createElement("div");
      wrapper.className = "userMessageContainer";

      const bubble = document.createElement("div");
      bubble.className = "userMessage";
      bubble.style.cursor = "pointer";

      const created = new Date(convo.createdAt).toLocaleString();
      const updated = new Date(convo.updatedAt).toLocaleString();

      bubble.innerHTML = `
        <strong>${convo.name}</strong>
        <p class="conversation-languages mb-1 fst-italic">
          Languages: ${convo.languages.join(", ")}
        </p>
        <p class="conversation-date">
          Created: ${created}<br>
          Last updated: ${updated}
        </p>
      `;

      bubble.addEventListener("click", () => {
        // encode the name for URL safety
        const encodedName = encodeURIComponent(convo.name);
        window.location.href = `Pages/openedConversationScreen.html?name=${encodedName}`;
      });

      wrapper.appendChild(bubble);
      container.appendChild(wrapper);
    });


}
