'use client';

import { useAuthContext } from '@/app/context/AuthContext';
import Image from 'next/image';
import styles from '../page.module.css';
import { useState, useMemo } from 'react';
import { useWatchlistItems } from '../hooks/useWatchlistItems';
import ListItem from './ListItem';
import { Watchlist } from '../hooks/useUserWatchlist';
import AddItemModal from './AddItemModal';
import { Items } from '../hooks/useWatchlistItems';

export default function WatchlistPage({ watchlist }: { watchlist: Watchlist }) {
    const [sortType, setSortType] = useState<
        | 'votes'
        | 'alphabetical'
        | 'date-added'
        | 'release-year'
        | 'imdb-rating'
        | 'runtime'
    >('votes');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ascending, setAscending] = useState(true);

    const { user, loading } = useAuthContext();

    const { items, upVote, downVote, itemsLoading } = useWatchlistItems(
        watchlist.id
    );

    const sortedItems: Items[] = useMemo(() => {
        const sortingItems = [...items].sort((a,b) => {
            if(sortType === 'votes') return (b.upVotes || 0) - (a.upVotes || 0)
            if (sortType === 'alphabetical') return a.title.localeCompare(b.title);
            if (sortType === 'date-added') return (b.createdAt.toMillis() || 0) - (a.createdAt.toMillis() || 0);
            if (sortType === 'release-year') return (b.year || 0) - (a.year || 0);
            if (sortType === 'imdb-rating') return (b.imdbRating || 0) - (a.imdbRating || 0);
            if (sortType === 'runtime') return (b.length || 0) - (a.length || 0);

            return 0
        });
        if (!ascending) return sortingItems.reverse()
        return sortingItems
    }, [items, sortType, ascending]);

    const containsWatched = items.some((item) => item.watched);

    if (loading || itemsLoading) {
        return (
            <Image src="/loading.gif" alt="loading" width={100} height={100} />
        );
    }
    if (!user) {
        return <div>Please sign in to view this page</div>;
    }

    return (
        <div>
            <AddItemModal
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
            <div>
                Sort by
                <select
                    id="sort-option"
                    value={sortType}
                    onChange={(e) =>
                        setSortType(
                            e.target.value as
                                | 'votes'
                                | 'alphabetical'
                                | 'date-added'
                                | 'release-year'
                                | 'imdb-rating'
                                | 'runtime'
                        )
                    }
                >
                    <option value={'votes'}>Votes</option>
                    <option value={'alphabetical'}>Alphabetical</option>
                    <option value={'date-added'}>Date Added</option>
                    <option value={'release-year'}>Release Year</option>
                    <option value={'imdb-rating'}>IMDB Rating</option>
                    <option value={'runtime'}>Runtime</option>
                </select>
                <button>
                    <Image
                        src={
                            ascending
                                ? '/ascending-sort.svg'
                                : '/descending-sort.svg'
                        }
                        alt={ascending ? 'ascending' : 'descending'}
                        height={15}
                        width={15}
                        onClick={() => {
                            setAscending(!ascending);
                        }}
                    />
                </button>
            </div>

            <div className={styles.watchlistItems}>
                {sortedItems.map((item) => {
                    if (!item.watched) {
                        return (
                            <ListItem
                                key={item.id}
                                item={item}
                                upVote={upVote}
                                downVote={downVote}
                                watched={false}
                                user={user}
                            />
                        );
                    }
                })}
            </div>
            {containsWatched && <hr />}
            <div className={styles.watchlistItems}>
                {sortedItems.map((item) => {
                    if (item.watched) {
                        return (
                            <ListItem
                                key={item.id}
                                item={item}
                                upVote={upVote}
                                downVote={downVote}
                                watched={true}
                                user={user}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
}
