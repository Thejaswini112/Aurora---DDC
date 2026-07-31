import { Sparkles, BrainCircuit, Lightbulb, LineChart } from 'lucide-react';
import { ComingSoon } from '@/components/common';

export function InsightsPage() {
  return (
    <ComingSoon
      title="Insights"
      description="AI-generated intelligence that explains your exposure posture, surfaces emerging risks, and recommends the highest-leverage actions — explained, never auto-executed."
      icon={Sparkles}
      highlights={[
        {
          icon: BrainCircuit,
          title: 'Posture narratives',
          description: 'Plain-language weekly summaries of how your sensitive-data exposure shifted and why, grounded in detections and scans.',
        },
        {
          icon: Lightbulb,
          title: 'Recommended actions',
          description: 'Prioritized, explainable recommendations ranked by risk reduction — each requiring human approval before enactment.',
        },
        {
          icon: LineChart,
          title: 'Trend intelligence',
          description: 'Spot emerging exposure patterns before they become incidents, with severity-weighted trajectory analysis.',
        },
      ]}
      roadmap={[
        { label: 'Weekly posture summary', status: 'in_progress' },
        { label: 'AI recommendation feed', status: 'next' },
        { label: 'Exposure trend deep-dive', status: 'planned' },
        { label: 'Benchmark vs. industry peers', status: 'planned' },
      ]}
    />
  );
}
