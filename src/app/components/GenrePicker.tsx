"use client"

import { useState } from 'react';
import Trie from '../lib/Trie';
import { TitleCase } from '../lib/functions';

export default function GenrePicker({
    pickedGenres,
    setPickedgenres,
}: {
    pickedGenres: string[];
    setPickedgenres: React.Dispatch<React.SetStateAction<string[]>>;
}) {
    const [searchItem, setSearchItem] = useState('');
    const genres = [
        'Action',
        'Adventure',
        'Anthology',
        'Animation',
        'Anime',
        'Biographical',
        'Children',
        'Comedy',
        'Coming of Age',
        'Computer Animation',
        'Crime',
        'Cyberpunk',
        'Dance',
        'Dark Comedy',
        'Disaster',
        'Documentary',
        'Drama',
        'Dystopian',
        'Educational',
        'Esports',
        'Experimental',
        'Family',
        'Fantasy',
        'Food',
        'Game Show',
        'Harem',
        'Heist',
        'Historical',
        'Horror',
        'Isekai',
        'Legal',
        'Live Action',
        'Martial Arts',
        'Mecha',
        'Medical',
        'Mockumentary',
        'Music',
        'Musical',
        'Mystery',
        'Mythology',
        'Nature',
        'Noir',
        'Parody',
        'Period Drama',
        'Political',
        'Post-Apocalyptic',
        'Psychological',
        'Reality TV',
        'Road Movie',
        'Romance',
        'Romantic Comedy',
        'Samurai',
        'Satire',
        'School',
        'Science Fiction',
        'Short',
        'Slice of Life',
        'Soap',
        'Space Opera',
        'Sports',
        'Spy',
        'Stand-Up',
        'Steampunk',
        'Superhero',
        'Supernatural',
        'Suspense',
        'Talk Show',
        'Thriller',
        'Time Travel',
        'TV Movie',
        'Urban',
        'Variety Show',
        'Vampire',
        'War',
        'Western',
        'Whodunit',
        'Zombie',
    ];

    function addGenre(genre: string) {
        setPickedgenres([...pickedGenres, genre]);
        setSearchItem('');
    }

    function removeGenre(genre: string) {
        setPickedgenres(
            pickedGenres.filter((value: string) => value !== genre)
        );
    }

    const genreTrie = new Trie();
    for (const genre of genres) {
        genreTrie.insert(genre);
    }

    return (
        <>
            <label htmlFor="item-genre">Genre</label>
            <input
                id={'item-genre'}
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
            />
            <ul>
                {pickedGenres.map((genre: string, i: number) => {
                    return (
                        <li key={i}>
                            {genre}{' '}
                            <span onClick={() => removeGenre(genre)}>x</span>
                        </li>
                    );
                })}
            </ul>
            <ul>
                {searchItem !== ''
                    ? genreTrie
                          .getWordsWithPrefix(searchItem)
                          .filter(
                              (word: string) =>
                                  !pickedGenres.includes(TitleCase(word))
                          )
                          .map((word: string, index: number) => (
                              <li
                                  key={index}
                                  onClick={() => addGenre(TitleCase(word))}
                              >
                                  {TitleCase(word)}
                              </li>
                          ))
                    : null}
            </ul>
            <ul></ul>
        </>
    );
}
