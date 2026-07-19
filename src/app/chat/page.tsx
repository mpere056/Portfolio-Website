import { redirect } from 'next/navigation';

export default async function LegacyChatPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string | string[] }>;
}) {
  const { prompt: rawPrompt } = await searchParams;
  const prompt = Array.isArray(rawPrompt) ? rawPrompt[0] : rawPrompt;
  const query = new URLSearchParams({ archive: 'open' });
  if (prompt?.trim()) query.set('prompt', prompt.trim().slice(0, 500));
  redirect(`/?${query.toString()}`);
}
