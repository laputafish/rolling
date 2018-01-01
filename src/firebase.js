import { initializeApp } from 'firebase'

let config = {}

if (process.env.NODE_ENV === 'development') {
  config = {
    apiKey: 'AIzaSyC2cOsruZKKhAGawQk5Edyv_GKA5101xl8',
    authDomain: 'rolling2-5553e.firebaseapp.com',
    databaseURL: 'https://rolling2-5553e.firebaseio.com',
    projectId: 'rolling2-5553e',
    storageBucket: '',
    messagingSenderId: '913478471939'
  }
} else {
  config = {
    apiKey: 'AIzaSyD8qPeNw5huGbuJQa8uxN0VAbvdS-Tk_bU',
    authDomain: 'rolling-bef53.firebaseapp.com',
    databaseURL: 'https://rolling-bef53.firebaseio.com',
    projectId: 'rolling-bef53',
    storageBucket: '',
    messagingSenderId: '169834981434'
  }
}
const app = initializeApp(config)
const db = app.database()
const settingsRef = db.ref('settings')

function validateUser (user, authHandler) {
  console.log('validateuser')
  // user { userId, password }
  if (typeof authHandler !== 'undefined') {
    console.log('with authHandler')
    settingsRef.child('panels').once('value', (snapshot) => {
      let values = snapshot.val()
      console.log('values: ', values)
      console.log('values.panelName = ' + values.panelName)
      console.log('values.panelCode = ' + values.panelCode)
      console.log('user.userId = ' + user.userId)
      console.log('user.password = ' + user.password)
      let userId = values.panelName ? values.panelName : ''
      let password = String(values.panelCode ? values.panelCode : '')
      console.log('userId = ' + userId)
      console.log('password = ' + password)
      console.log('userId === user.userId: ' + (userId === user.userId))
      console.log('password === user.password: ' + (password === user.password))
      console.log('typeof password = ' + (typeof password))
      console.log('typeof user.password = ' + (typeof user.password))
      let result = (userId === user.userId) && (password === user.password)
      console.log('result = ' + (result ? 'true' : 'false'))
      authHandler(result)
    })
  }
}

export const stationsRef = db.ref('stations')
export const drawnNumbersRef = db.ref('drawnNumbers')
export const actionsRef = db.ref('actions')
export const commandsRef = db.ref('commands')
export const controlPanelsRef = db.ref('controlPanels')
export {
  db,
  validateUser,
  settingsRef
}
