import { initializeApp } from 'firebase'

const app = initializeApp({
  apiKey: 'AIzaSyD8qPeNw5huGbuJQa8uxN0VAbvdS-Tk_bU',
  authDomain: 'rolling-bef53.firebaseapp.com',
  databaseURL: 'https://rolling-bef53.firebaseio.com',
  projectId: 'rolling-bef53',
  storageBucket: '',
  messagingSenderId: '169834981434'
})

export const db = app.database()
export const settingsRef = db.ref('settings')
export const drawnNumbersRef = db.ref('drawnNumbers')
export const actionsRef = db.ref('actions')
