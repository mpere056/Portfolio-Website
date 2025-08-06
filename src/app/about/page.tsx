import HireMeDrawer from '@/components/HireMeDrawer';
import { getTimelineEntries } from '@/lib/timeline';
import { TimelineEntry as TimelineEntryType } from '@/lib/timeline';
import TimelineEntry from '@/components/TimelineEntry';

export default async function AboutPage() {
  const entries = await getTimelineEntries();

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <h1 className="text-4xl font-bold mb-8 text-center pt-8">About Me</h1>
      <div className="relative container mx-auto p-8">
        <div className="border-l-2 border-gray-200 absolute h-full top-0 left-1/2 -translate-x-1/2"></div>
        {entries.map((entry: TimelineEntryType) => (
          <TimelineEntry key={entry.id} entry={entry} />
        ))}
      </div>
      <HireMeDrawer />
    </div>
  );
}
