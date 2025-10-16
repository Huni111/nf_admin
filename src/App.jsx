import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root'
import Login from './Login'
import Orders from './Orders'
import Products from './Products'
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
          element: <Login />
        },
        {
          path: '/orders',
          element: <Orders />
        },
        {
          path: '/products',
          element: <Products />
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
