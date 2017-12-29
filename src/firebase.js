import { initializeApp } from 'firebase'

const app = initializeApp({
  // Production
  apiKey: 'AIzaSyD8qPeNw5huGbuJQa8uxN0VAbvdS-Tk_bU',
  authDomain: 'rolling-bef53.firebaseapp.com',
  databaseURL: 'https://rolling-bef53.firebaseio.com',
  projectId: 'rolling-bef53',
  storageBucket: '',
  messagingSenderId: '169834981434'

  // Development
  // apiKey: "AIzaSyC2cOsruZKKhAGawQk5Edyv_GKA5101xl8",
  // authDomain: "rolling2-5553e.firebaseapp.com",
  // databaseURL: "https://rolling2-5553e.firebaseio.com",
  // projectId: "rolling2-5553e",
  // storageBucket: "",
  // messagingSenderId: "913478471939"
})

export const db = app.database()
export const stationsRef = db.ref('stations')
export const settingsRef = db.ref('settings')
export const drawnNumbersRef = db.ref('drawnNumbers')
export const actionsRef = db.ref('actions')
