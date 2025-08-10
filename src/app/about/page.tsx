import { getTimelineEntries } from '@/lib/timeline';
import AboutClientPage from '@/components/AboutClientPage';
import NavHomeIcon from '@/components/NavHomeIcon';

export default async function AboutPage() {
  const entries = await getTimelineEntries();

  return (
    <>
      <NavHomeIcon />
      <AboutClientPage entries={entries} />
    </>
  );
}
