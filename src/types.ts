
export interface Stat {
  v: string;
  l: string;
  icon?: string;
  trend?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface TableCol {
  h: string;
  items: string[];
  icon: string;
}

export interface Card {
  t: string;
  d: string;
  icon?: string;
}

export interface BentoItem {
  id?: string;
  title?: string;
  value?: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  span?: 'sm' | 'md' | 'lg' | 'xl'; // sm: 1col, md: 2cols, lg: 2x2, xl: full
  variant?: 'glass' | 'glassStrong' | 'accent' | 'outline' | 'media';
  image?: string;
}

export interface Slide {
  id: number;
  type: 'HERO' | 'HERO_GLOW' | 'HERO_FINAL' | 'BENTO_DATA' | 'BENTO_MARKET' | 'BENTO_GRID' | 'ALERT' | 'LIST' | 'STEPS' | 'TIMELINE' | 'KINETIC_BRIDGE';
  title: string;
  subtitle: string;
  description?: string;
  highlight?: string;
  stats?: Stat[];
  items?: string[];
  cards?: Card[];
  bentoItems?: BentoItem[];
  tableData?: TableCol[];
  speakerNotes?: string;
  builds?: string[];
}

export interface ContentData {
  slides: Slide[];
}
