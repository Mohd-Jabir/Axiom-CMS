import { createRoot } from 'react-dom/client'
import './index.css'

import Providers from './app/providers.jsx'
import router from './app/router'
import { RouterProvider } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
    <Providers>
    <RouterProvider router={router}/>
    </Providers>
)
