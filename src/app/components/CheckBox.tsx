import { Items } from "../hooks/useWatchlistItems"
import { updateWatchState } from "../lib/firebase/firestore"
import styles from '../page.module.css'

export default function CheckBox({ watched, item }: { watched: boolean , item: Items}) {
    
    async function handleCheck(){
        if(item.watched){
            await updateWatchState(item.watchListId, item.id, false)
        }else{
            await updateWatchState(item.watchListId, item.id, true)
        }
    }
    
    return (
        <span className={styles.watchlistCheckbox}>
            {watched ? (
                <input type="checkbox" onClick={handleCheck} defaultChecked/>
            ) : (
                <input type="checkbox" onClick={handleCheck}/>
            )}
        </span>
)
}
