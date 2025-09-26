'use client';

import styles from './styles/page.module.css';
import Image from 'next/image';

export default function Home() {
    return (
        <article>
            <h1>About GroupWatchlist</h1>
            <div>
                <div className="video-container">
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/g8zLvdWNVqU?si=IAYRBAKoNUpZVqR6"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
                <p>
                    Hi, I’m Jaron 😁. I built <strong>GroupWatchlist</strong> as
                    my senior project to sharpen my skills as a
                    developer—especially working with React and building a
                    backend with Firebase. It’s also a tool I use personally
                    with family and friends to decide what movie to watch
                    together.
                </p>
                <p>With GroupWatchlist you can:</p>
                <ul>
                    <li>Sign in securely</li>
                    <li>Create and manage watchlists</li>
                    <li>Add items to any list</li>
                    <li>Share lists with others</li>
                    <li>Vote on items to help the group choose</li>
                    <li>Filter and sort lists</li>
                    <li>Randomly select an item</li>
                    <li>Check off items you’ve watched</li>
                    <li>Make a list private when needed</li>
                </ul>
                <p>
                    The project is a work in progress, and I’m planning several
                    improvements:
                </p>
                <ul>
                    <li>
                        Refine the design and make the site fully responsive on
                        mobile
                    </li>
                    <li>
                        Integrate a movie database/API so items can be added
                        automatically
                    </li>
                    <li>
                        Add clearer sharing options and user-guides to improve
                        accessibility
                    </li>
                    <li>
                        Enhance performance, security, and maintainability
                        behind the scenes
                    </li>
                </ul>
            </div>
        </article>
    );
}
