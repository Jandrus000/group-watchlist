import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { addWatchlist, getUserWatchlists } from '../lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export type Watchlist = {
    id: string;
    name: string;
    userId: string;
    description: string;
    createdAt: Timestamp;
    tags: { tagIndex: number; name: string };
};

export function useUserWatchlist(user: User | null) {
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserWatchlists(user);
            setWatchlists(data as Watchlist[]);
            setLoading(false);
        };

        fetchData();
    }, [user]);

    const handleAddWatchlist = async (name: string, description: string) => {
        if (!user) return;

        await addWatchlist(name, user.uid, description);

        const data = await getUserWatchlists(user);
        setWatchlists(data as Watchlist[]);
    };

    return {
        watchlists,
        loading,
        addWatchlist: handleAddWatchlist,
    };
}
