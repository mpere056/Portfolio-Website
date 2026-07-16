# Mark Perera Portfolio Website

This is the repository for my personal portfolio website, a fully responsive experience designed to showcase my skills and projects.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **3D Graphics:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) & [drei](https://github.com/pmndrs/drei)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Chat:** [Vercel AI SDK](https://sdk.vercel.ai/docs) with Google Gemini and server-side Firestore vector retrieval

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

To run retrieval and AI Chat, create a `.env.local` file in the repository root with server-only Google and Firebase credentials:

```dotenv
GOOGLE_API_KEY=your-api-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Never prefix these values with `NEXT_PUBLIC_` or commit a service-account JSON file. The Firestore database uses deny-all client rules; application access is through the server service account.

To rebuild the retrieval corpus from the current MDX content:

```bash
npm run ingest
```
