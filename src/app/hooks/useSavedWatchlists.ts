import { useEffect, useState } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import { subscribeToSavedWatchlist } from '../lib/firebase/firestore';

export function useSavedWatchlists() {
    const { user } = useAuthContext();
    const [saved, setSaved] = useState<Record<string, {name: string; description: string}>>({});
    const [savedWatchlistsLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setSaved({});
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToSavedWatchlist(user.uid, (saved) => {
            setSaved(saved);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return { savedWatchlists: saved, savedWatchlistsLoading };
}
