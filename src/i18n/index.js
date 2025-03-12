import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Definicija prijevoda za hrvatski i engleski jezik
const resources = {
  hr: {
    translation: {
      title: 'Wix izvoznik narudžbi',
      exportButton: 'Izvezi narudžbe u Excel',
      exporting: 'Izvoz u tijeku...',
      error: 'Greška',
      loginTitle: 'Prijava',
      loginButton: 'Prijavi se u Wix',
      orText: 'ili',
      apiKeyTitle: 'Koristi API ključ',
      apiKeyLabel: 'API ključ',
      siteIdLabel: 'ID stranice',
      saveButton: 'Spremi',
      languageSwitch: 'Switch to English',
      fetchError: 'Greška pri dohvaćanju narudžbi',
      exportError: 'Greška pri izvozu u Excel',
      loginError: 'Greška pri prijavi',
      successMessage: 'Uspješno izvezeno!'
    }
  },
  en: {
    translation: {
      title: 'Wix Orders Exporter',
      exportButton: 'Export Orders to Excel',
      exporting: 'Exporting...',
      error: 'Error',
      loginTitle: 'Login',
      loginButton: 'Login with Wix',
      orText: 'or',
      apiKeyTitle: 'Use API Key',
      apiKeyLabel: 'API Key',
      siteIdLabel: 'Site ID',
      saveButton: 'Save',
      languageSwitch: 'Prebaci na Hrvatski',
      fetchError: 'Failed to fetch orders',
      exportError: 'Failed to export to Excel',
      loginError: 'Login failed',
      successMessage: 'Export successful!'
    }
  }
};

// Inicijalizacija i18next s postavkama
i18n
  .use(LanguageDetector) // Detekcija jezika preglednika
  .use(initReactI18next) // Povezivanje s React-om
  .init({
    resources,
    fallbackLng: 'hr', // Zadani jezik ako nije moguće detektirati
    interpolation: {
      escapeValue: false // React već escapea stringove
    }
  });

export default i18n;