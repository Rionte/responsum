import { MSG_ASK, sendToBackground } from "../../../lib/messaging";

export async function renderAskView(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <h1>Ask about this assignment</h1>
    <p class="hint">Answers come only from the captured summary, plan, and instructions.</p>
    <textarea id="ask-input" placeholder="e.g. What format does the report need?"></textarea>
    <div class="row"><button id="ask" class="primary">Ask</button></div>
    <p id="ask-status" class="status" aria-live="polite"></p>
    <div id="answer" class="card answer"></div>`;
  const input = container.querySelector("#ask-input") as HTMLTextAreaElement;
  const button = container.querySelector("#ask") as HTMLButtonElement;
  const status = container.querySelector("#ask-status") as HTMLElement;
  const answerBox = container.querySelector("#answer") as HTMLElement;

  const ask = async (): Promise<void> => {
    const question = input.value.trim();
    if (!question) {
      status.textContent = "Type a question first.";
      return;
    }
    button.disabled = true;
    status.textContent = "Thinking...";
    answerBox.textContent = "";
    const res = await sendToBackground<{ answer: string }>(MSG_ASK, { question });
    button.disabled = false;
    if (!res.ok) {
      status.textContent = res.error ?? "Ask failed.";
      return;
    }
    status.textContent = "";
    answerBox.textContent = res.data?.answer ?? "";
  };

  button.addEventListener("click", ask);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void ask();
    }
  });
}
