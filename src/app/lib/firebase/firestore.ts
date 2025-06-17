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
    updateDoc,
    increment,
    onSnapshot,
    QuerySnapshot,
    DocumentData,
    runTransaction,
    deleteDoc,
    deleteField,
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
    _userId: string,
    _description: string
) {
    try {
        await addDoc(collection(db, 'watchlists'), {
            name: _name,
            userId: _userId,
            description: _description,
            tags: {},
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
    _imdbLink: string | null = null,
    _genre: string[] | null = null,
    _tags: string[] | null
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
            genres: _genre,
            tags: _tags,
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

export async function getVote(
    itemId: string,
    userId: string,
    watchlistId: string
) {
    const itemRef = doc(db, 'watchlists', watchlistId, 'items', itemId);
    const voteRef = doc(itemRef, 'votes', userId);
    const voteDocSnap = await getDoc(voteRef);

    if (voteDocSnap.exists()) {
        return voteDocSnap.data().vote;
    } else {
        return null;
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

export function subscribeToWatchlist(
    watchlistId: string,
    onUpdate: (watchlistData: any) => void
): () => void {
    const docRef = doc(db, 'watchlists', watchlistId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            onUpdate({ id: docSnap.id, ...docSnap.data() });
        }
    });
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
            transaction.set(voteRef, {
                userId,
                vote: voteValue,
                itemId: itemId,
            });
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
            updatedAt: serverTimestamp(),
        });
    });
}

export async function updateWatchState(
    watchListId: string,
    itemId: string,
    watchedState: boolean
) {
    const itemRef = doc(db, 'watchlists', watchListId, 'items', itemId);
    const snapShot = await getDoc(itemRef);
    console.dir(snapShot.data());
    try {
        await updateDoc(itemRef, {
            watched: watchedState,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error(error);
    }
}

export async function incrementTag(watchListId: string, tag: string) {
    const key = tag.toLowerCase().replace(/[^a-z0-9_]/gi, '_');
    const tagKey = `tags.${key}`;
    const docRef = doc(db, 'watchlists', watchListId);

    await updateDoc(docRef, {
        [`${tagKey}.count`]: increment(1),
    });

    const snap = await getDoc(docRef);

    if (!snap.exists()) return;

    const data = snap.data();
    const currentCount = data.tags[key].count ?? 0;
    if (currentCount === 1) {
        await updateDoc(docRef, {
            [`${tagKey}.name`]: tag,
        });
    }
}

export async function decrementTag(watchListId: string, tag: string) {
    const tagKey = `tags.${tag.toLowerCase().replace(/[^a-z0-9_]/gi, '_')}`;

    const docRef = doc(db, 'watchlists', watchListId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return;

    const data = snap.data();
    const currentCount =
        data.tags?.[tag.toLowerCase().replace(/[^a-z0-9_]/gi, '_')].count ?? 0;

    if (currentCount <= 1) {
        await updateDoc(docRef, {
            [tagKey]: deleteField(),
        });
    } else {
        await updateDoc(docRef, {
            [tagKey]: increment(-1),
        });
    }
}

// ============== delete ==============

export async function deleteItem(item: Items) {
    const voteRef = collection(
        db,
        'watchlists',
        item.watchListId,
        'items',
        item.id,
        'votes'
    );
    const voteSnapshot = await getDocs(voteRef);
    try {
        const voteDeletes = voteSnapshot.docs.map((voteDoc) =>
            deleteDoc(voteDoc.ref)
        );
        await Promise.all(voteDeletes);

        // if (item.tags){
        //     for(const tag of item.tags) {
        //         await decrementTag(item.watchListId, tag)
        //     }
        // }

        await deleteDoc(
            doc(db, 'watchlists', item.watchListId, 'items', item.id)
        );
    } catch (e) {
        console.error(e);
    }
}

export async function deleteWatchlist(watchlist: Watchlist) {
    const itemsDocRef = collection(db, 'watchlists', watchlist.id, 'items');
    const itemsSnapshot = await getDocs(itemsDocRef);
    try {
        for (const itemDoc of itemsSnapshot.docs) {
            const itemId = itemDoc.id;
            const votesCollectionRef = collection(
                db,
                'watchlists',
                watchlist.id,
                'items',
                itemId,
                'votes'
            );
            const votesSnapshot = await getDocs(votesCollectionRef);

            const voteDeletes = votesSnapshot.docs.map((voteDoc) =>
                deleteDoc(voteDoc.ref)
            );
            await Promise.all(voteDeletes);

            await deleteDoc(itemDoc.ref);
        }
        await deleteDoc(doc(db, 'watchlists', watchlist.id));
    } catch (e) {
        console.error(e);
    }
}
