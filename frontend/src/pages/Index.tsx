import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { BloodRequestsSection } from '@/components/home/BloodRequestsSection';
import { HospitalsSection } from '@/components/home/HospitalsSection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <BloodRequestsSection />
      <HospitalsSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
