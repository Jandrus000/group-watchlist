"use client"

import Image from "next/image"
import AuthLink from "./AuthLink"
import Link from "next/link"

export default function Header(){
    return(
    <header>
        <div>
            <Link href={"/"}>
                <div id="logo">
                    <h1>GroupWatchlist</h1>
                    <Image
                        src='/movie-film-roll-for-movie.svg'
                        width={50}
                        height={50}
                        alt=""
                    />
                </div>
            </Link>
        </div>

        <AuthLink/>
        </header>
    )
}