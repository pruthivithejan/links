import { captureShareCard } from "./export";

const copyButton =
  document.querySelector<HTMLButtonElement>("[data-share-copy]");

const downloadButton = document.querySelector<HTMLButtonElement>(
  "[data-share-download]"
);

const feedbackTimers = new Map<HTMLButtonElement, number>();

const buttonFeedback = (
  button: HTMLButtonElement,
  message: string,
  defaultLabel: string
) => {
  const label = button.querySelector<HTMLElement>("[aria-live]");

  if (!label) {
    return;
  }

  window.clearTimeout(feedbackTimers.get(button));
  label.textContent = message;
  feedbackTimers.set(
    button,
    window.setTimeout(() => {
      label.textContent = defaultLabel;
      feedbackTimers.delete(button);
    }, 2500)
  );
};

const legacyCopy = (text: string) => {
  const previousFocus = document.activeElement;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.cssText = "position:fixed;opacity:0;pointer-events:none";
  textarea.setAttribute("aria-label", "Link to copy");

  try {
    document.body.append(textarea);
    textarea.select();

    return document.execCommand("copy");
  } finally {
    textarea.remove();

    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus({ preventScroll: true });
    }
  }
};

const copyLink = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    try {
      return legacyCopy(text);
    } catch {
      return false;
    }
  }
};

copyButton?.addEventListener("click", async () => {
  const href = copyButton.dataset.shareUrl;

  if (!href) {
    return;
  }

  const copied = await copyLink(href);
  buttonFeedback(
    copyButton,
    copied ? "Copied" : "Try copying again",
    "Copy link"
  );
});

downloadButton?.addEventListener("click", async () => {
  const card = document.querySelector<HTMLElement>("[data-share-card]");

  const label = downloadButton.querySelector<HTMLElement>(
    "[data-share-download-label]"
  );

  if (!card || !label || downloadButton.disabled) {
    return;
  }

  window.clearTimeout(feedbackTimers.get(downloadButton));
  downloadButton.disabled = true;
  downloadButton.setAttribute("aria-busy", "true");
  label.textContent = "Saving…";

  try {
    const blob = await captureShareCard(card);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${new URL(copyButton?.dataset.shareUrl ?? window.location.href).hostname}-share.png`;
    document.body.append(link);
    link.click();
    link.remove();
    // Allow mobile browsers time to finish opening the image download.
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    buttonFeedback(downloadButton, "Saved", "Save card");
  } catch {
    buttonFeedback(downloadButton, "Try saving again", "Save card");
  } finally {
    downloadButton.disabled = false;
    downloadButton.removeAttribute("aria-busy");
  }
});

const actions = document.querySelector<HTMLElement>("[data-share-actions]");

if (actions) {
  actions.dataset.ready = "";
}
