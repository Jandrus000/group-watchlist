import { query, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { addWatchlistItem, getWatchlistItems, subscribeToWatchlistItems, handleVote} from '../lib/firebase/firestore';
import { subscribe } from 'diagnostics_channel';
import { incrementTag } from '../lib/firebase/firestore';

export type Items = {
    id: string;
    title: string;
    year: number | null;
    length: number | null;
    description: string | null;
    imdbLink: string;
    createdBy: string;
    watchListId: string;
    upVotes: number;
    watched: boolean;
    genres: string[] | null;
    tags: string[] | null
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export function useWatchlistItems(watchListId: string) {
    const [items, setItems] = useState<Items[]>([]);
    const [itemsLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!watchListId) return;
        
        const unsubscribe = subscribeToWatchlistItems(watchListId, (newItems) => {
            setItems(newItems);
            setLoading(false)
        })
        return () => unsubscribe()
    }, [watchListId]);

    const handleAddItem = async (
        title: string,
        watchListId: string,
        createdBy: string,
        year: number | null,
        length: number | null,
        description: string | null,
        imdbLink: string | null,
        genre: string[] | null,
        tags: string[] | null
    ) => {
        await addWatchlistItem(
            title,
            watchListId,
            createdBy,
            year,
            length,
            description,
            imdbLink,
            genre,
            tags
        );

        const data = await getWatchlistItems(watchListId);
        setItems( data as Items[])
    };

    const upVote = async (itemId: string, userId: string) => {
        await handleVote(itemId, userId, 1, watchListId)
    }
    
    const downVote = async (itemId: string, userId: string) => {
        await handleVote(itemId, userId, -1, watchListId)
    }

    return {
        items,
        itemsLoading,
        addItem: handleAddItem,
        upVote,
        downVote
    }
}
