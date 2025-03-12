import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MdLanguage } from 'react-icons/md'
import { fetchOrders, exportToExcel, loginWithWix } from './utils'
import './i18n'
import './App.css'

// Glavna komponenta aplikacije
function App() {
  // Inicijalizacija prijevoda
  const { t, i18n } = useTranslation()
  
  // State varijable za upravljanje stanjem aplikacije
  const [loading, setLoading] = useState(false) // Indikator učitavanja
  const [error, setError] = useState(null) // Poruka o grešci
  const [credentials, setCredentials] = useState(null) // Podaci za autentifikaciju
  const [apiKey, setApiKey] = useState('') // API ključ
  const [siteId, setSiteId] = useState('') // ID Wix stranice
  const [successMessage, setSuccessMessage] = useState('') // Poruka o uspjehu

  // Učitavanje spremljenih podataka za autentifikaciju pri pokretanju
  useEffect(() => {
    // Provjera jesmo li u Chrome ekstenziji
    if (typeof chrome !== 'undefined' && chrome.storage) {
      // Dohvaćanje spremljenih podataka iz Chrome storage-a
      chrome.storage.local.get(['credentials'], (result) => {
        if (result.credentials) {
          setCredentials(result.credentials)
        }
      })
    }
  }, [])

  // Funkcija za promjenu jezika
  const handleLanguageSwitch = () => {
    const newLang = i18n.language === 'hr' ? 'en' : 'hr'
    i18n.changeLanguage(newLang)
  }

  // Funkcija za spremanje API ključa
  const handleApiKeySave = () => {
    const newCredentials = {
      type: 'api',
      apiKey,
      siteId
    }
    setCredentials(newCredentials)
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ credentials: newCredentials })
    }
  }

  // Funkcija za prijavu putem Wix-a
  const handleWixLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      const sessionCookie = await loginWithWix()
      const newCredentials = {
        type: 'session',
        sessionCookie
      }
      setCredentials(newCredentials)
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ credentials: newCredentials })
      }
      setLoading(false)
    } catch (err) {
      setError(t('loginError'))
      setLoading(false)
    }
  }

  // Funkcija za izvoz narudžbi
  const handleExport = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccessMessage('')
      
      // Dohvaćanje narudžbi
      const orders = await fetchOrders(credentials)
      
      // Sortiranje narudžbi po imenu kupca
      const sortedOrders = orders.sort((a, b) => 
        a.buyerInfo.firstName.localeCompare(b.buyerInfo.firstName)
      )
      
      // Izvoz u Excel
      await exportToExcel(sortedOrders)
      
      setSuccessMessage(t('successMessage'))
      setLoading(false)
    } catch (err) {
      setError(t('fetchError'))
      setLoading(false)
    }
  }

  // Prikaz forme za prijavu ako korisnik nije prijavljen
  if (!credentials) {
    return (
      <div className="container">
        <button 
          onClick={handleLanguageSwitch} 
          className="language-switch"
          title={t('languageSwitch')}
        >
          <MdLanguage size={24} />
        </button>
        
        <h1>{t('loginTitle')}</h1>
        
        <button 
          onClick={handleWixLogin}
          disabled={loading}
          className="login-button"
        >
          {t('loginButton')}
        </button>

        <div className="divider">
          <span>{t('orText')}</span>
        </div>

        <div className="api-form">
          <h2>{t('apiKeyTitle')}</h2>
          <div className="form-group">
            <label>{t('apiKeyLabel')}</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{t('siteIdLabel')}</label>
            <input
              type="text"
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
            />
          </div>
          <button 
            onClick={handleApiKeySave}
            className="save-button"
          >
            {t('saveButton')}
          </button>
        </div>

        {error && (
          <div className="error">
            {t('error')}: {error}
          </div>
        )}
      </div>
    )
  }

  // Prikaz glavnog sučelja nakon prijave
  return (
    <div className="container">
      <button 
        onClick={handleLanguageSwitch} 
        className="language-switch"
        title={t('languageSwitch')}
      >
        <MdLanguage size={24} />
      </button>
      
      <h1>{t('title')}</h1>
      
      <button 
        onClick={handleExport}
        disabled={loading}
        className="export-button"
      >
        {loading ? t('exporting') : t('exportButton')}
      </button>
      
      {error && (
        <div className="error">
          {t('error')}: {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success">
          {successMessage}
        </div>
      )}
    </div>
  )
}

export default App