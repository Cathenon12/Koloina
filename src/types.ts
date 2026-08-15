export interface PoemStanza {
  id: number;
  subtitle: string;
  tag: string;
  iconName: string;
  lines: string[];
  highlight?: string;
  footerNote?: string;
}

export interface LoveReasonCard {
  id: number;
  number: number;
  emoji: string;
  image: string;
  title: string;
  description: string;
  accentColor?: string;
}

export interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  type: 'heart' | 'rose' | 'petal' | 'bouquet' | 'sparkle';
  rotation: number;
  rotSpeed: number;
  swayAmplitude: number;
  swaySpeed: number;
}
