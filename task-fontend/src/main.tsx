import React from 'react'
import ReactDOM from 'react-dom/client'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import './index.css'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import Router from './router'

const queyClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queyClient}>
      <Router/>
      <ReactQueryDevtools/>
    </QueryClientProvider>
  </React.StrictMode>,
)
