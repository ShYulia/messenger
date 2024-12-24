import {  useContext } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider,UserContext } from './context/userContext';
import { BrowserRouter} from 'react-router-dom';
 import { SocketProvider } from './context/socketContext';



const Root = () => {
 

  return (
      <UserProvider>
         
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          
      </UserProvider>
  );
};

createRoot(document.getElementById('root')).render(<Root />);