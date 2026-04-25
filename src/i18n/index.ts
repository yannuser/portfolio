import en from './en.json'
import fr from './fr.json'

export type Lang = 'en' | 'fr'
export type Translations = typeof en

const locales: Record<Lang, Translations> = { en, fr }

export function useTranslations(lang: Lang): Translations {
  return locales[lang]
}
