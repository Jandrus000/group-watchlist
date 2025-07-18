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
import { Items, Watchlist } from '../types';

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
    _description: string,
    _type: "public" | "private"
) {
    try {
        await addDoc(collection(db, 'watchlists'), {
            name: _name,
            userId: _userId,
            description: _description,
            tags: {},
            private: (_type === "private"),
            createdAt: serverTimestamp(),
        });
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

export async function addWatchlistItem(
    _title: string,
    _type: 'movie' | 'tv' | 'other',
    _watchListId: string,
    _createdBy: string,
    _createdByUsername: string | null,
    _rating:
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
    _year: number | null = null,
    _endYear: number | null = null,
    _length: number | null = null,
    _description: string | null = null,
    _imdbLink: string | null = null,
    _genre: string[] | null = null,
    _tags: string[] | null = null,
    _director: string | null = null,
    _imdbRating: number | null = null,
    _trailerLink: string | null = null,
    _seasons: number | null = null,
    _episodes: number | null = null
) {
    try {
        const itemsCollectionRef = collection(
            doc(db, 'watchlists', _watchListId),
            'items'
        );
        await addDoc(itemsCollectionRef, {
            title: _title,
            type: _type,
            year: _year,
            endYear: _endYear,
            length: _length,
            description: _description,
            imdbLink: _imdbLink,
            createdBy: _createdBy,
            createdByUsername: _createdByUsername,
            watchListId: _watchListId,
            genres: _genre,
            tags: _tags,
            director: _director,
            rating: _rating,
            imdbRating: _imdbRating,
            trailerLink: _trailerLink,
            seasons: _seasons,
            episodes: _episodes,
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

export async function getUserName(userId: string) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data().username;
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

export function subscribeToSavedWatchlist(
    userId: string,
    onUpdate: (saved: any) => void
) {
    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
        const data = docSnap.data();
        const saved = data?.savedWatchlists || {};
        if (docSnap.exists()) {
            onUpdate(saved);
        }
    });

    return unsubscribe;
}

// ============== update ==============
export async function toggleSave(
    userId: string,
    watchlistId: string,
    watchlistName: string,
    watchlistDescription: string
) {
    const userRef = doc(db, 'users', userId);
    const snapShot = await getDoc(userRef);
    try {
        const userData = snapShot.data();
        const saved = userData?.savedWatchlists?.[watchlistId];

        if (saved) {
            await updateDoc(userRef, {
                [`savedWatchlists.${watchlistId}`]: deleteField(),
            });
        } else {
            await updateDoc(userRef, {
                [`savedWatchlists.${watchlistId}`]: {
                    name: watchlistName,
                    description: watchlistDescription,
                },
            });
        }
    } catch (e) {
        console.error(e);
    }
}

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

    await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(docRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const tagData = data.tags?.[tag.toLowerCase().replace(/[^a-z0-9_]/gi, '_')];
        const currentCount = tagData?.count ?? 0;

        if (currentCount <= 1) {
            transaction.update(docRef, {
                [tagKey]: deleteField(),
            });
        } else {
            transaction.update(docRef, {
                [tagKey + '.count']: increment(-1),
            });
        }
    });
}

export async function editItem(
    _title: string,
    _type: 'movie' | 'tv' | 'other',
    watchlistId: string,
    itemId: string,
    _rating:
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
    _year: number | null = null,
    _endYear: number | null = null,
    _length: number | null = null,
    _description: string | null = null,
    _imdbLink: string | null = null,
    _pickedGenres: string[] | null = null,
    _pickedTags: string[] | null = null,
    _director: string | null = null,
    _imdbRating: number | null = null,
    _trailerLink: string | null = null,
    _seasons: number | null = null,
    _episodes: number | null = null
) {
    const itemRef = doc(db, 'watchlists', watchlistId, 'items', itemId);
    const snapShot = await getDoc(itemRef);
    if (!snapShot.exists()) throw new Error('Items not found');
    const existing = snapShot.data();

    const updates: any = {};

    // compares all values and stores changes in updates
    if (_title !== existing.title) updates.title = _title;
    if (_type !== existing.type) updates.type = _type;
    if (_rating !== existing.rating) updates.rating = _rating;
    if (_year !== existing.year) updates.year = _year;
    if (_endYear !== existing.endYear) updates.endYear = _endYear;
    if (_length !== existing.length) updates.length = _length;
    if (_description !== existing.description)
        updates.description = _description;
    if (_imdbLink !== existing.imdbLink) updates.imdbLink = _imdbLink;
    if (_director !== existing.director) updates.director = _director;
    if (_imdbRating !== existing.imdbRating) updates.imdbRating = _imdbRating;
    if (_trailerLink !== existing.trailerLink)
        updates.trailerLink = _trailerLink;
    if (_seasons !== existing.seasons) updates.seasons = _seasons;
    if (_episodes !== existing.episodes) updates.episodes = _episodes;
    // compares genres and tags with stringified for shallow comparison
    if (JSON.stringify(_pickedGenres) !== JSON.stringify(existing.genres))
        updates.genres = _pickedGenres;
    if (JSON.stringify(_pickedTags) !== JSON.stringify(existing.tags))
        updates.tags = _pickedTags;

    try {
        if (Object.keys(updates).length > 0) {
            updates.updatedAt = serverTimestamp();
            await updateDoc(itemRef, updates);
        }
    } catch (e) {
        console.error(e);
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
