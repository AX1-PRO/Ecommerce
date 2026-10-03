import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from './store/index.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import {BrowserRouter} from "react-router"
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
       <App />
      </BrowserRouter>
    </Provider>
)
