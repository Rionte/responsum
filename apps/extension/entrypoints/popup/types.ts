export interface PopupContext {
  navigate: (view: string) => void;
  refresh: () => void;
}

export type ViewRenderer = (
  container: HTMLElement,
  ctx: PopupContext
) => void | Promise<void>;
