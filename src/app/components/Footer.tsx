"use client"

import Link from "next/link"

export default function Footer(){
    return (
        <footer>
          <ul>
            <li><Link href="/">Home</Link></li>

            <li><a href="/about">About</a></li>
          </ul>
        </footer>
    )
}