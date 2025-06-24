"use client"

import { useState } from 'react';
import Trie from '../lib/Trie';
import { useWatchlist } from '../hooks/useWatchlist';

export default function TagPicker({
    pickedTags,
    setPickedtags,
    watchlistId,
}: {
    pickedTags: string[];
    setPickedtags: React.Dispatch<React.SetStateAction<string[]>>;
    watchlistId: string;
}) {
    const [searchItem, setSearchItem] = useState('');
    const {watchlist, loading} = useWatchlist(watchlistId)
    
    // TODO fix adding duplicate tags to an item
    async function addTag(tag: string) {
        if (tag == '' || pickedTags.includes(tag)) return
        setSearchItem('');
        setPickedtags([...pickedTags, tag]);
    }


    async function removeTag(tag: string) {
        if (tag == '') return
        setPickedtags(pickedTags.filter((value: string) => value !== tag));
        // await decrementTag(watchlist.id, tag)
    }

    const tagTrie = new Trie();
    
    if(!loading){

        if (watchlist.tags) {
            for (const tag of Object.keys(watchlist.tags)) {
                if((watchlist.tags as any)[tag].name){
                    tagTrie.insert((watchlist.tags as any)[tag].name);
                }
            }
        }
    }

    return (
        <>
            <label htmlFor="item-tags">Tags</label>
            <input
                id={'item-tags'}
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
            />
            <ul>
                {pickedTags.map((tag: string, i: number) => {
                    return (
                        <li key={i}>
                            {tag} <span onClick={() => removeTag(tag)}>x</span>
                        </li>
                    );
                })}
            </ul>
            <ul>
                {searchItem !== ''
                    ? tagTrie
                          .getWordsWithPrefix(searchItem)
                          .filter(
                              (word: string) =>
                                  !pickedTags.includes(word)
                          )
                          .map((word: string, index: number) => (
                              <li
                                  key={index}
                                  onClick={() => addTag(word)}
                              >
                                  {word}
                              </li>
                          ))
                    : null}
                {
                    searchItem !== '' &&
                    <li onClick={async () => await addTag(searchItem)}>+ Add as new Tag</li>
                }
            </ul>
        </>
    );
}
