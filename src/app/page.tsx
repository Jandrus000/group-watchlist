'use client';

import styles from './page.module.css';
import Modal from './components/Modal';
import { useState } from 'react';
import { useAuthContext } from './context/AuthContext';
import { useUserWatchlist } from './hooks/useUserWatchlist';
import WatchlistDelete from './components/WatchlistDelete';
import Image from 'next/image';
import { useSavedWatchlists } from './hooks/useSavedWatchlists';
import { ToastContainer, toast } from 'react-toastify';
import { useWatchlistItems } from './hooks/useWatchlistItems';
import { toggleSave } from './lib/firebase/firestore';


export default function Home() {
    const { user } = useAuthContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [watchlistName, setWatchlistName] = useState('');
    const [wlDescription, setWlDescription] = useState('');
    const { watchlists, loading, addWatchlist } = useUserWatchlist(user);
    const { savedWatchlists, savedWatchlistsLoading } = useSavedWatchlists();

    const handleCreateWatchlist = async () => {
        if (watchlistName.trim() !== '') {
            await addWatchlist(watchlistName.trim(), wlDescription);
            setWatchlistName('');
            setWlDescription('');
            setIsModalOpen(false);
        }
    };

    return (
        <div className={styles.mainWatchlistContent}>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
            <div className={styles.addWatchlistButton}>
                <button onClick={() => setIsModalOpen(true)}>
                    <Image src={'/plus.svg'} alt={'+'} width={15} height={10} />
                </button>
                <span>Add a watchlist</span>
            </div>
            <Modal isOpen={isModalOpen}>
                {user ? (
                    <>
                        <label htmlFor="watchlist-name">
                            Enter Watchlist Name
                        </label>
                        <input
                            id="watchlist-name"
                            type="text"
                            value={watchlistName}
                            onChange={(e) => setWatchlistName(e.target.value)}
                            required
                        ></input>

                        <label htmlFor="watchlist-description">
                            Enter Description
                        </label>
                        <textarea
                            id="watchlist-description"
                            onChange={(e) => setWlDescription(e.target.value)}
                            maxLength={400}
                        ></textarea>

                        <button onClick={handleCreateWatchlist}>Create</button>
                        <button onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsModalOpen(false)}>X</button>
                        <p>You should sign in so what you do can be saved</p>
                    </>
                )}
            </Modal>
            {loading ? (
                <div>loading...</div>
            ) : (
                <div>
                    <h2>My Watchlists</h2>
                    {watchlists.map((w) => (
                        <div className={styles.watchlistCard} key={w.id}>
                            <a href={`\\watchlists\\${w.id}`}>
                                <h4>{w.name}</h4>
                                <p>{w.description}</p>
                            </a>

                            <div>
                                <WatchlistDelete watchlist={w} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!savedWatchlistsLoading && user &&
                Object.keys(savedWatchlists).length > 0 && (
                    <>
                        <h2>Saved Watchlists</h2>
                        {Object.keys(savedWatchlists).map((w) => (
                            <div className={styles.watchlistCard} key={w}>
                                <a href={`\\watchlists\\${w}`}>
                                    <h4>{savedWatchlists[w].name}</h4>
                                    <p>{savedWatchlists[w].description}</p>
                                </a>

                                <div>
                                    <Image
                                        onClick={async () => {
                                            toast(
                                                w in savedWatchlists
                                                    ? 'Removing Watchlist from saved Watchlists'
                                                    : 'Saved Watchlist!',
                                                {
                                                    position: 'top-center',
                                                    autoClose: 5000,
                                                    hideProgressBar: true,
                                                    closeOnClick: false,
                                                    pauseOnHover: false,
                                                    draggable: true,
                                                    progress: undefined,
                                                    theme: 'light',
                                                }
                                            );
                                            await toggleSave(user.uid, w, savedWatchlists[w].name, savedWatchlists[w].description)
                                        }}
                                        src={
                                            w in savedWatchlists
                                                ? '/bookmarked.svg'
                                                : '/bookmark.svg'
                                        }
                                        alt={'Save Watchlist'}
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            <div>
                <h2></h2>
            </div>
        </div>
    );
}
