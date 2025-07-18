import { OptionType, Items } from './types';

export const genres = [
    'Action',
    'Adventure',
    'Anthology',
    'Animation',
    'Anime',
    'Biographical',
    'Children',
    'Comedy',
    'Coming of Age',
    'Computer Animation',
    'Crime',
    'Cyberpunk',
    'Dance',
    'Dark Comedy',
    'Disaster',
    'Documentary',
    'Drama',
    'Dystopian',
    'Educational',
    'Esports',
    'Experimental',
    'Family',
    'Fantasy',
    'Food',
    'Game Show',
    'Harem',
    'Heist',
    'Historical',
    'Horror',
    'Isekai',
    'Legal',
    'Live Action',
    'Martial Arts',
    'Mecha',
    'Medical',
    'Mockumentary',
    'Music',
    'Musical',
    'Mystery',
    'Mythology',
    'Nature',
    'Noir',
    'Parody',
    'Period Drama',
    'Political',
    'Post-Apocalyptic',
    'Psychological',
    'Reality TV',
    'Road Movie',
    'Romance',
    'Romantic Comedy',
    'Samurai',
    'Satire',
    'School',
    'Science Fiction',
    'Short',
    'Slice of Life',
    'Soap',
    'Space Opera',
    'Sports',
    'Spy',
    'Stand-Up',
    'Steampunk',
    'Superhero',
    'Supernatural',
    'Suspense',
    'Talk Show',
    'Thriller',
    'Time Travel',
    'TV Movie',
    'Urban',
    'Variety Show',
    'Vampire',
    'War',
    'Western',
    'Whodunit',
    'Zombie',
];

export const customStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: 'var(--highlighted-bg)',
    borderColor: 'var(--border-light)',
    borderRadius: '8px',
    height: '50px',
    padding: '2px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'var(--text-color)'
    }
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: 'var(--border-light)',
    borderRadius: '6px',
    padding: '2px',
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: 'var(--text-color)',
    fontWeight: 500
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: 'var(--text-color)',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'var(--text-color)',
      color: 'white'
    }
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: 'var(--highlighted-bg)',
    zIndex: 99
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused
      ? 'var(--border-light)'
      : 'transparent',
    color: 'var(--text-color)',
    cursor: 'pointer'
  }),
  input: (base: any) => ({
    ...base,
    color: 'var(--text-color)'
  }),
  placeholder: (base: any) => ({
    ...base,
    color: 'var(--border-light)'
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'var(--text-color)'
  })
}

// todo refactor code to not repeat (use helper functions)
export function applyFilter(
    list: Items[],
    votesFrom: string,
    votesTo: string,
    selectedGenres: OptionType[],
    selectedTypes: OptionType[],
    selectedRatings: OptionType[],
    selectedTags: OptionType[],
    runtimeFrom: string,
    runtimeTo: string,
    yearFrom: string,
    yearTo: string,
    imdbRatingFrom: string,
    imdbRatingTo: string,
    dateFrom: string,
    dateTo: string
) {
    let filteredList = list;
    if (votesFrom !== '' && votesTo !== '') {
        const votesFromInt = Number(votesFrom);
        const votesToInt = Number(votesTo);

        filteredList = filteredList.filter(
            (item: Items) =>
                (item.upVotes >= votesFromInt && item.upVotes <= votesToInt) ||
                (item.upVotes >= votesToInt && item.upVotes <= votesFromInt)
        );
    }

    if (selectedGenres.length > 0) {
        const selectedGenreValues = selectedGenres.map((g) => g.value);
        filteredList = filteredList.filter((item: Items) =>
            item.genres?.some((genre) => selectedGenreValues.includes(genre))
        );
    }

    if (selectedRatings.length > 0) {
        const selectedRatingsValues = selectedRatings.map((r) => r.value);
        filteredList = filteredList.filter((item: Items) =>
            selectedRatingsValues.includes(item.rating)
        );
    }

    if (selectedTypes.length > 0) {
        const selectedTypesValues = selectedTypes.map((t) => t.value);
        filteredList = filteredList.filter((item: Items) =>
            selectedTypesValues.includes(item.type)
        );
    }

    if (selectedTags.length > 0) {
        const selectedTagsValues = selectedTags.map((t) => t.value);
        filteredList = filteredList.filter((item: Items) =>
            item.tags?.some((tag) => selectedTagsValues.includes(tag))
        );
    }

    if (runtimeFrom || runtimeTo) {
        const from = Number(runtimeFrom);
        const to = Number(runtimeTo);
        const min = Math.min(from, to);
        const max = Math.max(from, to);

        filteredList = filteredList.filter((item: Items) => {
            const length = item.length;
            if (length == null || isNaN(length)) return false;
            return length >= min && length <= max;
        });
    }

    if (yearFrom || yearTo) {
        const from = Number(yearFrom);
        const to = Number(yearTo);
        const min = Math.min(from, to);
        const max = Math.max(from, to);

        filteredList = filteredList.filter((item: Items) => {
            const year = item.year;
            if (year == null || isNaN(year)) return false;
            return year >= min && year <= max;
        });
    }

    if (imdbRatingFrom || imdbRatingTo) {
        const from = Number(imdbRatingFrom);
        const to = Number(imdbRatingTo);
        const min = Math.min(from, to);
        const max = Math.max(from, to);

        filteredList = filteredList.filter((item: Items) => {
            const rating = item.imdbRating;
            if (rating == null || isNaN(rating)) return false;
            return rating >= min && rating <= max;
        });
    }

    if (dateFrom || dateTo) {
        const fromMillis = new Date(dateFrom).getTime();
        const toMillis = new Date(dateTo).getTime();
        const min = Math.min(fromMillis, toMillis);
        const max = Math.max(fromMillis, toMillis);

        filteredList = filteredList.filter((item: Items) => {
            const createdAtMillis = item.createdAt.toDate().getTime();
            return createdAtMillis >= min && createdAtMillis <= max;
        });
    }

    return filteredList;
}
