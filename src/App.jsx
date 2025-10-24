import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root'
import Clienti from './Clienti'
import Produse from './Produse'
import Comenzi from './Comenzi'
import Galerie from './Galerie'
import { AuthProvider } from '../contexts/AuthContext'
import { DataBaseProvider } from '../contexts/DataBaseContext'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Clienti />
        },
        {
          path: '/orders',
          element: <Produse />
        },
        {
          path: '/products',
          element: <Comenzi />
        },
        {
          path: '/cart',
          element: <Galerie />
        },
        {
          path: '/admin',
          element: <Galerie />
        },

      ]
    }
  ]);

  return (
    <>


      <AuthProvider>
        <DataBaseProvider>
          <RouterProvider router={router}>
            {router}
          </RouterProvider>
        </DataBaseProvider>
      </AuthProvider>

    </>
  );

}

export default App
