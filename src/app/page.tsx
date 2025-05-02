'use client'

import styles from './page.module.css'
import Modal from './components/Modal';
import {useState} from 'react'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className={styles.mainWatchlistContent}>
      <div className={styles.addWatchlistButton}>
        <button onClick={() => setIsModalOpen(true)}>+</button>
        <span>Add a watchlist</span>
      </div>
      <Modal isOpen={isModalOpen}>
        <label>Enter Watchlist Name</label>
        <input></input>
        <button>Create</button>
        <button onClick={()=> setIsModalOpen(false)}>Cancel</button>
      </Modal>
      <div>
      
      </div>
    </div>
  );
}
