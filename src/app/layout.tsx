"use client"

import Footer from './components/Footer';
import Header from './components/Header';
import './styles/globals.css';
import {ReactNode, createContext} from 'react';
import { AuthProvider } from './context/AuthContext';

const AuthContext = createContext(null);


export default function RootLayout({children}:{children: ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="ico"
          href="./favicon.ico"
          sizes='any'
        />
      </head>
      <body>
        <AuthProvider>
          <Header/>
          <main>
            {children}  
          </main>

          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
