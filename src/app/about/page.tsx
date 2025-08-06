import { getTimelineEntries } from '@/lib/timeline';
import AboutClientPage from '@/components/AboutClientPage';

export default async function AboutPage() {
  const entries = await getTimelineEntries();

  return <AboutClientPage entries={entries} />;
}
