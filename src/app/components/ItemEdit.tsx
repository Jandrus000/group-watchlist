'use client';

import { Items, OptionType } from '../lib/types';
import styles from '../styles/page.module.css';
import { useState, useRef, useEffect } from 'react';
import { useWatchlistItems } from '../hooks/useWatchlistItems';
// import GenrePicker from './GenrePicker';
// import TagPicker from './TagPicker';
import Select from 'react-select';
import { genres } from '../lib/util';
import CreatableSelect from 'react-select/creatable';
import { useWatchlist } from '../hooks/useWatchlist';
import { decrementTag, incrementTag } from '../lib/firebase/firestore';
import { User } from 'firebase/auth';

export default function ListItem({
    item,
    setIsEditMode,
    watched,
    user,
}: {
    item: Items;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    watched: boolean;
    user: User | null;
}) {
    const { watchlist, loading } = useWatchlist(item.watchListId);

    const genreOptions: OptionType[] = genres.map((g) => ({
        label: g,
        value: g,
    }));
    const [tagOptions, setTagOptions] = useState<OptionType[]>([]);

    const { editItem } = useWatchlistItems(item.watchListId);
    const [errors, setErrors] = useState<string[]>([]);

    const [itemTitle, setItemTitle] = useState(item.title);
    const [itemYear, setItemYear] = useState(
        (item.year && String(item.year)) || ''
    );
    const [itemDescription, setItemDescription] = useState(
        item.description || ''
    );
    const [imdbLink, setImdbLink] = useState(item.imdbLink || '');
    const [itemLength, setitemLength] = useState(
        (item.length && String(item.length)) || ''
    );
    const [itemType, setItemType] = useState<'movie' | 'tv' | 'other'>(
        item.type || 'movie'
    );
    const [pickedGenres, setPickedgenres] = useState<OptionType[]>(
        item.genres?.map((item: string) => ({ value: item, label: item })) || []
    );
    const originalTags = useRef<string[]>(item.tags || []);
    const [pickedTags, setPickedtags] = useState<OptionType[]>(
        item.tags?.map((item: string) => ({ value: item, label: item })) || []
    );
    const [itemDirector, setItemDirector] = useState(item.director || '');
    const [itemSeasons, setItemSeasons] = useState(
        (item.seasons && String(item.seasons)) || ''
    );
    const [itemEpisodes, setItemEpisodes] = useState(
        (item.episodes && String(item.episodes)) || ''
    );
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
    >(item.rating || '');
    const [itemEndYear, setItemEndYear] = useState(
        (item.endYear && String(item.endYear)) || ''
    );
    const [imdbItemRating, setImdbRating] = useState(
        (item.imdbRating && String(item.imdbRating)) || ''
    );
    const [trailerLink, setTrailerLink] = useState(item.trailerLink || '');

    useEffect(() => {
        if (!loading) {
            setTagOptions([
                ...Object.keys(watchlist.tags).map((key: string) => ({
                    label: watchlist['tags'][key]['name'],
                    value: watchlist['tags'][key]['name'],
                })),
                ...pickedTags,
            ]);
            // console.log(tagOptions);
        }
    }, [loading, watchlist, item, pickedTags]);

    function handleEditClose() {
        // todo possible error, items wont change on database on time to show correct values after reopening
        setIsEditMode(false);
        setItemTitle(item.title);
        setItemYear((item.year && String(item.year)) || '');
        setItemDescription(item.description || '');
        setImdbLink(item.imdbLink || '');
        setitemLength((item.length && String(item.length)) || '');
        setErrors([]);
        setPickedgenres(
            item.genres?.map((item: string) => ({
                value: item,
                label: item,
            })) || []
        );
        setPickedtags(
            item.tags?.map((item: string) => ({ value: item, label: item })) ||
                []
        );
        setItemDirector(item.director || '');
        setItemSeasons((item.seasons && String(item.seasons)) || '');
        setItemEpisodes((item.episodes && String(item.episodes)) || '');
        setItemRating(item.rating || '');
        setItemEndYear((item.endYear && String(item.endYear)) || '');
        setImdbRating((item.imdbRating && String(item.imdbRating)) || '');
        setTrailerLink(item.trailerLink || '');
    }

    async function handleEditItem() {
        setErrors([]);
        let genres: string[] = [];
        let tags: string[] = [];
        let year = null;
        let length = null;
        let endYear = null;
        let seasons = null;
        let episodes = null;
        let imdbRating = null;
        if (itemTitle.trim() === '') {
            setErrors([...errors, 'You have to include a title']);
            return;
        }
        if (
            (itemYear.trim() !== '' &&
                (isNaN(Number(itemYear.trim())) ||
                    itemYear.trim().length !== 4)) ||
            (itemEndYear.trim() !== '' &&
                (isNaN(Number(itemEndYear.trim())) ||
                    itemEndYear.trim().length !== 4))
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
        if (itemSeasons.trim() !== '') {
            seasons = Number(itemSeasons.trim());
        }
        if (itemEpisodes.trim() !== '') {
            episodes = Number(itemEpisodes.trim());
        }
        if (
            imdbItemRating.trim() !== '' &&
            isNaN(Number(imdbItemRating.trim()))
        ) {
            setErrors([...errors, 'not a valid imdb rating']);
            return;
        } else if (imdbItemRating.trim() !== '') {
            imdbRating = Math.round(Number(imdbItemRating.trim()) * 10) / 10;
        }
        if (itemType === 'movie') {
            endYear = null;
            seasons = null;
            episodes = null;
        }

        if (pickedGenres.length >= 1) {
            genres = pickedGenres.map((item: OptionType) => item.value);
        }

        if (pickedTags.length >= 1) {
            tags = pickedTags.map((item: OptionType) => item.value);
        }

        if (user?.uid) {
            editItem(
                itemTitle,
                itemType,
                item.watchListId,
                item.id,
                year,
                endYear,
                length,
                itemDescription,
                imdbLink,
                genres,
                tags,
                itemDirector,
                itemRating,
                imdbRating,
                trailerLink,
                seasons,
                episodes
            );
            const addedTags = tags.filter(
                (tag) => !originalTags.current.includes(tag)
            );
            const removedTags = originalTags.current.filter(
                (tag) => !tags.includes(tag)
            );
            handleEditClose();
            addedTags.forEach((tag) => incrementTag(item.watchListId, tag));
            removedTags.forEach((tag) => decrementTag(item.watchListId, tag));
        } else {
            setErrors([...errors, 'You need to be signed in']);
        }
    }

    return (
        <div
            className={`${styles.accordianDropdown} ${
                watched && styles.checkedItem
            }`}
        >
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
                    <label htmlFor="item-episodes">Episodes per season</label>
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

            <Select<OptionType, true>
                isMulti
                id="genre-picker"
                options={genreOptions}
                value={pickedGenres}
                onChange={(selected) =>
                    setPickedgenres(selected as OptionType[])
                }
            />

            <CreatableSelect
                isMulti
                options={tagOptions}
                value={pickedTags}
                onChange={(selected) => setPickedtags(selected as OptionType[])}
            />

            {/* <GenrePicker
                pickedGenres={pickedGenres}
                setPickedgenres={setPickedgenres}
            />

            <TagPicker
                pickedTags={pickedTags}
                setPickedtags={setPickedtags}
                watchlistId={item.watchListId}
            /> */}

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

            <button onClick={handleEditItem}>Save Changes</button>
            <button onClick={handleEditClose}>cancel</button>
        </div>
    );
}
