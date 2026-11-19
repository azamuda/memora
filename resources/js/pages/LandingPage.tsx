import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FeatureStrip } from '../components/FeatureStrip';
import { StoryShowcase } from '../components/StoryShowcase';
import { PricingSection } from '../components/PricingSection';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/modals/AuthModal';
import { StoryModal } from '../components/modals/StoryModal';
import { HowItWorksModal } from '../components/modals/HowItWorksModal';

interface LandingPageProps {
  onGoToDashboard: () => void;
  isLoggedIn: boolean;
  onLoginSuccess: (userData: { name: string; email: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToDashboard,
  isLoggedIn,
  onLoginSuccess,
}) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EB] text-[#20231F] flex flex-col font-sans selection:bg-[#E8703D] selection:text-white">
      {/* A. Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onGoToDashboard={onGoToDashboard}
        isLoggedIn={isLoggedIn}
      />

      <main className="flex-1">
        {/* B. Hero Section */}
        <HeroSection
          onStart={() => handleOpenAuth('register')}
          onOpenHowItWorks={() => setHowItWorksModalOpen(true)}
        />

        {/* C. Feature Strip */}
        <FeatureStrip />

        {/* D. Story / Editorial Showcase */}
        <StoryShowcase onOpenStory={() => setStoryModalOpen(true)} />

        {/* E. Pricing / Final CTA Section */}
        <PricingSection onRegister={() => handleOpenAuth('register')} />
      </main>

      {/* F. Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccessLogin={(userData) => {
          onLoginSuccess(userData);
          onGoToDashboard();
        }}
      />

      <StoryModal
        isOpen={storyModalOpen}
        onClose={() => setStoryModalOpen(false)}
      />

      <HowItWorksModal
        isOpen={howItWorksModalOpen}
        onClose={() => setHowItWorksModalOpen(false)}
        onStartAccount={() => handleOpenAuth('register')}
      />
    </div>
  );
};
