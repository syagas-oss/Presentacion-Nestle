
export interface Stat {
  v: string;
  l: string;
  icon?: string;
}

export interface TableCol {
  h: string;
  items: string[];
  icon: string;
}

export interface Card {
  t: string;
  d: string;
}

export interface Slide {
  id: number;
  type: 'HERO' | 'HERO_GLOW' | 'HERO_FINAL' | 'DATA' | 'DATA_FOCUS' | 'DATA_FOCUS_RED' | 'TABLE_3COL' | 'ALERT' | 'LIST' | 'STEPS' | 'TIMELINE';
  title: string;
  subtitle: string;
  description?: string;
  highlight?: string;
  stats?: Stat[];
  items?: string[];
  cards?: Card[];
  tableData?: TableCol[];
}

export interface ContentData {
  slides: Slide[];
}
