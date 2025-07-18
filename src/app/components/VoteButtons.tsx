"use client"

import { useAuthContext } from '../context/AuthContext';
import { use, useEffect, useState } from 'react';
import { getVote } from '../lib/firebase/firestore';
import styles from '../styles/page.module.css';

export default function VoteButtons({
    item,
    upVote,
    downVote,
}: {
    item: any;
    upVote: any;
    downVote: any;
}) {
    const { user, loading } = useAuthContext();
    const [userVote, setUserVote] = useState<number | null>(null);
    // const [voteCount, setVoteCount] = useState<number>(0);

    useEffect(() => {
        const fetchVote = async () => {
            if (user?.uid) {
                const vote = await getVote(item.id, user.uid, item.watchListId);
                setUserVote(vote);
            }
        };
        fetchVote();
        // setVoteCount(item.upVotes)
    }, [item.id, item.watchListId, user?.uid])

    function handleVote(vote: number){
        if (vote === userVote){
            setUserVote(0)
            // setVoteCount(voteCount - (vote * 2))
        }else{
            setUserVote(vote)
            // setVoteCount(voteCount + vote)
        }

        // applies upvote by calling upvote functions in useWatchlistItems which
        // applies the vote in the database
        if (vote>0){
            upVote(item.id, user?.uid)
        } else{
            downVote(item.id, user?.uid)
        }
    }
    return (
        <div className={styles.votebuttons}>
            <button
                className={userVote === 1 ? styles.upVoted : ''}
                onClick={() => handleVote(1)}
            >
                ↑
            </button>
            <span className={styles.voteCounter}>{item.upVotes === 0 ? '-' : item.upVotes}</span>
            <button
                className={userVote === -1 ? styles.downVoted : ''}
                onClick={() => handleVote(-1)}
            >
                ↓
            </button>
        </div>
    );
}
