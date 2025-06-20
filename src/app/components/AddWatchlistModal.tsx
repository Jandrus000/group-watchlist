import Modal from './Modal';
import GenrePicker from './GenrePicker';
import TagPicker from './TagPicker';
import { useState } from 'react';
import { useWatchlistItems } from '../hooks/useWatchlistItems';
import { User } from 'firebase/auth';
import { Watchlist } from '../hooks/useUserWatchlist';
import { incrementTag } from '../lib/firebase/firestore';

export default function AddWatchlistModal({
    watchlist,
    user,
    isModalOpen,
    setIsModalOpen,
}: {
    watchlist: Watchlist;
    user: User | null;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { addItem } = useWatchlistItems(watchlist.id);

    const [itemTitle, setItemTitle] = useState('');
    const [itemYear, setItemYear] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [imdbLink, setImdbLink] = useState('');
    const [itemLength, setitemLength] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [itemType, setItemType] = useState<'movie' | 'tv' | 'other'>('movie');
    const [pickedGenres, setPickedgenres] = useState<string[]>([]);
    const [pickedTags, setPickedtags] = useState<string[]>([]);

    const [itemDirector, setItemDirector] = useState('');
    const [itemSeasons, setItemSeasons] = useState('');
    const [itemEpisodes, setItemEpisodes] = useState('');
    const [itemRating, setItemRating] = useState<
        | ''
        | 'g'
        | 'pg'
        | 'pg-13'
        | 'r'
        | 'tv-y'
        | 'tv-y7'
        | 'tv-g'
        | 'tv-pg'
        | 'tv-14'
        | 'tv-ma'
    >('');
    const [itemEndYear, setItemEndYear] = useState('')
    const [imdbItemRating, setImdbRating] = useState('')
    const [trailerLink, setTrailerLink] = useState('')

    function handleModalClose() {
        setIsModalOpen(false);
        setItemTitle('');
        setItemYear('');
        setItemDescription('');
        setImdbLink('');
        setitemLength('');
        setErrors([]);
        setPickedgenres([]);
        setPickedtags([]);
        setItemDirector('');
        setItemDirector('')
        setItemSeasons('');
        setItemEpisodes('')
        setItemRating('')
        setItemEndYear('')
        setImdbRating('')
        setTrailerLink('')
    }

    async function handleCreateItem() {
        setErrors([]);
        let year = null;
        let length = null;
        let endYear = null
        let seasons = null
        let episodes = null
        let imdbRating = null
        

        if (itemTitle.trim() === '') {
            setErrors([...errors, 'You have to include a title']);
            return;
        }

        if (
            (itemYear.trim() !== '' &&
            (isNaN(Number(itemYear.trim())) || itemYear.trim().length !== 4)) ||
            (itemEndYear.trim() !== '' &&
            (isNaN(Number(itemEndYear.trim())) || itemEndYear.trim().length !== 4))
        ) {
            setErrors([...errors, 'Not a valid year']);
            return;
        }
        if (itemYear.trim() !== '') {
            year = Number(itemYear.trim());
        }

        if (itemEndYear.trim() !== '') {
            endYear = Number(itemEndYear.trim());
        }

        if (itemLength.trim() !== '') {
            length = Number(itemLength.trim());
        }

        if(itemSeasons.trim() !== '') {
            seasons = Number(itemSeasons.trim())
        }

        if(itemEpisodes.trim() !== '') {
            episodes = Number(itemEpisodes.trim())
        }

        if (imdbItemRating.trim() !== '' && isNaN(Number(imdbItemRating.trim()))) {
            setErrors([...errors, 'not a valid imdb rating'])
            return
        } else if(imdbItemRating.trim() !== ''){
            imdbRating = Math.round(Number(imdbItemRating.trim())*10)/10
        }

        if(itemType === 'movie'){
            endYear = null
            seasons = null
            episodes = null
        }

        if (user?.uid) {
            addItem(
                itemTitle,
                itemType,
                watchlist.id,
                user?.uid,
                user?.displayName,
                year,
                endYear,
                length,
                itemDescription,
                imdbLink,
                pickedGenres,
                pickedTags,
                itemDirector,
                itemRating,
                imdbRating,
                trailerLink,
                seasons,
                episodes
            );
            const tags = pickedTags;
            handleModalClose();
            for (const tag of tags) {
                await incrementTag(watchlist.id, tag);
            }
        } else {
            setErrors([...errors, 'You need to be signed in']);
        }
    }
    return (
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

                <label htmlFor="item-type">Type</label>
                <select
                    id="item-type"
                    value={itemType}
                    onChange={(e) =>
                        setItemType(e.target.value as 'movie' | 'tv' | 'other')
                    }
                >
                    <option value={'movie'}>Movie</option>
                    <option value={'tv'}>Television Show</option>
                    <option value={'other'}>Other</option>
                </select>

                <label htmlFor="item-description">Description</label>
                <textarea
                    id="item-description"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    maxLength={400}
                />

                <label htmlFor="item-director">Director</label>
                <input
                    id="item-director"
                    value={itemDirector}
                    type="text"
                    onChange={(e) => setItemDirector(e.target.value)}
                />

                {itemType === 'tv' && (
                    <>
                        <label htmlFor="item-seasons">Seasons</label>
                        <input
                            id="item-seasons"
                            type="number"
                            value={itemSeasons}
                            onChange={(e) => setItemSeasons(e.target.value)}
                        />
                    </>
                )}

                {itemType === 'tv' && (
                    <>
                        <label htmlFor="item-episodes">
                            Episodes per season
                        </label>
                        <input
                            id="itemepisodess"
                            type="number"
                            value={itemEpisodes}
                            onChange={(e) => setItemEpisodes(e.target.value)}
                        />
                    </>
                )}

                <label htmlFor="item-rating">MPA Rating</label>
                <select
                    id="item-rating"
                    value={itemRating}
                    onChange={(e) =>
                        setItemRating(
                            e.target.value as
                                | ''
                                | 'g'
                                | 'pg'
                                | 'pg-13'
                                | 'r'
                                | 'tv-y'
                                | 'tv-y7'
                                | 'tv-g'
                                | 'tv-pg'
                                | 'tv-14'
                                | 'tv-ma'
                        )
                    }
                >
                    <option value={''}></option>
                    {(itemType === 'movie' || itemType === 'other') && (
                        <>
                            <option value={'g'}>G</option>
                            <option value={'pg'}>PG</option>
                            <option value={'pg-13'}>PG-13</option>
                            <option value={'r'}>R</option>
                        </>
                    )}
                    {(itemType === 'tv' || itemType === 'other') && (
                        <>
                            <option value={'tv-y'}>TV-Y</option>
                            <option value={'tv-y7'}>TV-Y7</option>
                            <option value={'tv-g'}>TV-G</option>
                            <option value={'tv-pg'}>TV-PG</option>
                            <option value={'tv-14'}>TV-14</option>
                            <option value={'tv-ma'}>TV-MA</option>
                        </>
                    )}
                    <option value={'urated'}>unrated</option>
                    <option value={'other'}>other</option>
                </select>

                <GenrePicker
                    pickedGenres={pickedGenres}
                    setPickedgenres={setPickedgenres}
                />

                <TagPicker
                    pickedTags={pickedTags}
                    setPickedtags={setPickedtags}
                    watchlistId={watchlist.id}
                />

                <label htmlFor="item-year">Release year</label>
                <input
                    id="item-year"
                    type="number"
                    value={itemYear}
                    onChange={(e) => setItemYear(e.target.value)}
                />

                {itemType === 'tv' && (
                    // how do i indicate show is on going?
                    <>
                        <label htmlFor="item-end-year">End year</label>
                        <input
                            id="item-end-year"
                            type="number"
                            value={itemEndYear}
                            onChange={(e) => setItemEndYear(e.target.value)}
                        />
                    </>
                )}

                <label htmlFor="item-length">
                    {itemType === 'tv' && 'Avg Episode '}Length (in minutes)
                </label>
                <input
                    id="item-length"
                    type="number"
                    value={itemLength}
                    onChange={(e) => setitemLength(e.target.value)}
                />

                <label htmlFor="item-imdb-rating">IMDB rating</label>
                <input
                    id="item-imdb-rating"
                    type="number"
                    value={imdbItemRating}
                    onChange={(e) => setImdbRating(e.target.value)}
                    min={0}
                    max={10}
                    step={0.1}
                />

                <label htmlFor="item-imdb-link">IMDB link</label>
                <input
                    id="item-imdb-link"
                    type="text"
                    value={imdbLink}
                    onChange={(e) => setImdbLink(e.target.value)}
                />

                <label htmlFor="trailer-link">Trailer link</label>
                <input
                    id="trailer-link"
                    type="text"
                    value={trailerLink}
                    onChange={(e) => setTrailerLink(e.target.value)}
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
    );
}
