import React from "react"
import globals from "./globals.css"
import Header from "./components/Header"
import Table from './components/Table'
import HomePage from "./components/HomePage"

export default function Home() {
  return (
    <main className="">
      <div className='halfBackground'>
        <Header />
        <HomePage />

      </div>
    </main>
  )
}
