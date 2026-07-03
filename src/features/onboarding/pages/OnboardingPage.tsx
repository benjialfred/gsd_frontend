import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../../stores/useOnboardingStore';
import { useUpdateProfileMutation, useProfileCompletion } from '../../../hooks/useProfile';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { NavigationControls } from '../components/NavigationControls';
import { SaveAndExitModal } from '../components/SaveAndExitModal';
import { trackEvent } from '../../../services/analytics';

// Import all step components
import { WelcomeStep } from './steps/WelcomeStep';
import { IdentityStep } from './steps/IdentityStep';
import { LocationStep } from './steps/LocationStep';
import { ProfessionStep } from './steps/ProfessionStep';
import { SpiritualityStep } from './steps/SpiritualityStep';
import { PersonalityStep } from './steps/PersonalityStep';
import { MarriageVisionStep } from './steps/MarriageVisionStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { SummaryStep } from './steps/SummaryStep';
import { MediaUploadStep } from './steps/MediaUploadStep';
import { KYCPromptStep } from './steps/KYCPromptStep';

const TOTAL_STEPS = 11;

export const OnboardingPage: React.FC = () => {
  const { currentStep, nextStep, prevStep, formData, setStep } = useOnboardingStore();
  const updateProfileMutation = useUpdateProfileMutation();
  const { data: completionData } = useProfileCompletion();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsSaveModalOpen(true);
    document.addEventListener('open-save-exit', handleOpenModal);
    return () => document.removeEventListener('open-save-exit', handleOpenModal);
  }, []);

  // Resume logic (if user is returning, start from highest step reached)
  // This is handled automatically by Zustand persist, we just need to ensure they start at `currentStep`.
  
  // Track ONBOARDING_STARTED or RESUMED on mount
  useEffect(() => {
    if (currentStep === 1) {
      trackEvent('ONBOARDING_STARTED');
    } else {
      trackEvent('ONBOARDING_RESUMED', currentStep);
    }
  }, []);

  // Track KYC_PROMPT_VIEWED
  useEffect(() => {
    if (currentStep === 11) {
      trackEvent('KYC_PROMPT_VIEWED');
    }
  }, [currentStep]);

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      // Patch the current data
      await updateProfileMutation.mutateAsync({
        ...formData,
        onboarding_step: currentStep + 1,
      });
      
      if (currentStep < TOTAL_STEPS) {
        trackEvent('STEP_COMPLETED', currentStep);
        nextStep();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Complete onboarding
        trackEvent('KYC_STARTED');
        trackEvent('ONBOARDING_COMPLETED');
        await updateProfileMutation.mutateAsync({ onboarding_completed: true });
        navigate('/app');
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
      // We could add a toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <WelcomeStep />;
      case 2: return <IdentityStep />;
      case 3: return <LocationStep />;
      case 4: return <ProfessionStep />;
      case 5: return <SpiritualityStep />;
      case 6: return <PersonalityStep />; // Languages & Interests
      case 7: return <MarriageVisionStep />;
      case 8: return <PreferencesStep />;
      case 9: return <MediaUploadStep />;
      case 10: return <SummaryStep />;
      case 11: return <KYCPromptStep />;
      default: return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col">
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={TOTAL_STEPS} 
        completionPercentage={completionData?.completion_percentage || 0} 
      />
      
      <main className="flex-1 flex flex-col justify-center relative overflow-hidden">
        {renderStep()}
      </main>

      {/* Navigation Controls exist globally outside of the step container for consistency, 
          except for Welcome which might not need "Previous" */}
      <NavigationControls 
        onNext={handleNext} 
        onPrev={prevStep} 
        showPrev={currentStep > 1}
        isSubmitting={isSubmitting}
        isNextDisabled={false} // Would be controlled by step validation in a real scenario
        isFinalStep={currentStep === TOTAL_STEPS}
        nextLabel={currentStep === 1 ? "Commencer" : currentStep === TOTAL_STEPS ? "Terminer" : "Continuer"}
      />

      <SaveAndExitModal 
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={() => {
          setIsSaveModalOpen(false);
          trackEvent('STEP_ABANDONED', currentStep);
          // Rediriger vers l'accueil ou le login
          navigate('/');
        }}
      />
    </div>
  );
};
