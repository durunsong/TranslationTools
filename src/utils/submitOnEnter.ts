import type { KeyboardEvent } from "react";

type TextAreaKeyboardEvent = KeyboardEvent<HTMLTextAreaElement>;

export const shouldSubmitOnEnter = (event: TextAreaKeyboardEvent) => {
  const nativeEvent = event.nativeEvent as globalThis.KeyboardEvent & {
    isComposing?: boolean;
    keyCode?: number;
  };

  if (nativeEvent.isComposing || nativeEvent.keyCode === 229) {
    return false;
  }

  return (
    event.key === "Enter" &&
    !event.shiftKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.metaKey
  );
};
