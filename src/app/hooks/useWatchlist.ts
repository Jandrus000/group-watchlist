import { useEffect, useState } from "react";
import { subscribeToWatchlist } from "../lib/firebase/firestore";


export function useWatchlist(watchlistId: string) {
    const [watchlist, setWatchlist] = useState<any>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!watchlistId) return;

        const unsubwatchlist = subscribeToWatchlist(watchlistId, (data) => {
            setWatchlist(data);
            setLoading(false)
        })

        return () => {
            unsubwatchlist();
        }
    }, [watchlistId])
    return {watchlist, loading}
}