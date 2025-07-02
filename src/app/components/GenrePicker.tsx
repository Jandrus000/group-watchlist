"use client"

import { useState } from 'react';
import Trie from '../lib/Trie';
import { TitleCase } from '../lib/functions';
import {genres} from '../lib/util'

export default function GenrePicker({
    pickedGenres,
    setPickedgenres,
}: {
    pickedGenres: string[];
    setPickedgenres: React.Dispatch<React.SetStateAction<string[]>>;
}) {
    const [searchItem, setSearchItem] = useState('');

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
