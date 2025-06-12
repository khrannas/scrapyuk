// Design system constants
export const COLORS = {
  background: '#1A1A1A',
  panelSurface: '#242424',
  accent: '#3B82F6',
  primaryText: '#E0E0E0',
  secondaryText: '#A0A0A0',
} as const;

// Frame template constants
export const FRAME_TEMPLATES = {
  SMALL: { width: 200, height: 200, depth: 50 },
  MEDIUM: { width: 200, height: 300, depth: 50 },
} as const;

// 3D Object constraints
export const OBJECT_CONSTRAINTS = {
  minLayers: 1,
  maxLayers: 10,
  minLayerSpacing: 0.5,
  maxLayerSpacing: 10,
  minScale: 0.1,
  maxScale: 2.0,
  minHeight: 0,
  maxHeight: 50,
} as const;

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/png'],
  maxAssets: 50,
} as const;

// Share link settings
export const SHARE_SETTINGS = {
  defaultExpirationDays: 30,
  maxExpirationDays: 365,
  tokenLength: 32,
} as const;

// UI constants
export const UI = {
  headerHeight: 64,
  panelWidth: 320,
  minCanvasWidth: 400,
  animationDuration: 200,
} as const;