# Mark Perera Portfolio Website

This is the repository for my personal portfolio website, a fully responsive experience designed to showcase my skills and projects.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **3D Graphics:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) & [drei](https://github.com/pmndrs/drei)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Chat:** [Vercel AI SDK](https://sdk.vercel.ai/docs) with [Google Gemini](https://ai.google/discover/geminipro/)

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

To run the AI Chat feature, you will need to create a `.env` file in the root of the project and add your Google Gemini API key:

```
GOOGLE_API_KEY=your-api-key
```