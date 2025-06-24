'use client';

import { Items } from '../hooks/useWatchlistItems';
import styles from '../page.module.css';
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
                            <>
                                <span className="bold">Description</span>
                                <p>{item.description}</p>
                            </>
                        )}

                        {item.rating !== '' && (
                            <>
                                <span className="bold">MPA Rating</span>
                                <p>{item.rating}</p>
                            </>
                        )}

                        {item.director !== '' && (
                            <>
                                <span className="bold">Director</span>
                                <p>{item.director}</p>
                            </>
                        )}

                        {item.length && (
                            <div>
                                <span className="bold">
                                    Length (in mintues)
                                </span>
                                <span>{item.length}</span>
                            </div>
                        )}

                        {item.year && (
                            <div>
                                <span className="bold">Release Year</span>
                                <span>
                                    {item.year}
                                    {item.endYear && `-${item.endYear}`}
                                </span>
                            </div>
                        )}

                        {item.seasons && (
                            <div>
                                <span className="bold">Seasons</span>
                                <span>{item.seasons}</span>
                            </div>
                        )}

                        {item.episodes && (
                            <div>
                                <span className="bold">
                                    Episodes per season
                                </span>
                                <span>{item.episodes}</span>
                            </div>
                        )}

                        {item.genres && item.genres.length > 0 && (
                            <>
                                <span className="bold">Genre</span>
                                {item.genres?.map(
                                    (genre: string, i: number) => (
                                        <span key={i}>
                                            <br />
                                            {genre}
                                        </span>
                                    )
                                )}
                            </>
                        )}

                        {item.tags && item.tags.length > 0 && (
                            <>
                                <span className="bold">Tags</span>
                                {item.tags?.map((tag: string, i: number) => (
                                    <span key={i}>
                                        <br />
                                        {tag}
                                    </span>
                                ))}
                            </>
                        )}

                        {item.imdbRating && (
                            <div>
                                <span className="bold">Imdb Rating</span>
                                <span>{item.imdbRating}/10</span>
                            </div>
                        )}

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

                        <div>
                            <span className="bold">Added</span>
                            <span>{formatDate(item.createdAt)}</span>
                        </div>

                        <div>
                            <span className="bold">Added by</span>
                            <span>{username || `User ${item.createdBy}`}</span>
                        </div>

                        <button onClick={handleDelete}>Delete</button>
                        {!watched && (
                            <button onClick={() => setIsEditMode(true)}>
                                Edit
                            </button>
                        )}
                    </div>
                ))}
        </div>
    );
}
