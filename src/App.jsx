import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root'
import Clienti from './Login'
import Produse from './Orders'
import Comenzi from './Products'
import Galerie from './Baschet'
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
