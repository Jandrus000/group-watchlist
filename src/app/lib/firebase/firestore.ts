import { User } from 'firebase/auth';
import { db } from './firebase';
import {
    collection,
    addDoc,
    doc,
    setDoc,
    serverTimestamp,
    getDoc,
    getDocs,
    query,
    where,
    Timestamp,
    updateDoc,
    increment,
    onSnapshot,
    QuerySnapshot,
    DocumentData,
    runTransaction,
    deleteDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Items } from '@/app/hooks/useWatchlistItems';
import { Watchlist } from '@/app/hooks/useUserWatchlist';

// ============== create ==============
export async function addUser(user_name: string, userId: string) {
    try {
        await setDoc(doc(db, 'users', userId), {
            username: user_name,
            createdAt: serverTimestamp(),
        });
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

export async function addUserGoogle(user_name: string | null, userId: string) {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
            await setDoc(userDocRef, {
                username: user_name || 'Anonymous',
                createdAt: serverTimestamp(),
            });
        }
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

export async function addWatchlist(
    _name: string,
    _userId: string | null,
    _description: string
) {
    try {
        await addDoc(collection(db, 'watchlists'), {
            name: _name,
            userId: _userId,
            description: _description,
            createdAt: serverTimestamp(),
        });
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

export async function addWatchlistItem(
    _title: string,
    _watchListId: string,
    _createdBy: string,
    _year: number | null = null,
    _length: number | null = null,
    _description: string | null = null,
    _imdbLink: string | null = null
) {
    try {
        const itemsCollectionRef = collection(
            doc(db, 'watchlists', _watchListId),
            'items'
        );
        await addDoc(itemsCollectionRef, {
            title: _title,
            year: _year,
            length: _length,
            description: _description,
            imdbLink: _imdbLink,
            createdBy: _createdBy,
            watchListId: _watchListId,
            upVotes: 0,
            watched: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (e) {
        console.error('Error adding document:', e);
    }
}

// ============== read ==============
export async function getUserWatchlists(user: User | null) {
    if (!user) {
        return [];
    }

    const userId = user.uid;
    const q = query(
        collection(db, 'watchlists'),
        where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const watchlists = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return watchlists;
}

export async function getWatchlistDoc(watchListId: string) {
    const docRef = doc(db, 'watchlists', watchListId);
    const docSnap = await getDoc(docRef);
    return docSnap;
}

export async function getWatchlistItems(watchListId: string) {
    if (!watchListId) {
        return [];
    }

    const itemsCollectionRef = collection(
        doc(db, 'watchlists', watchListId),
        'items'
    );
    const querySnapshot = await getDocs(itemsCollectionRef);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function getVote(itemId: string, userId: string, watchlistId: string){
    const itemRef = doc(db, 'watchlists', watchlistId, 'items', itemId);
    const voteRef = doc(itemRef, 'votes', userId);
    const voteDocSnap = await getDoc(voteRef);

    if (voteDocSnap.exists()){
        return voteDocSnap.data().vote
    } else{
        return null
    }
}   

// ============== listeners ==============
export function subscribeToWatchlistItems(
    watchListId: string,
    onUpdate: (items: any[]) => void
): () => void {
    const q = query(collection(db, 'watchlists', watchListId, 'items'));

    const unsubscribe = onSnapshot(
        q,
        (querySnapShot: QuerySnapshot<DocumentData>) => {
            const items = querySnapShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            onUpdate(items);
        }
    );

    return unsubscribe;
}

// ============== update ==============
export async function handleVote(
    itemId: string,
    userId: string,
    voteValue: number,
    watchlistId: string
) {
    const itemRef = doc(db, 'watchlists', watchlistId, 'items', itemId);
    const voteRef = doc(itemRef, 'votes', userId);

    await runTransaction(db, async (transaction) => {
        const itemDoc = await transaction.get(itemRef);
        const voteDoc = await transaction.get(voteRef);

        if (!itemDoc.exists()) {
            throw new Error('Item does not exist!');
        }

        let voteChange = 0;

        if (!voteDoc.exists()) {
            // No existing vote; add new vote
            transaction.set(voteRef, { userId, vote: voteValue });
            voteChange = voteValue;
        } else {
            const existingVote = voteDoc.data().vote;
            if (existingVote === voteValue) {
                // Same vote exists; remove vote
                transaction.delete(voteRef);
                voteChange = -voteValue;
            } else {
                // Opposite vote exists; update vote
                transaction.update(voteRef, { vote: voteValue });
                voteChange = 2 * voteValue;
            }
        }

        transaction.update(itemRef, {
            upVotes: increment(voteChange),
        });
    });
}

export async function updateWatchState(watchListId: string, itemId:string, watchedState: boolean){
    const itemRef = doc(db, "watchlists", watchListId, "items", itemId);
    const snapShot = await getDoc(itemRef)
    console.dir(snapShot.data())
    try{
        await updateDoc(itemRef, {
            watched: watchedState
        })
    } catch(error){
        console.error(error)
    }
    
}

// ============== delete ==============

export async function deleteItem(item: Items){
    const docRef = doc(db, 'watchlists', item.watchListId, 'items', item.id)
    try{
        await deleteDoc(docRef);
    }catch(e){
        console.error(e)
    }
}

export async function deleteWatchlist(watchlist: Watchlist){
    const docRef = doc(db, 'watchlists', watchlist.id)
    console.log('im here')
    try{
        await deleteDoc(docRef);
    }catch(e){
        console.error(e)
    }
}