'use client';

import Image from 'next/image';
import Modal from './Modal';
import { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { genres, customStyles } from '../lib/util';
import { OptionType } from '../lib/types';
import { useWatchlist } from '../hooks/useWatchlist';

export default function ItemFilter({
    watchlistId,
    setVotesFrom,
    votesFrom,
    setVotesTo,
    votesTo,
    setSelectedGenres,
    selectedGenres,
    setSelectedTypes,
    selectedTypes,
    setSelectedRatings,
    selectedRatings,
    setSelectedTags,
    selectedTags,
    setRuntimeFrom,
    runtimeFrom,
    setRuntimeTo,
    runtimeTo,
    setYearFrom,
    yearFrom,
    setYearTo,
    yearTo,
    setImdbRatingFrom,
    imdbRatingFrom,
    setImdbRatingTo,
    imdbRatingTo,
    setDateFrom,
    dateFrom,
    setDateTo,
    dateTo,
    resetFilter,
}: {
    watchlistId: string;
    setVotesFrom: React.Dispatch<React.SetStateAction<string>>;
    votesFrom: string;
    setVotesTo: React.Dispatch<React.SetStateAction<string>>;
    votesTo: string;
    setSelectedGenres: React.Dispatch<React.SetStateAction<OptionType[]>>;
    selectedGenres: OptionType[];
    setSelectedTypes: React.Dispatch<React.SetStateAction<OptionType[]>>;
    selectedTypes: OptionType[];
    setSelectedRatings: React.Dispatch<React.SetStateAction<OptionType[]>>;
    selectedRatings: OptionType[];
    setSelectedTags: React.Dispatch<React.SetStateAction<OptionType[]>>;
    selectedTags: OptionType[];
    setRuntimeFrom: React.Dispatch<React.SetStateAction<string>>;
    runtimeFrom: string;
    setRuntimeTo: React.Dispatch<React.SetStateAction<string>>;
    runtimeTo: string;
    setYearFrom: React.Dispatch<React.SetStateAction<string>>;
    yearFrom: string;
    setYearTo: React.Dispatch<React.SetStateAction<string>>;
    yearTo: string;
    setImdbRatingFrom: React.Dispatch<React.SetStateAction<string>>;
    imdbRatingFrom: string;
    setImdbRatingTo: React.Dispatch<React.SetStateAction<string>>;
    imdbRatingTo: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateTo: React.Dispatch<React.SetStateAction<string>>;
    dateTo: string;
    resetFilter: () => void;
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const { watchlist, loading } = useWatchlist(watchlistId);
    const [tagOptions, setTagOptions] = useState<OptionType[]>([]);

    const genreOptions: OptionType[] = genres.map((g) => ({
        label: g,
        value: g,
    }));

    const typeOptions: OptionType[] = [
        { label: 'Movie', value: 'movie' },
        { label: 'Tv Show', value: 'tv' },
        { label: 'Other', value: 'other' },
    ];

    const ratingOptions: OptionType[] = [
        { label: 'G', value: 'g' },
        { label: 'PG', value: 'pg' },
        { label: 'PG-13', value: 'pg-13' },
        { label: 'R', value: 'r' },
        { label: 'TV-Y', value: 'tv-7' },
        { label: 'TV-Y7', value: 'tv-y7' },
        { label: 'TV-G', value: 'tv-g' },
        { label: 'TV-PG', value: 'tv-pg' },
        { label: 'TV-14', value: 'tv-14' },
        { label: 'TV-MA', value: 'tv-ma' },
    ];

    useEffect(() => {
        if (!loading && watchlist.tags) {
            setTagOptions([
                ...Object.keys(watchlist.tags).map((key: string) => ({
                    label: watchlist['tags'][key]['name'],
                    value: watchlist['tags'][key]['name'],
                })),
            ]);
            // console.log(tagOptions);
        }
    }, [loading, watchlist]);

    // const tagOptions: OptionType[] =
    //     loading || watchlist!
    //         ? []
    //         : Object.keys(watchlist.tags).map((key) => {
    //               const tag = watchlist.tags[key];
    //               return {
    //                   label: tag.name,
    //                   value: key,
    //               };
    //           });

    return (
        <>
            <Modal isOpen={modalOpen}>
                <div>
                    <button
                        className="x-button"
                        onClick={() => setModalOpen(false)}
                    >
                        <Image
                            src={'/cross.svg'}
                            alt={'close'}
                            width={20}
                            height={20}
                        />
                    </button>
                    <h3 className="form-header">Filter</h3>
                    <form className="form" onSubmit={(e) => e.preventDefault()}>
                        <div className="input-range">
                            <label>Vote Range</label>
                            <input
                                type="number"
                                min={-9999}
                                max={9999}
                                step={1}
                                value={votesFrom}
                                onChange={(e) => {
                                    setVotesFrom(e.target.value);
                                }}
                            />
                            <span>To</span>
                            <input
                                type="number"
                                min={-9999}
                                max={9999}
                                step={1}
                                pattern="\d*"
                                value={votesTo}
                                onChange={(e) => setVotesTo(e.target.value)}
                            />
                        </div>

                        <label htmlFor="type-picker">Type</label>
                        <Select<OptionType, true>
                            isMulti
                            id="type-picker"
                            options={typeOptions}
                            value={selectedTypes}
                            onChange={(selected) =>
                                setSelectedTypes(selected as OptionType[])
                            }
                            styles={customStyles}
                        />
                        <label htmlFor="rating-picker">MPA Ratings</label>
                        <Select<OptionType, true>
                            isMulti
                            id="rating-picker"
                            options={ratingOptions}
                            value={selectedRatings}
                            onChange={(selected) =>
                                setSelectedRatings(selected as OptionType[])
                            }
                            styles={customStyles}
                        />
                        <label htmlFor="genre-picker">Genre</label>
                        <Select<OptionType, true>
                            isMulti
                            id="genre-picker"
                            options={genreOptions}
                            value={selectedGenres}
                            onChange={(selected) =>
                                setSelectedGenres(selected as OptionType[])
                            }
                            styles={customStyles}
                        />
                        <label htmlFor="tag-picker">Tags</label>
                        <Select<OptionType, true>
                            isMulti
                            id="tag-picker"
                            options={tagOptions}
                            value={selectedTags}
                            onChange={(selected) =>
                                setSelectedTags(selected as OptionType[])
                            }
                            styles={customStyles}
                        />
                        <div className="input-range">
                            <label>Runtime (in Minutes)</label>
                            <input
                                type="number"
                                min={0}
                                max={9999}
                                value={runtimeFrom}
                                onChange={(e) => setRuntimeFrom(e.target.value)}
                            />
                            <span>To</span>
                            <input
                                type="number"
                                min={0}
                                max={9999}
                                value={runtimeTo}
                                onChange={(e) => setRuntimeTo(e.target.value)}
                            />
                        </div>
                        <div className="input-range">
                            <label>Release year</label>
                            <input
                                type="number"
                                min={0}
                                max={9999}
                                value={yearFrom}
                                onChange={(e) => setYearFrom(e.target.value)}
                            />
                            <span>To</span>
                            <input
                                type="number"
                                min={0}
                                max={9999}
                                value={yearTo}
                                onChange={(e) => setYearTo(e.target.value)}
                            />
                        </div>
                        <div className="input-range">
                            <label>Imdb Rating</label>
                            <input
                                type="number"
                                min={0}
                                max={9999}
                                value={imdbRatingFrom}
                                onChange={(e) =>
                                    setImdbRatingFrom(e.target.value)
                                }
                            />
                            <span>To</span>
                            <input
                                type="number"
                                min={0}
                                max={9999}
                                value={imdbRatingTo}
                                onChange={(e) =>
                                    setImdbRatingTo(e.target.value)
                                }
                            />
                        </div>
                        <div className="input-range">
                            <label>Date added</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                            <span>To</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>

                        <button className="submit-button" onClick={resetFilter}>
                            Reset
                        </button>
                    </form>
                </div>
            </Modal>
            <button
                onClick={() => setModalOpen(true)}
                className="custom-button"
            >
                <span>Filter</span>
                <Image
                    src={'/filter.svg'}
                    alt={'filter'}
                    width={25}
                    height={25}
                />
            </button>
        </>
    );
}
