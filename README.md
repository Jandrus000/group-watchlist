This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## I added

### Wireframes

- [sign in?]()
- [Watchlists page](https://wireframe.cc/gUXnyI)
- [Individual list (movie details)](https://wireframe.cc/WbNstm)
- [add movie]()
- [show details]()
- [filtering]()
- [sharing]()
- [filtering]()

### Data structure
```
users/{userId}
{
  username: string,
  createdAt: Timestamp
}

watchlists/{watchlistId}
{
  userId: "abc123",
  name: "Favorites",
  createdAt: Timestamp
}

watchlistMovies/{entryId}
{
  watchlistId: "xyz456",
  movieId: "movie789",
  addedAt: Timestamp
}

movies/{movieId}
{
  votes: SubCollection
  id: string; ✅
  title: string;  ✅
  year: number | null; ✅
  length: number | null; ✅
  description: string | null; ✅
  imdbLink: string; ✅
  createdBy: string; ✅
  watchListId: string; ✅
  upVotes: number; ✅
  watched: boolean; ✅
  createdAt: Timestamp; ✅
  updatedAt: Timestamp; ✅
  genre ✅
  tags ✅
  director: string
  imdbRating: number
  mpaRating: string
  trailerurl: string
  show: boolean ✅
  season: number
  end-year: number
  Avgepisodes: number per season 
}
```



