'use client';

import { Items } from '../lib/types';
import styles from '../styles/page.module.css';
import VoteButtons from './VoteButtons';
import ItemEdit from './ItemEdit';
import CheckBox from './CheckBox';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    decrementTag,
    deleteItem,
    getUserName,
} from '../lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

export default function ListItem({
    item,
    upVote,
    downVote,
    watched,
    user,
}: {
    item: Items;
    upVote: any;
    downVote: any;
    watched: boolean;
    user: User | null;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState(item.createdByUsername || '');
    const [editMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (username === '') {
            getUserName(item.createdBy).then(setUsername);
        }
    }, [item.createdByUsername, item.createdBy, username]);

    async function handleDelete() {
        const tags = item.tags;
        deleteItem(item);
        if (tags) {
            for (const tag of tags) {
                await decrementTag(item.watchListId, tag);
            }
        }
    }

    function formatDate(
        timestamp: Timestamp | Date | string | null | undefined
    ) {
        if (timestamp instanceof Timestamp) {
            const dateObj = timestamp.toDate();
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
            return formattedDate;
        } else {
            return 'Issue with date';
        }
    }

    return (
        <div>
            <div
                className={`${styles.watchlistItem} ${
                    watched && styles.checkedItem
                }`}
            >
                <CheckBox watched={watched} item={item} />
                <span
                    onClick={() => setIsOpen(!isOpen)}
                    className={styles.watchlistTitle}
                >
                    {item.title}
                </span>
                {!watched && (
                    <VoteButtons
                        item={item}
                        upVote={upVote}
                        downVote={downVote}
                    />
                )}
                <span onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '▲' : '▼'}
                </span>
            </div>

            {isOpen &&
                (editMode && !watched ? (
                    <ItemEdit
                        item={item}
                        setIsEditMode={setIsEditMode}
                        watched={watched}
                        user={user}
                    />
                ) : (
                    <div
                        className={`${styles.accordianDropdown} ${
                            watched && styles.checkedItem
                        }`}
                    >
                        {item.description !== '' && (
                            <div className="detail-field">
                                <span className="bold">Description</span>
                                <p>{item.description}</p>
                            </div>
                        )}

                        {item.rating !== '' && (
                            <div className="detail-field">
                                <span className="bold">MPA Rating</span>
                                <p>{item.rating}</p>
                            </div>
                        )}

                        {item.director !== '' && (
                            <div className="detail-field">
                                <span className="bold">Director</span>
                                <p>{item.director}</p>
                            </div>
                        )}

                        {item.length && (
                            <div className="detail-field">
                                <span className="bold">
                                    Length (in mintues)
                                </span>
                                <span>{item.length}</span>
                            </div>
                        )}

                        {item.year && (
                            <div className="detail-field">
                                <span className="bold">Release Year</span>
                                <span>
                                    {item.year}
                                    {item.endYear && `-${item.endYear}`}
                                </span>
                            </div>
                        )}

                        {item.seasons && (
                            <div className="detail-field">
                                <span className="bold">Seasons</span>
                                <span>{item.seasons}</span>
                            </div>
                        )}

                        {item.episodes && (
                            <div className="detail-field">
                                <span className="bold">
                                    Episodes per season
                                </span>
                                <span>{item.episodes}</span>
                            </div>
                        )}

                        {Array.isArray(item.genres) && item.genres.length > 0 && (
                            <div className='detail-field'>
                                <span className="bold">Genre</span>
                                <div className='many-detail-container'>
                                    {item.genres?.map(
                                        (genre: string, i: number) => (
                                            <span key={i}>
                                                {genre}{i !== (item.genres as string[]).length -1 ? ', ' : ''}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {item.tags && item.tags.length > 0 && (
                            <div className='detail-field'>
                                <span className="bold">Tags</span>
                                <div className='many-detail-container'>
                                    {item.tags?.map((tag: string, i: number) => (
                                        <span className='list-detail' key={i}>
                                            {tag}{i !== (item.tags as string[]).length -1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {item.imdbRating && (
                            <div className="detail-field">
                                <span className="bold">Imdb Rating</span>
                                <span>{item.imdbRating}/10</span>
                            </div>
                        )}


                        <div className="detail-field">
                            <span className="bold">Added</span>
                            <span>{formatDate(item.createdAt)}</span>
                        </div>

                        <div className="detail-field">
                            <span className="bold">Added by</span>
                            <span>{username || `User ${item.createdBy}`}</span>
                        </div>
                        <div className='detail-field'>
                            {item.imdbLink !== '' && (
                                <div>
                                    <a href={item.imdbLink} target="_blank">
                                        <Image
                                            src={'/imdb-svgrepo-com.svg'}
                                            alt="IMDB link"
                                            width={25}
                                            height={50}
                                        />
                                    </a>
                                </div>
                            )}

                            {item.trailerLink !== '' &&
                                item.trailerLink !== null && (
                                    <div>
                                        <a href={item.trailerLink} target="_blank">
                                            <Image
                                                src={'/video-file.svg'}
                                                alt="Trailer link"
                                                width={25}
                                                height={50}
                                            />
                                        </a>
                                    </div>
                                )}
                        </div>

                        <div className="button-flex">
                            <button
                                onClick={handleDelete}
                                className="custom-button delete"
                            >
                                Delete
                            </button>
                            {!watched && (
                                <button
                                    className="custom-button"
                                    onClick={() => setIsEditMode(true)}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
}
