import { createElement, type CSSProperties, type ReactNode } from 'react';
import type { Locale } from 'react-joyride';

type LocaleKey = 'de' | 'en' | 'es' | 'fr' | 'pt';

const progressStyle: CSSProperties = {
  fontSize: '0.8125em',
  fontWeight: 500,
  letterSpacing: '0.01em',
  opacity: 0.72,
};

function nextWithProgress(label: string, ofWord: string): ReactNode {
  return createElement(
    'span',
    null,
    `${label} `,
    createElement('span', { style: progressStyle }, `({current} ${ofWord} {total})`),
  );
}

const localeStrings = {
  de: {
    back: 'Zurück',
    close: 'Schließen',
    last: 'Zuletzt',
    next: 'Nächster',
    nextWithProgress: 'Nächster ({current} von {total})',
    open: 'Öffnet den Dialog',
    skip: 'Überspringen',
  },
  en: {
    back: 'Back',
    close: 'Close',
    last: 'Last',
    next: 'Next',
    nextWithProgress: 'Next ({current} of {total})',
    open: 'Open the dialog',
    skip: 'Skip',
  },
  es: {
    back: 'Espalda',
    close: 'Cerrar',
    last: 'Último',
    next: 'Siguiente',
    nextWithProgress: 'Siguiente ({current} de {total})',
    open: 'Abre el dialogo',
    skip: 'Omitir',
  },
  fr: {
    back: 'Retour',
    close: 'Fermer',
    last: 'Dernier',
    next: 'Suivant',
    nextWithProgress: 'Suivant ({current} de {total})',
    open: 'Ouvrir le dialogue',
    skip: 'Sauter',
  },
  pt: {
    back: 'Voltar',
    close: 'Fechar',
    last: 'Último',
    next: 'Próximo',
    nextWithProgress: 'Próximo ({current} de {total})',
    open: 'Abrir o diálogo',
    skip: 'Pular',
  },
} as const;

export const localeMessages: Record<LocaleKey, Locale> = {
  de: {
    ...localeStrings.de,
    nextWithProgress: nextWithProgress('Nächster', 'von'),
  },
  en: {
    ...localeStrings.en,
    nextWithProgress: nextWithProgress('Next', 'of'),
  },
  es: {
    ...localeStrings.es,
    nextWithProgress: nextWithProgress('Siguiente', 'de'),
  },
  fr: {
    ...localeStrings.fr,
    nextWithProgress: nextWithProgress('Suivant', 'de'),
  },
  pt: {
    ...localeStrings.pt,
    nextWithProgress: nextWithProgress('Próximo', 'de'),
  },
};

export const intlMessages: Record<LocaleKey, Record<string, string>> = {
  de: {
    ...localeStrings.de,
    openTooltip: 'Tooltip öffnen',
    prev: 'Zurück',
    reset: 'Zurücksetzen',
    restart: 'Starten Sie die Tour neu',
    start: 'Starten',
    stop: 'Stoppen',
  },
  en: {
    ...localeStrings.en,
    openTooltip: 'Open Tooltip',
    prev: 'Prev',
    reset: 'Reset',
    restart: 'Restart the tour',
    start: 'Start',
    stop: 'Stop',
  },
  es: {
    ...localeStrings.es,
    openTooltip: 'Abrir tooltip',
    prev: 'Anterior',
    reset: 'Restablecer',
    restart: 'Reiniciar el tour',
    start: 'Iniciar',
    stop: 'Detener',
  },
  fr: {
    ...localeStrings.fr,
    openTooltip: 'Ouvrir le tooltip',
    prev: 'Précédent',
    reset: 'Réinitialiser',
    restart: 'Redémarrer le tour',
    start: 'Démarrer',
    stop: 'Arrêter',
  },
  pt: {
    ...localeStrings.pt,
    openTooltip: 'Abrir o tooltip',
    prev: 'Anterior',
    reset: 'Redefinir',
    restart: 'Reiniciar o tour',
    start: 'Iniciar',
    stop: 'Parar',
  },
};

export const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
  { label: 'Português', value: 'pt' },
] as const;

export type { LocaleKey };
