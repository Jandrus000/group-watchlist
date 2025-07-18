import { Timestamp } from "firebase/firestore/lite";
import { User } from 'firebase/auth';

export type Watchlist = {
    id: string;
    name: string;
    userId: string;
    description: string;
    createdAt: Timestamp;
    private: boolean | null;
    tags: {[key: string]:{ tagIndex: number; name: string }};
};

export type OptionType = { label: string; value: string };

export type Items = {
    id: string;
    title: string;
    type: 'movie' | 'tv' | 'other';
    year: number | null;
    endYear: number | null;
    length: number | null;
    description: string | null;
    imdbLink: string;
    createdBy: string;
    createdByUsername: string;
    watchListId: string;
    upVotes: number;
    watched: boolean;
    genres: string[] | null;
    tags: string[] | null;
    director: string | null;
    rating:
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
        | 'tv-ma';
    imdbRating: number | null;
    trailerLink: string | null;
    seasons: number | null;
    episodes: number | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type AuthContextType = {
    user: User | null;
    loading: boolean;
}
