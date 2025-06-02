import { Items } from '../hooks/useWatchlistItems';
import styles from '../page.module.css';
import VoteButtons from './VoteButtons';
import CheckBox from './CheckBox';
import { useState } from 'react';
import Image from 'next/image';
import { deleteItem } from '../lib/firebase/firestore';

export default function ListItem({
    item,
    upVote,
    downVote,
    watched,
}: {
    item: Items;
    upVote: any;
    downVote: any;
    watched: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);

    function handleDelete(){
        deleteItem(item);
    }

    return (
        <div>
            <div
                className={`${styles.watchlistItem} ${
                    watched && styles.checkedItem
                }`}
            >
                <CheckBox watched={watched} item={item} />
                <span
                    onClick={() => setIsOpen(!isOpen)}
                    className={styles.watchlistTitle}
                >
                    {item.title}
                </span>
                {!watched && (
                    <VoteButtons
                        item={item}
                        upVote={upVote}
                        downVote={downVote}
                    />
                )}
                <span onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '▲' : '▼'}
                </span>
            </div>

            {isOpen && (
                <div
                    className={`${styles.accordianDropdown} ${
                        watched && styles.checkedItem
                    }`}
                >   
                    {item.description !== '' && (
                        <>
                            <span className="bold">Description</span>
                            <p>{item.description}</p>
                        </>
                    )}

                    {item.length && (
                        <div>
                            <span className="bold">Length (in mintues)</span>
                            <span>{item.length}</span>
                        </div>
                    )}

                    {item.year && (
                        <div>
                            <span className="bold">Release Year</span>
                            <span>{item.year}</span>
                        </div>
                    )}

                    {item.imdbLink !== "" && (
                        <div>
                            <a href={item.imdbLink} target='_blank'>
                                <Image src={"/imdb-svgrepo-com.svg"} alt="IMDB link" width={25} height={50}/>
                            </a>
                        </div>
                    )}

                    { (!item.year && !item.year && item.description === "" && item.imdbLink === "") &&
                        <>
                            No details added yet!                    
                        </>
                    }

                    <button onClick={handleDelete}>Delete</button>
                    <button onClick={() => alert("i havent implemented this lol")}>Edit</button>



                </div>
            )}
        </div>
    );
}
