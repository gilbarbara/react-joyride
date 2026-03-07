import type { Locale } from 'react-joyride';

type LocaleKey = 'de' | 'en' | 'es' | 'fr' | 'pt';

export const localeMessages: Record<LocaleKey, Locale> = {
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
};

export const intlMessages: Record<LocaleKey, Record<string, string>> = {
  de: {
    ...localeMessages.de,
    openTooltip: 'Tooltip öffnen',
    prev: 'Zurück',
    reset: 'Zurücksetzen',
    restart: 'Starten Sie die Tour neu',
    start: 'Starten',
    stop: 'Stoppen',
  } as Record<string, string>,
  en: {
    ...localeMessages.en,
    openTooltip: 'Open Tooltip',
    prev: 'Prev',
    reset: 'Reset',
    restart: 'Restart the tour',
    start: 'Start',
    stop: 'Stop',
  } as Record<string, string>,
  es: {
    ...localeMessages.es,
    openTooltip: 'Abrir tooltip',
    prev: 'Anterior',
    reset: 'Restablecer',
    restart: 'Reiniciar el tour',
    start: 'Iniciar',
    stop: 'Detener',
  } as Record<string, string>,
  fr: {
    ...localeMessages.fr,
    openTooltip: 'Ouvrir le tooltip',
    prev: 'Précédent',
    reset: 'Réinitialiser',
    restart: 'Redémarrer le tour',
    start: 'Démarrer',
    stop: 'Arrêter',
  } as Record<string, string>,
  pt: {
    ...localeMessages.pt,
    openTooltip: 'Abrir tooltip',
    prev: 'Anterior',
    reset: 'Redefinir',
    restart: 'Reiniciar o tour',
    start: 'Iniciar',
    stop: 'Parar',
  } as Record<string, string>,
};

export const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
  { label: 'Português', value: 'pt' },
] as const;

export type { LocaleKey };
