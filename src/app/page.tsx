'use client';

import styles from './styles/page.module.css';
import Modal from './components/Modal';
import { useState } from 'react';
import { useAuthContext } from './context/AuthContext';
import { useUserWatchlist } from './hooks/useUserWatchlist';
import WatchlistDelete from './components/WatchlistDelete';
import Image from 'next/image';
import { useSavedWatchlists } from './hooks/useSavedWatchlists';
import { ToastContainer, toast } from 'react-toastify';
import { toggleSave } from './lib/firebase/firestore';

export default function Home() {
    const { user } = useAuthContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [watchlistName, setWatchlistName] = useState('');
    const [wlDescription, setWlDescription] = useState('');
    const [wlType, setWlType] = useState<'public' | 'private'>('public');
    const { watchlists, loading, addWatchlist } = useUserWatchlist(user);
    const { savedWatchlists, savedWatchlistsLoading } = useSavedWatchlists();

    const handleCreateWatchlist = async () => {
        if (watchlistName.trim() !== '') {
            setIsModalOpen(false);
            try {
                await addWatchlist(watchlistName.trim(), wlDescription, wlType);
                toast('Successfully added Watchlist!', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                });
            } catch (e) {
                toast.error('There was a problem adding your watchlist...', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                });
            }
            setWatchlistName('');
            setWlDescription('');
            setWlDescription('public');
        }
    };
    // console.log(watchlists)

    return (
        <div>
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
            <div className={styles.addButton}>
                <button onClick={() => setIsModalOpen(true)}>
                    <Image src={'/plus.svg'} alt={'+'} width={25} height={25} />
                </button>
                <span>Add a watchlist</span>
            </div>
            <Modal isOpen={isModalOpen}>
                <button
                    className="x-button"
                    onClick={() => setIsModalOpen(false)}
                >
                    <Image
                        src={'/cross.svg'}
                        alt={'close'}
                        width={20}
                        height={20}
                    />
                </button>
                {user ? (
                    <>
                        <h3 className="form-header">Add a Watchlist</h3>

                        <form
                            className="form"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <label htmlFor="watchlist-name">
                                Watchlist Name
                            </label>
                            <input
                                id="watchlist-name"
                                type="text"
                                value={watchlistName}
                                onChange={(e) =>
                                    setWatchlistName(e.target.value)
                                }
                                required
                            ></input>

                            <label htmlFor="watchlist-type">Type</label>
                            <select
                                id="watchlist-type"
                                value={wlType}
                                onChange={(e) =>
                                    setWlType(
                                        e.target.value as 'public' | 'private'
                                    )
                                }
                            >
                                <option value={'public'}>Public</option>
                                <option value={'private'}>Private</option>
                            </select>
                            <span className="form-subtitle">
                                {wlType === 'public'
                                    ? 'Anyone with the link for your watchlist can view, interact with, edit, and delete anything inside your watchlist. Be careful who you share the link with.'
                                    : 'No one will be able to access your watchlist but you'}
                            </span>

                            <label htmlFor="watchlist-description">
                                Description
                            </label>
                            <textarea
                                id="watchlist-description"
                                onChange={(e) =>
                                    setWlDescription(e.target.value)
                                }
                                maxLength={400}
                            ></textarea>

                            <button
                                onClick={handleCreateWatchlist}
                                className="submit-button"
                            >
                                Create
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <p>You should sign in so what you do can be saved</p>
                    </>
                )}
            </Modal>
            {loading ? (
                <div>loading...</div>
            ) : (
                <div>
                    {watchlists.length > 0 ? (
                        <h2 className={styles.titleHeader}>My Watchlists</h2>
                    ) : (
                        <h2 className={styles.titleHeader}>Watchlist you add go here...</h2>
                    )}
                    <div className={styles.watchlistGrid}>
                        {watchlists.map((w) => (
                            <div key={w.id} className={styles.watchlistCard}>
                                <div className={styles.watchlistCardFlex}>
                                    <a
                                        className={styles.watchlistLinks}
                                        href={`\\watchlists\\${w.id}`}
                                    >
                                        <h4>{w.name}</h4>
                                    </a>
                                    <div>
                                        <WatchlistDelete watchlist={w} />
                                    </div>
                                </div>
                                <a
                                    className={styles.watchlistLinks}
                                    href={`\\watchlists\\${w.id}`}
                                >
                                    <p>{w.description}</p>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!savedWatchlistsLoading &&
                user &&
                Object.keys(savedWatchlists).length > 0 && (
                    <>
                        <h2 className={styles.titleHeader}>Saved Watchlists</h2>
                        <div className={styles.watchlistGrid}>
                            {Object.keys(savedWatchlists).map((w) => (
                                <div
                                    key={w}
                                    className={styles.watchlistCard}
                                >
                                    <div className={styles.watchlistCardFlex}>
                                        <a
                                            className={styles.watchlistLinks}
                                            href={`\\watchlists\\${w}`}
                                        >
                                            <h4>{savedWatchlists[w].name}</h4>
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
                                                    theme: 'dark',
                                                }
                                            );
                                            await toggleSave(
                                                user.uid,
                                                w,
                                                savedWatchlists[w].name,
                                                savedWatchlists[w].description
                                            );
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
                                    <a
                                        className={styles.watchlistLinks}
                                        href={`\\watchlists\\${w}`}
                                    >
                                        <p>{savedWatchlists[w].description}</p>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </>
                )}
        </div>
    );
}
