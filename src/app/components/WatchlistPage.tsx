'use client';

import { useAuthContext } from '@/app/context/AuthContext';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from '../styles/page.module.css';
import '../styles/watchlist.css';
import { useState, useMemo } from 'react';
import { useWatchlistItems } from '../hooks/useWatchlistItems';
import ListItem from './ListItem';
import AddItemModal from './AddItemModal';
import ItemFilter from './ItemFilter';
import { Items, Watchlist } from '../lib/types';
import { OptionType } from '../lib/types';
import { applyFilter } from '../lib/util';
import { useSavedWatchlists } from '../hooks/useSavedWatchlists';
import { ToastContainer, toast } from 'react-toastify';
import Modal from './Modal';

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
    const { savedWatchlists, savedWatchlistsLoading } = useSavedWatchlists();

    const { items, upVote, downVote, itemsLoading, saveWatchlist } =
        useWatchlistItems(watchlist.id);

    const [votesFrom, setVotesFrom] = useState('');
    const [votesTo, setVotesTo] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<OptionType[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<OptionType[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<OptionType[]>([]);
    const [selectedTags, setSelectedTags] = useState<OptionType[]>([]);
    const [runtimeFrom, setRuntimeFrom] = useState('');
    const [runtimeTo, setRuntimeTo] = useState('');
    const [yearFrom, setYearFrom] = useState('');
    const [yearTo, setYearTo] = useState('');
    const [imdbRatingFrom, setImdbRatingFrom] = useState('');
    const [imdbRatingTo, setImdbRatingTo] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const isFiltered: boolean = useMemo(() => {
        if (
            votesFrom === '' &&
            votesTo === '' &&
            selectedGenres.length === 0 &&
            selectedTypes.length === 0 &&
            selectedRatings.length === 0 &&
            selectedTags.length === 0 &&
            runtimeFrom === '' &&
            runtimeTo === '' &&
            yearFrom === '' &&
            yearTo === '' &&
            imdbRatingFrom === '' &&
            imdbRatingTo === '' &&
            dateFrom === '' &&
            dateTo === ''
        ) {
            return false;
        }
        return true;
    }, [
        votesFrom,
        votesTo,
        selectedGenres,
        selectedTypes,
        selectedRatings,
        selectedTags,
        runtimeFrom,
        runtimeTo,
        yearFrom,
        yearTo,
        imdbRatingFrom,
        imdbRatingTo,
        dateFrom,
        dateTo,
    ]);

    const [randomModalOpen, setRandomModalOpen] = useState(false);
    const [randomMovie, setRandomMovie] = useState('');
    const [randomPickerError, setRandomPickerError] = useState('');

    function pickRandomMovie() {
        setRandomPickerError('');
        if (filteredItems.length === 0) {
            setRandomPickerError('There are no movies to pick from');
            return;
        }
        if (filteredItems.length === 1) {
            setRandomPickerError("There's only one movie to pick from");
        }
        const randomNumber = Math.floor(
            Math.random() * (filteredItems.length - 0)
        );
        const movie = filteredItems[randomNumber].title;
        if (movie === randomMovie && filteredItems.length !== 1) {
            setRandomPickerError(
                'You got the same movie as last time! Guess you have to watch it'
            );
        }
        setRandomMovie(movie);
    }

    function resetFilter() {
        setVotesFrom('');
        setVotesTo('');
        setSelectedGenres([]);
        setSelectedTypes([]);
        setSelectedRatings([]);
        setSelectedTags([]);
        setRuntimeFrom('');
        setRuntimeTo('');
        setYearFrom('');
        setYearTo('');
        setImdbRatingFrom('');
        setImdbRatingTo('');
        setDateFrom('');
        setDateTo('');
    }

    const sortedItems: Items[] = useMemo(() => {
        const sortingItems = [...items].sort((a, b) => {
            if (sortType === 'votes')
                return (b.upVotes || 0) - (a.upVotes || 0);
            if (sortType === 'alphabetical')
                return a.title.localeCompare(b.title);
            if (sortType === 'date-added')
                return (
                    (b.createdAt.toMillis() || 0) -
                    (a.createdAt.toMillis() || 0)
                );
            if (sortType === 'release-year')
                return (b.year || 0) - (a.year || 0);
            if (sortType === 'imdb-rating')
                return (b.imdbRating || 0) - (a.imdbRating || 0);
            if (sortType === 'runtime')
                return (b.length || 0) - (a.length || 0);

            return 0;
        });
        if (!ascending) return sortingItems.reverse();
        return sortingItems;
    }, [items, sortType, ascending]);

    const filteredItems: Items[] = useMemo(() => {
        return applyFilter(
            sortedItems,
            votesFrom,
            votesTo,
            selectedGenres,
            selectedTypes,
            selectedRatings,
            selectedTags,
            runtimeFrom,
            runtimeTo,
            yearFrom,
            yearTo,
            imdbRatingFrom,
            imdbRatingTo,
            dateFrom,
            dateTo
        );
    }, [
        sortedItems,
        votesFrom,
        votesTo,
        selectedGenres,
        selectedTypes,
        selectedRatings,
        selectedTags,
        runtimeFrom,
        runtimeTo,
        yearFrom,
        yearTo,
        imdbRatingFrom,
        imdbRatingTo,
        dateFrom,
        dateTo,
    ]);

    const containsWatched = items.some((item) => item.watched);

    if (loading || itemsLoading) {
        return (
            <div className='loading'>
                <Image src="/loading.gif" alt="loading"  width={100} height={100} />
            </div>
        );
    }
    if (!user) {
        return <div>Please sign in to view this page</div>;
    }

    // TODO add console.log() why is it doubled on refresh?
    if (watchlist.private && watchlist.userId !== user.uid) {
        return notFound(); // Access denied — treat as nonexistent
    }

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
            <AddItemModal
                watchlistId={watchlist.id}
                user={user}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />

            <div className="title-flex">
                <h1>{watchlist.name}</h1>
                {/* bookmark icon for saving watchlist */}
                {!loading && user.uid !== watchlist.userId && (
                    <Image
                        onClick={() => {
                            toast(
                                watchlist.id in savedWatchlists
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
                            saveWatchlist(
                                user.uid,
                                watchlist.name,
                                watchlist.description
                            );
                        }}
                        src={
                            watchlist.id in savedWatchlists
                                ? '/bookmarked.svg'
                                : '/bookmark.svg'
                        }
                        alt={'Save Watchlist'}
                        width={25}
                        height={25}
                    />
                )}
            </div>
            <p className="description">{watchlist.description}</p>
            <div className={styles.addButton}>
                <button onClick={() => setIsModalOpen(true)}>
                    <Image src={'/plus.svg'} alt={'+'} width={15} height={10} />
                </button>
                <span>Add a movie/show</span>
            </div>
            <div className='list-features'>
                {/* sort */}
                <div className="sorter">
                    Sort by
                    <select
                        id="sort-option"
                        value={sortType}
                        className=""
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
                            height={25}
                            width={25}
                            onClick={() => {
                                setAscending(!ascending);
                            }}
                        />
                    </button>
                </div>
                {/* filter */}
                <div>
                    <ItemFilter
                        watchlistId={watchlist.id}
                        setVotesFrom={setVotesFrom}
                        votesFrom={votesFrom}
                        setVotesTo={setVotesTo}
                        votesTo={votesTo}
                        setSelectedGenres={setSelectedGenres}
                        selectedGenres={selectedGenres}
                        setSelectedTypes={setSelectedTypes}
                        selectedTypes={selectedTypes}
                        setSelectedRatings={setSelectedRatings}
                        selectedRatings={selectedRatings}
                        setSelectedTags={setSelectedTags}
                        selectedTags={selectedTags}
                        setRuntimeFrom={setRuntimeFrom}
                        runtimeFrom={runtimeFrom}
                        setRuntimeTo={setRuntimeTo}
                        runtimeTo={runtimeTo}
                        setYearFrom={setYearFrom}
                        yearFrom={yearFrom}
                        setYearTo={setYearTo}
                        yearTo={yearTo}
                        setImdbRatingFrom={setImdbRatingFrom}
                        imdbRatingFrom={imdbRatingFrom}
                        setImdbRatingTo={setImdbRatingTo}
                        imdbRatingTo={imdbRatingTo}
                        setDateFrom={setDateFrom}
                        dateFrom={dateFrom}
                        setDateTo={setDateTo}
                        dateTo={dateTo}
                        resetFilter={resetFilter}
                    />
                    {isFiltered && (
                        <span onClick={resetFilter}>X Reset filter</span>
                    )}
                </div>

                <button className="custom-button" onClick={() => setRandomModalOpen(!randomModalOpen)}>
                    Random Picker
                </button>
            </div>

            {/* Modal for Random Picker */}
            <Modal isOpen={randomModalOpen}>
                <button
                    className="x-button"
                    onClick={() => {
                        setRandomModalOpen(false);
                        setRandomMovie('');
                        setRandomPickerError('');
                    }}
                >
                    <Image
                        src={'/cross.svg'}
                        alt={'close'}
                        width={20}
                        height={20}
                    />
                </button>
                <h2 className="form-header">Random Picker</h2>
                <p>Cant decide?</p>
                <p className='form-subtitle'>
                    Pushing the button will randomly pick an item from your
                    list, if you have a filter applied it will pick from the
                    filtered list!
                </p>


                <p>Our Pick:</p>
                <div className='random-pick'>
                    <p>{randomMovie}</p>
                </div>
                <p className="error random-picker-error">{randomPickerError}</p>
                <button className='custom-button' onClick={pickRandomMovie}>Pick for me!</button>
            </Modal>

            <div className={styles.watchlistItems}>
                {filteredItems.map((item) => {
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
                {filteredItems.map((item) => {
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
