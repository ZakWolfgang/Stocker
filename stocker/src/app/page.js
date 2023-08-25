import React from "react"
import globals from "./globals.css"
import Header from "./components/Header"
import Table from './components/Table'

export default function Home() {
  return (
    <main className="">
      <div className='halfBackground'>
        <Header />
        <Table />

      </div>
    </main>
  )
}
