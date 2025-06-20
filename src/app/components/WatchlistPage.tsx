'use client';

import { useAuthContext } from '@/app/context/AuthContext';
import Image from 'next/image';
import styles from '../page.module.css';
import { useState } from 'react';
import { useWatchlistItems } from '../hooks/useWatchlistItems';
import ListItem from './ListItem';
import { Watchlist } from '../hooks/useUserWatchlist';
import AddWatchlistModal from './AddWatchlistModal';

export default function WatchlistPage({ watchlist }: { watchlist: Watchlist }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user, loading } = useAuthContext();

    const { items, upVote, downVote } = useWatchlistItems(watchlist.id);
    const containsWatched = items.some((item) => item.watched);

    if (loading) {
        return (
            <Image src="/loading.gif" alt="loading" width={100} height={100} />
        );
    }
    if (!user) {
        return <div>Please sign in to view this page</div>;
    }

    return (
        <div>
            <AddWatchlistModal
                watchlist={watchlist}
                user={user}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
            <h1>{watchlist.name}</h1>
            <p>{watchlist.description}</p>
            <div className={styles.addWatchlistButton}>
                <button onClick={() => setIsModalOpen(true)}>
                    <Image src={'/plus.svg'} alt={'+'} width={15} height={10} />
                </button>
                <span>Add a movie/show</span>
            </div>
            <div className={styles.watchlistItems}>
                {items.map((item) => {
                    if (!item.watched) {
                        return (
                            <ListItem
                                key={item.id}
                                item={item}
                                upVote={upVote}
                                downVote={downVote}
                                watched={false}
                            />
                        );
                    }
                })}
            </div>
            {containsWatched && <hr />}
            <div className={styles.watchlistItems}>
                {items.map((item) => {
                    if (item.watched) {
                        return (
                            <ListItem
                                key={item.id}
                                item={item}
                                upVote={upVote}
                                downVote={downVote}
                                watched={true}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
}
