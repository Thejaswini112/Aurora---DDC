import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/common';
import { BriefHero } from './overview/BriefHero';
import { SecurityHealthSection } from './overview/SecurityHealthSection';
import { WorkQueueSection } from './overview/WorkQueueSection';
import { RiskTrendSection } from './overview/RiskTrendSection';
import { RecommendationsSection } from './overview/RecommendationsSection';
import { ActivitySection } from './overview/ActivitySection';
import { RepositoryHealthSection } from './overview/RepositoryHealthSection';
import { QuickActionsSection } from './overview/QuickActionsSection';

export function OverviewPage() {
  const navigate = useNavigate();

  return (
    <PageContainer className="py-8">
      <BriefHero
        onPrimary={() => navigate('/detections')}
        onSecondary={() => navigate('/scan-management')}
      />
      <SecurityHealthSection />
      <WorkQueueSection />
      <RiskTrendSection />
      <RecommendationsSection />
      <ActivitySection />
      <RepositoryHealthSection />
      <QuickActionsSection />
    </PageContainer>
  );
}
