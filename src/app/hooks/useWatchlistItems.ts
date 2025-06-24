import { query, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    addWatchlistItem,
    getWatchlistItems,
    subscribeToWatchlistItems,
    handleVote,
    editItem,
} from '../lib/firebase/firestore';

export type Items = {
    id: string;
    title: string;
    type: 'movie' | 'tv' | 'other';
    year: number | null;
    endYear: number | null;
    length: number | null;
    description: string | null;
    imdbLink: string;
    createdBy: string;
    createdByUsername: string;
    watchListId: string;
    upVotes: number;
    watched: boolean;
    genres: string[] | null;
    tags: string[] | null;
    director: string | null;
    rating:
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
        | 'tv-ma';
    imdbRating: number | null;
    trailerLink: string | null;
    seasons: number | null;
    episodes: number | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export function useWatchlistItems(watchListId: string) {
    const [items, setItems] = useState<Items[]>([]);
    const [itemsLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!watchListId) return;

        const unsubscribe = subscribeToWatchlistItems(
            watchListId,
            (newItems) => {
                setItems(newItems);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [watchListId]);

    const handleAddItem = async (
        title: string,
        type: 'movie' | 'tv' | 'other',
        watchListId: string,
        createdBy: string,
        createdByUsername: string | null,
        year: number | null,
        endYear: number | null,
        length: number | null,
        description: string | null,
        imdbLink: string | null,
        genre: string[] | null,
        tags: string[] | null,
        director: string | null,
        rating:
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
            | 'tv-ma',
        imdbRating: number | null,
        trailerLink: string | null,
        seasons: number | null,
        episodes: number | null
    ) => {
        await addWatchlistItem(
            title,
            type,
            watchListId,
            createdBy,
            createdByUsername,
            rating,
            year,
            endYear,
            length,
            description,
            imdbLink,
            genre,
            tags,
            director,
            imdbRating,
            trailerLink,
            seasons,
            episodes
        );

        const data = await getWatchlistItems(watchListId);
        setItems(data as Items[]);
    };

    const handleEditItem = async (
        itemTitle: string,
        itemType: 'movie' | 'tv' | 'other',
        watchlistId: string,
        itemId: string,
        year: number | null | undefined,
        endYear: number | null | undefined,
        length: number | null | undefined,
        itemDescription: string | null | undefined,
        imdbLink: string | null | undefined,
        pickedGenres: string[] | null | undefined,
        pickedTags: string[] | null | undefined,
        itemDirector: string | null | undefined,
        itemRating:
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
            | 'tv-ma',
        imdbRating: number | null | undefined,
        trailerLink: string | null | undefined,
        seasons: number | null | undefined,
        episodes: number | null | undefined
    ) => {
        await editItem(
            itemTitle,
            itemType,
            watchlistId,
            itemId,
            itemRating,
            year,
            endYear,
            length,
            itemDescription,
            imdbLink,
            pickedGenres,
            pickedTags,
            itemDirector,
            imdbRating,
            trailerLink,
            seasons,
            episodes
        );
        const data = await getWatchlistItems(watchListId);
        setItems(data as Items[]);
    };

    const upVote = async (itemId: string, userId: string) => {
        await handleVote(itemId, userId, 1, watchListId);
    };

    const downVote = async (itemId: string, userId: string) => {
        await handleVote(itemId, userId, -1, watchListId);
    };

    return {
        items,
        itemsLoading,
        addItem: handleAddItem,
        editItem: handleEditItem,
        upVote,
        downVote,
    };
}
