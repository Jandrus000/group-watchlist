"use client"

import { Watchlist } from '../hooks/useUserWatchlist';
import Image from 'next/image';
import Modal from './Modal';
import { useState } from 'react';
import { deleteWatchlist } from '../lib/firebase/firestore';

export default function WatchlistDelete({
    watchlist,
}: {
    watchlist: Watchlist;
}) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Modal isOpen={modalOpen}>
                <h4>
                    Are you sure you want to delete &ldquo;{watchlist.name}
                    &#34;?
                </h4>
                <button
                    onClick={async () => {
                        await deleteWatchlist(watchlist);
                        window.location.reload();
                    }}
                >
                    Delete
                </button>
                <button onClick={() => setModalOpen(false)}>Cancel</button>
            </Modal>
            <Image
                src={'/trash.svg'}
                alt={'delete'}
                width={20}
                height={20}
                onClick={() => setModalOpen(true)}
            />
        </>
    );
}
