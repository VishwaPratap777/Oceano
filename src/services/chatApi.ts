import { apiFetch } from "./api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  reply: string;
  model: string;
  timestamp: string;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  return apiFetch<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });
}
