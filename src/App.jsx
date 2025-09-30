import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import  Root  from './Root'
import Login from './Login'
import Orders from './Orders'
import Products from './Products'



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

      
        <RouterProvider router={router}>
          {router}
        </RouterProvider>
      
    </>
  );
   
}

export default App
