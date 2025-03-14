import axios from 'axios'
import * as XLSX from 'xlsx'

// Funkcija za dohvaćanje narudžbi iz Wix API-ja
// Prima credentials objekt koji sadrži ili API ključ ili session cookie
export async function fetchOrders(credentials) {
  try {
    let headers = {}
    
    // Postavljanje zaglavlja ovisno o načinu autentifikacije
    if (credentials.type === 'api') {
      headers = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'wix-site-id': credentials.siteId,
        'Content-Type': 'application/json'
      }
    } else {
      // Korištenje session cookie-ja za autentifikaciju
      headers = {
        'Cookie': credentials.sessionCookie
      }
    }

    const requestBody = {
      "query": {}
    };
    
    // Slanje GET zahtjeva na Wix API endpoint za narudžbe
    const response = await axios.post(
      `https://www.wixapis.com/stores/v1/orders`, 
      requestBody, 
      { headers })

    return response.data.orders
  } catch (error) {
    throw new Error('Failed to fetch orders from Wix')
  }
}

// TEST
export async function fetchProducts(credentials) {
  try {
    let headers = {}
    
    // Postavljanje zaglavlja ovisno o načinu autentifikacije
    if (credentials.type === 'api') {
      headers = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'wix-site-id': credentials.siteId,
        'Content-Type': 'application/json'
      }
    } else {
      // Korištenje session cookie-ja za autentifikaciju
      headers = {
        'Cookie': credentials.sessionCookie
      }
    }

    const requestBody = {
      "query": {}
    };
    
    // Slanje GET zahtjeva na Wix API endpoint za narudžbe
    const response = await axios.post(
      `https://www.wixapis.com/stores/v1/products/query`, 
      requestBody, 
      { headers })

    return response.data.products
  } catch (error) {
    throw new Error('Failed to fetch products from Wix')
  }
}

// Funkcija za izvoz narudžbi u Excel datoteku
// Prima polje narudžbi i kreira Excel datoteku s formatiranim podacima
export function exportToExcel(orders) {
  try {
    // Mapiranje podataka narudžbi u format pogodan za Excel
    const excelData = orders.map(order => ({
      'Order ID': order.id,
      'Customer Name': `${order.buyerInfo.firstName} ${order.buyerInfo.lastName}`,
      'Email': order.buyerInfo.email,
      'Total': order.totals.total,
      'Status': order.status,
      'Date': new Date(order.dateCreated).toLocaleDateString()
    }))

    // Kreiranje Excel radnog lista i dodavanje podataka
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

    // Spremanje Excel datoteke
    XLSX.writeFile(workbook, 'wix-orders.xlsx')
  } catch (error) {
    throw new Error('Failed to export orders to Excel')
  }
}

// Funkcija za prijavu korisnika putem Wix login prozora
// Otvara popup prozor za prijavu i vraća session cookie nakon uspješne prijave
export async function loginWithWix() {
  try {
    // Otvaranje Wix login prozora
    const wixLoginWindow = window.open(
      'https://www.wix.com/login',
      'WixLogin',
      'width=800,height=600'
    )

    // Čekanje na odgovor od login prozora
    return new Promise((resolve, reject) => {
      window.addEventListener('message', function(event) {
        if (event.origin === 'https://www.wix.com') {
          if (event.data.type === 'WIX_LOGIN_SUCCESS') {
            resolve(event.data.sessionCookie)
          } else if (event.data.type === 'WIX_LOGIN_ERROR') {
            reject(new Error('Login failed'))
          }
        }
      })
    })
  } catch (error) {
    throw new Error('Login failed')
  }
}