'use client';

import styles from './page.module.css';
import Modal from './components/Modal';
import { useState } from 'react';
import {useAuthContext} from './context/AuthContext'
import { useUserWatchlist } from './hooks/useUserWatchlist';
import WatchlistDelete from './components/WatchlistDelete';
import Image from 'next/image';

export default function Home() {
	const {user} = useAuthContext()
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [watchlistName, setWatchlistName] = useState('');
	const [wlDescription, setWlDescription] = useState('')
	const { watchlists, loading, addWatchlist } = useUserWatchlist(user)

	const handleCreateWatchlist = async () => {
		if (watchlistName.trim() !== '') {
			await addWatchlist(watchlistName.trim(), wlDescription)
			setWatchlistName('');
			setWlDescription('');
			setIsModalOpen(false);
		}
	};


	return (
		<div className={styles.mainWatchlistContent}>
			<div className={styles.addWatchlistButton}>
				<button onClick={() => setIsModalOpen(true)}>
					<Image src={'/plus.svg'} alt={'+'} width={15} height={10}/>
				</button>
				<span>Add a watchlist</span>
			</div>
			<Modal isOpen={isModalOpen}>
				{user ? (<>
					<label htmlFor="watchlist-name">Enter Watchlist Name</label>
					<input
						id="watchlist-name"
						type="text"
						value={watchlistName}
						onChange={(e) => setWatchlistName(e.target.value)}
						required
					></input>

					<label htmlFor="watchlist-description">Enter Description</label>
					<textarea
						id="watchlist-description"
						onChange={(e) => setWlDescription(e.target.value)}
						maxLength={400}
					></textarea>
					
					
					<button onClick={handleCreateWatchlist}>Create</button>
					<button onClick={() => setIsModalOpen(false)}>Cancel</button>
				</>) : (<>
					<button onClick={() => setIsModalOpen(false)}>X</button>
					<p>You should sign in so what you do can be saved</p>
				</>)}
			</Modal>
			{ loading ? (
				<div>loading...</div>
			): (

				<div>
					{watchlists.map((w) => (
						<div className={styles.watchlistCard} key={w.id}>
							<a href={`\\watchlists\\${w.id}`}>
								<h4>{w.name}</h4>
								<p>{w.description}</p>
							</a>

							<div>
								<WatchlistDelete watchlist={w}/>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
