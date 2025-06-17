import {notFound} from 'next/navigation'
import { getWatchlistDoc } from '@/app/lib/firebase/firestore';
import WatchlistComponent from '../../components/WatchlistPage'
import { Watchlist } from '@/app/hooks/useUserWatchlist';

export default async function WatchlistPage({ params }: {params: Promise<{watchlistId: string}>}) {
    const {watchlistId} = await params;
    const watchlistDoc = await getWatchlistDoc(watchlistId)

    if(!watchlistDoc.exists()){
        return notFound();
    }

    const data : any = {
        id: watchlistDoc.id,
        ...watchlistDoc.data()
    };
    data["createdAt"] = data.createdAt?.toDate().toISOString()
    const watchlist: Watchlist = data

    return (
        <WatchlistComponent watchlist={watchlist}/>
    )
}

