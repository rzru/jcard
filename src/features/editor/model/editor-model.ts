export type JcardFace = 'outside' | 'inside';
export type TextAlignment = 'left' | 'center' | 'right';

export type JcardFormat = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly panelWidths: readonly number[];
  readonly paper: 'A4' | 'A3';
};

export type FontChoice = {
  readonly id: string;
  readonly name: string;
  readonly family: string;
};

export type TextStyle = {
  readonly fontId: string;
  readonly color: string;
  readonly outlineColor?: string;
  readonly outlineWidth?: number;
  readonly lineHeight?: number;
  readonly size: number;
  readonly bold: boolean;
  readonly italic: boolean;
  readonly underline: boolean;
  readonly align: TextAlignment;
};

export type CanvasRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type FreeText = CanvasRect & {
  readonly id: string;
  readonly face: JcardFace;
  readonly text: string;
  readonly rotation: number;
  readonly style: TextStyle;
};

export type JcardArea = CanvasRect & {
  readonly id: string;
  readonly face: JcardFace;
  readonly fill: 'color' | 'image';
  readonly color: string;
  readonly imageUrl: string;
  readonly opacity: number;
  readonly blur: number;
};

const CLASSIC_FORMAT: JcardFormat = {
  id: 'classic',
  label: 'Classic J',
  description: 'Front, spine, and rear flap',
  panelWidths: [25.4, 12.7, 65.1],
  paper: 'A4',
};

export const DEFAULT_FORMAT: JcardFormat = {
  id: 'plus-1',
  label: '+1 foldout',
  description: 'One interior panel',
  panelWidths: [25.4, 12.7, 65.1, 63.5],
  paper: 'A4',
};

export const JCARD_FORMATS: readonly JcardFormat[] = [
  CLASSIC_FORMAT,
  DEFAULT_FORMAT,
  {
    id: 'plus-2',
    label: '+2 foldouts',
    description: 'Two roll-fold panels',
    panelWidths: [25.4, 12.7, 65.1, 63.5, 62],
    paper: 'A4',
  },
  {
    id: 'plus-3',
    label: '+3 foldouts',
    description: 'Three roll-fold panels',
    panelWidths: [25.4, 12.7, 65.1, 63.5, 62, 60],
    paper: 'A3',
  },
  {
    id: 'plus-4',
    label: '+4 foldouts',
    description: 'Four roll-fold panels',
    panelWidths: [25.4, 12.7, 65.1, 63.5, 62, 60, 58.5],
    paper: 'A3',
  },
  {
    id: 'plus-5',
    label: '+5 foldouts',
    description: 'Five roll-fold panels',
    panelWidths: [25.4, 12.7, 65.1, 63.5, 62, 60, 58.5, 57],
    paper: 'A3',
  },
];

export const JCARD_FONTS: readonly FontChoice[] = [
  { id: 'archivo', name: 'Funnel Sans', family: "'Funnel Sans Variable', sans-serif" },
  { id: 'unbounded', name: 'Unbounded', family: "'Unbounded Variable', sans-serif" },
  { id: 'anybody', name: 'Anybody', family: "'Anybody Variable', sans-serif" },
  { id: 'azeret', name: 'Azeret Mono', family: "'Azeret Mono', monospace" },
  {
    id: 'barlow-condensed',
    name: 'Barlow Condensed',
    family: "'Barlow Condensed', sans-serif",
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    family: "'Space Grotesk Variable', sans-serif",
  },
  { id: 'fraunces', name: 'Fraunces', family: "'Fraunces Variable', serif" },
  { id: 'syne', name: 'Syne', family: "'Syne Variable', sans-serif" },
  { id: 'newsreader', name: 'Newsreader', family: "'Newsreader Variable', serif" },
  { id: 'georgia', name: 'Georgia', family: 'Georgia, serif' },
];

const BODY_STYLE: TextStyle = {
  fontId: 'archivo',
  color: '#111111',
  outlineColor: '#ffffff',
  outlineWidth: 0,
  lineHeight: 1.15,
  size: 8,
  bold: false,
  italic: false,
  underline: false,
  align: 'left',
};

const UNBOUNDED_STYLE: TextStyle = {
  ...BODY_STYLE,
  fontId: 'unbounded',
};

const TITLE_STYLE: TextStyle = {
  ...UNBOUNDED_STYLE,
  size: 14,
  bold: true,
};

const TRACK_STYLE: TextStyle = {
  ...BODY_STYLE,
  size: 10,
};

export const INITIAL_TEXTS: readonly FreeText[] = [
  {
    id: 'text-1',
    face: 'outside',
    text: 'Mixtape 1 / Jewel',
    x: 42.994832986558315,
    y: 87.16871020868481,
    width: 52.79317347089483,
    height: 5.9798210369723215,
    rotation: 0,
    style: TITLE_STYLE,
  },
  {
    id: 'text-2',
    face: 'outside',
    text: 'rzru',
    x: 42.997620689857264,
    y: 93.14853124565714,
    width: 6.834060022541343,
    height: 3.4170405925556127,
    rotation: 0,
    style: UNBOUNDED_STYLE,
  },
  {
    id: 'text-3',
    face: 'outside',
    text: 'Mixtape 1 / Jewel',
    x: 16.626695749055067,
    y: 17.7067202380207,
    width: 30.240715599745442,
    height: 3.4170405925556127,
    rotation: 90,
    style: { ...UNBOUNDED_STYLE, bold: true },
  },
  {
    id: 'text-4',
    face: 'outside',
    text: 'rzru',
    x: 3.9355049759913387,
    y: 90.24404674198487,
    width: 6.834060022541343,
    height: 3.4170405925556127,
    rotation: 0,
    style: UNBOUNDED_STYLE,
  },
  {
    id: 'text-5',
    face: 'inside',
    text: 'SIDE A',
    x: 42.50505256861545,
    y: 7.9987223466075905,
    width: 24.944347335762604,
    height: 7.517489303622347,
    rotation: 0,
    style: { ...UNBOUNDED_STYLE, size: 18 },
  },
  {
    id: '1e430e57-9625-42a3-bdd2-5fa98765ce31',
    face: 'outside',
    text: 'rzru',
    x: 28.33285993952194,
    y: 91.95256703826267,
    width: 6.834060022541343,
    height: 3.4170405925556127,
    rotation: 90,
    style: UNBOUNDED_STYLE,
  },
  {
    id: 'cc18ae86-85de-467d-9191-ed10e4bd46ca',
    face: 'outside',
    text: 'Berlin · 31.10.2026',
    x: 3.9352573166909206,
    y: 94.85705154193495,
    width: 18.451962060861625,
    height: 2.0502243555333677,
    rotation: 0,
    style: { ...UNBOUNDED_STYLE, color: '#000000', size: 5 },
  },
  {
    id: '8c74e109-b180-4639-a4f8-bceecae4a796',
    face: 'inside',
    text: '01  Streetlights\n02  Last Train\n03  Soft Static\n04  Window Seat',
    x: 42.502195307618244,
    y: 22.465470103822035,
    width: 26.140309194326566,
    height: 16.23094281463916,
    rotation: 0,
    style: TRACK_STYLE,
  },
  {
    id: 'c2877124-1149-4806-89a4-318b5d6707d7',
    face: 'inside',
    text: 'SIDE B',
    x: 108.72431819002145,
    y: 7.9987223466075905,
    width: 21.86901684231242,
    height: 6.663229155483445,
    rotation: 0,
    style: { ...UNBOUNDED_STYLE, size: 16 },
  },
  {
    id: '1aebe453-aea4-4aae-a300-6aea49fb4393',
    face: 'inside',
    text: '01  Streetlights\n02  Last Train\n03  Soft Static\n04  Window Seat',
    x: 108.7243077620616,
    y: 22.464192450429632,
    width: 26.140309194326566,
    height: 16.23094281463916,
    rotation: 0,
    style: TRACK_STYLE,
  },
];

export function fontFamily(id: string): string {
  return JCARD_FONTS.find((font) => font.id === id)?.family ?? "'Funnel Sans Variable', sans-serif";
}

export function totalWidth(format: JcardFormat): number {
  return format.panelWidths.reduce((sum, width) => sum + width, 0);
}

export function defaultTextStyle(): TextStyle {
  return { ...BODY_STYLE };
}
