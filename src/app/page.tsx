import HeroCube from "@/components/HeroCube";
import { resolveFeatureFlags } from "@/lib/featureFlags";

export default function Home() {
  const flags = resolveFeatureFlags();
  return (
    <main>
      <HeroCube firstNoteEnabled={flags.firstNote} />
    </main>
  );
}
