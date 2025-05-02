import Image from 'next/image';
import './globals.css';

export default function RootLayout({children}:{children: React.ReactNode}) {
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
        <header>
          <div>
            <div id="logo">
              <h1>GroupWatchlist</h1>
              <Image
                src='/movie-film-roll-for-movie.svg'
                width={50}
                height={50}
                alt=""
              />
            </div>
          </div>

          <div id="profile-nav">
            <Image
              src='/profile-round-1342.svg'
              width={25}
              height={25}
              alt=""
            />
            <a href="">Sign up / Log in</a>
          </div>
        </header>

        {children}

        <footer>
          <ul>
            <li><a href="">Report an Issue</a></li>
            <li><a href="">About Me</a></li>
            <li><a href="">About GroupWatchlist</a></li>
          </ul>
        </footer>
      </body>
    </html>
  );
}
