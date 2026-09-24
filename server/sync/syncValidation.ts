const THEMES = new Set([
  'green',
  'carbon',
  'violet',
  'crimson',
  'ocean',
]);

const INTERFACE_SCALES = new Set([
  'compact',
  'comfortable',
  'large',
]);

const EDITOR_FONT_SIZES = new Set([
  'small',
  'medium',
  'large',
]);

const DANGEROUS_KEYS = new Set([
  '__proto__',
  'prototype',
  'constructor',
]);

export interface SyncPerformanceData {
  attempts: number;
  failures: number;
}

export interface SyncProgressData {
  done: Record<string, number>;
  hints: Record<string, number>;
  lessonDone: Record<string, boolean>;
  performance: Record<string, SyncPerformanceData>;
  activityDates: string[];
  progressVersion: number;
}

export interface SyncPreferences {
  interfaceScale: 'compact' | 'comfortable' | 'large';
  reduceMotion: boolean;
  highContrast: boolean;
  editorFontSize: 'small' | 'medium' | 'large';
  editorLineWrapping: boolean;
  editorLineNumbers: boolean;
  editorIndentSize: 2 | 4;
  showXp: boolean;
  confirmReset: boolean;
}

export type SyncTheme =
  | 'green'
  | 'carbon'
  | 'violet'
  | 'crimson'
  | 'ocean';

export interface BootstrapSyncInput {
  version: 1;
  sourceLocalUserId: string;
  progress: SyncProgressData;
  preferences: SyncPreferences;
  theme: SyncTheme;
  exportedAt: string;
}

export interface UpdateSyncInput {
  version: 1;
  revision: number;
  progress: SyncProgressData;
  preferences: SyncPreferences;
  theme: SyncTheme;
}

export class SyncPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyncPayloadError';
  }
}

function fail(message: string): never {
  throw new SyncPayloadError(message);
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
  );
}

function validateKey(key: string): void {
  if (
    key.length === 0
    || key.length > 100
    || DANGEROUS_KEYS.has(key)
  ) {
    fail('O snapshot contém uma chave inválida.');
  }
}

function parseNumberRecord(
  value: unknown,
  label: string,
): Record<string, number> {
  if (!isObject(value)) {
    fail(`${label} deve ser um objeto.`);
  }

  const result: Record<string, number> = {};

  for (const [key, entry] of Object.entries(value)) {
    validateKey(key);

    if (
      typeof entry !== 'number'
      || !Number.isFinite(entry)
      || entry < 0
    ) {
      fail(`${label} contém um valor inválido.`);
    }

    result[key] = entry;
  }

  return result;
}

function parseLessonDone(
  value: unknown,
): Record<string, boolean> {
  if (!isObject(value)) {
    fail('lessonDone deve ser um objeto.');
  }

  const result: Record<string, boolean> = {};

  for (const [key, entry] of Object.entries(value)) {
    validateKey(key);

    if (!/^\d+$/.test(key) || typeof entry !== 'boolean') {
      fail('lessonDone contém um valor inválido.');
    }

    result[key] = entry;
  }

  return result;
}

function parsePerformance(
  value: unknown,
): Record<string, SyncPerformanceData> {
  if (!isObject(value)) {
    fail('performance deve ser um objeto.');
  }

  const result: Record<string, SyncPerformanceData> = {};

  for (const [key, entry] of Object.entries(value)) {
    validateKey(key);

    if (!isObject(entry)) {
      fail('performance contém um valor inválido.');
    }

    const attempts = entry.attempts;
    const failures = entry.failures;

    if (
      typeof attempts !== 'number'
      || typeof failures !== 'number'
      || !Number.isInteger(attempts)
      || !Number.isInteger(failures)
      || attempts < 0
      || failures < 0
      || failures > attempts
    ) {
      fail('performance contém tentativas/falhas inválidas.');
    }

    result[key] = {
      attempts,
      failures,
    };
  }

  return result;
}

function parseActivityDates(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    fail('activityDates deve ser uma lista.');
  }

  const result: string[] = [];

  for (const entry of value) {
    if (
      typeof entry !== 'string'
      || !/^\d{4}-\d{2}-\d{2}$/.test(entry)
    ) {
      fail('activityDates contém uma data inválida.');
    }

    result.push(entry);
  }

  return result;
}

function parseProgress(
  value: unknown,
): SyncProgressData {
  if (!isObject(value)) {
    fail('progress deve ser um objeto.');
  }

  const progressVersion = value.progressVersion;

  if (
    typeof progressVersion !== 'number'
    || !Number.isInteger(progressVersion)
    || progressVersion < 1
  ) {
    fail('progressVersion é inválida.');
  }

  return {
    done: parseNumberRecord(value.done, 'done'),
    hints: parseNumberRecord(value.hints, 'hints'),
    lessonDone: parseLessonDone(value.lessonDone),
    performance: parsePerformance(value.performance),
    activityDates: parseActivityDates(value.activityDates),
    progressVersion,
  };
}

function parsePreferences(
  value: unknown,
): SyncPreferences {
  if (!isObject(value)) {
    fail('preferences deve ser um objeto.');
  }

  const interfaceScale = value.interfaceScale;
  const editorFontSize = value.editorFontSize;
  const editorIndentSize = value.editorIndentSize;

  if (
    typeof interfaceScale !== 'string'
    || !INTERFACE_SCALES.has(interfaceScale)
  ) {
    fail('interfaceScale é inválida.');
  }

  if (
    typeof editorFontSize !== 'string'
    || !EDITOR_FONT_SIZES.has(editorFontSize)
  ) {
    fail('editorFontSize é inválido.');
  }

  if (
    editorIndentSize !== 2
    && editorIndentSize !== 4
  ) {
    fail('editorIndentSize é inválido.');
  }

  const booleanFields = [
    'reduceMotion',
    'highContrast',
    'editorLineWrapping',
    'editorLineNumbers',
    'showXp',
    'confirmReset',
  ] as const;

  for (const field of booleanFields) {
    if (typeof value[field] !== 'boolean') {
      fail(`${field} deve ser booleano.`);
    }
  }

  return {
    interfaceScale: interfaceScale as SyncPreferences['interfaceScale'],
    reduceMotion: value.reduceMotion as boolean,
    highContrast: value.highContrast as boolean,
    editorFontSize: editorFontSize as SyncPreferences['editorFontSize'],
    editorLineWrapping: value.editorLineWrapping as boolean,
    editorLineNumbers: value.editorLineNumbers as boolean,
    editorIndentSize,
    showXp: value.showXp as boolean,
    confirmReset: value.confirmReset as boolean,
  };
}

function parseTheme(
  value: unknown,
): SyncTheme {
  if (
    typeof value !== 'string'
    || !THEMES.has(value)
  ) {
    fail('theme é inválido.');
  }

  return value as SyncTheme;
}

function parseVersion(
  value: unknown,
): 1 {
  if (value !== 1) {
    fail('A versão do snapshot não é suportada.');
  }

  return 1;
}

function parseIsoTimestamp(
  value: unknown,
  label: string,
): string {
  if (
    typeof value !== 'string'
    || Number.isNaN(Date.parse(value))
  ) {
    fail(`${label} é inválido.`);
  }

  return value;
}

export function parseBootstrapSyncInput(
  value: unknown,
): BootstrapSyncInput {
  if (!isObject(value)) {
    fail('O payload de bootstrap é inválido.');
  }

  const sourceLocalUserId = value.sourceLocalUserId;

  if (
    typeof sourceLocalUserId !== 'string'
    || sourceLocalUserId.trim().length === 0
    || sourceLocalUserId.length > 200
  ) {
    fail('sourceLocalUserId é inválido.');
  }

  return {
    version: parseVersion(value.version),
    sourceLocalUserId: sourceLocalUserId.trim(),
    progress: parseProgress(value.progress),
    preferences: parsePreferences(value.preferences),
    theme: parseTheme(value.theme),
    exportedAt: parseIsoTimestamp(
      value.exportedAt,
      'exportedAt',
    ),
  };
}

export function parseUpdateSyncInput(
  value: unknown,
): UpdateSyncInput {
  if (!isObject(value)) {
    fail('O payload de sincronização é inválido.');
  }

  const revision = value.revision;

  if (
    typeof revision !== 'number'
    || !Number.isSafeInteger(revision)
    || revision < 1
  ) {
    fail('revision é inválida.');
  }

  return {
    version: parseVersion(value.version),
    revision,
    progress: parseProgress(value.progress),
    preferences: parsePreferences(value.preferences),
    theme: parseTheme(value.theme),
  };
}
