'use client';

import { useAuthContext } from '@/app/context/AuthContext';
import Image from 'next/image';
import styles from '../page.module.css';
import Modal from './Modal';
import { useState } from 'react';
import { useWatchlistItems } from '../hooks/useWatchlistItems';
import ListItem from './ListItem';

interface WatchlistPageProps {
    params: { watchlistId: string };
}

export default function Watchlist({ watchlist }: { watchlist: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemTitle, setItemTitle] = useState('');
    const [itemYear, setItemYear] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [imdbLink, setImdbLink] = useState('');
    const [itemLength, setitemLength] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const { user, loading } = useAuthContext();

    const { items, itemsLoading, addItem, upVote, downVote } =
        useWatchlistItems(watchlist.id);
    const containsWatched = items.some((item) => item.watched);

    if (loading) {
        return (
            <Image src="/loading.gif" alt="loading" width={100} height={100} />
        );
    }
    if (!user) {
        return <div>Please sign in to view this page</div>;
    }

    function handleModalClose() {
        setIsModalOpen(false);
        setItemTitle('');
        setItemYear('');
        setItemDescription('');
        setImdbLink('');
        setitemLength('');
        setErrors([]);
    }

    function handleCreateItem() {
        setErrors([]);
        let year = null;
        let length = null;
        if (itemTitle.trim() === '') {
            setErrors([...errors, 'You have to include a title']);
            return;
        }

        if (
            itemYear.trim() !== '' &&
            (isNaN(Number(itemYear.trim())) || itemYear.trim().length !== 4)
        ) {
            setErrors([...errors, 'Not a valid year']);
            return;
        }
        if (itemYear.trim() !== '') {
            year = Number(itemYear);
        }

        if (itemLength.trim() !== '') {
            length = Number(itemLength);
        }

        if (user?.uid) {
            addItem(
                itemTitle,
                watchlist.id,
                user?.uid,
                year,
                length,
                itemDescription,
                imdbLink
            );
            handleModalClose();
        } else {
            setErrors([...errors, 'You need to be signed in']);
        }
    }

    return (
        <div>
            <Modal isOpen={isModalOpen}>
                <div>
                    <h4>Create a watchlist entry</h4>
                    <label htmlFor="item-title">Title</label>
                    <input
                        id="item-title"
                        type="text"
                        value={itemTitle}
                        onChange={(e) => setItemTitle(e.target.value)}
                    />

                    <label htmlFor="item-description">Description</label>
                    <textarea
                        id="item-description"
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        maxLength={400}
                    />

                    <label htmlFor="item-year">Release year</label>
                    <input
                        id="item-year"
                        type="number"
                        value={itemYear}
                        onChange={(e) => setItemYear(e.target.value)}
                    />

                    <label htmlFor="item-length">Length (in minutes)</label>
                    <input
                        id="item-length"
                        type="number"
                        value={itemLength}
                        onChange={(e) => setitemLength(e.target.value)}
                    />

                    <label htmlFor="item-imdb-link">imdb-link</label>
                    <input
                        id="item-imdb-link"
                        type="text"
                        value={imdbLink}
                        onChange={(e) => setImdbLink(e.target.value)}
                    />

                    <div id="errors">
                        {errors.map((error, i) => {
                            return <p key={i}>{error}</p>;
                        })}
                    </div>

                    <button onClick={handleCreateItem}>Create</button>
                    <button onClick={handleModalClose}>Cancel</button>
                </div>
            </Modal>
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
