'use client';

import { Watchlist } from '../lib/types';
import Image from 'next/image';
import Modal from './Modal';
import { useState } from 'react';
import { deleteWatchlist } from '../lib/firebase/firestore';
import styles from "../styles/page.module.css"

export default function WatchlistDelete({
    watchlist,
}: {
    watchlist: Watchlist;
}) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Modal isOpen={modalOpen} >
                <button
                    className="x-button"
                    onClick={() => setModalOpen(false)}
                >
                    <Image
                        src={'/cross.svg'}
                        alt={'close'}
                        width={20}
                        height={20}
                    />
                </button>
                <h4>
                    Are you sure you want to delete &ldquo;{watchlist.name}
                    &#34;?
                </h4>
                <button
                    onClick={async () => {
                        setModalOpen(false)
                        await deleteWatchlist(watchlist);
                        window.location.reload();
                    }}
                    className='submit-button'
                >
                    Delete
                </button>
            </Modal>
            <Image
                src={'/trash.svg'}
                alt={'delete'}
                width={20}
                height={20}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModalOpen(true);
                }}
            />
        </>
    );
}
