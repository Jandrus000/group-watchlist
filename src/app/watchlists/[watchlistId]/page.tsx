import {notFound} from 'next/navigation'
import { getWatchlistDoc } from '@/app/lib/firebase/firestore';
import Watchlist from '../../components/Watchlist'

interface WatchlistPageProps{
    params: {watchlistId: string};
}

export default async function WatchlistPage({params} : WatchlistPageProps){
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
    const watchlist = data

    return (
        <Watchlist watchlist={watchlist}/>
    )
}

