import type { ReactNode } from "react";

export interface WalkthroughSlide {
  id: string;
  badge: {
    id: string;
    en: string;
  };
  title: {
    id: string;
    en: string;
  };
  description: {
    id: string;
    en: string;
  };
  highlight?: {
    id: string;
    en: string;
  };
  renderVisual?: () => ReactNode;
}

export interface WalkthroughDeck {
  lessonId: string;
  title: {
    id: string;
    en: string;
  };
  subtitle: {
    id: string;
    en: string;
  };
  slides: WalkthroughSlide[];
}
