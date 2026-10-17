import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Trash2,
  Check,
  Mic,
  AlertTriangle,
  Send,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useFamilyStore, FamilyMember } from '../../store/useFamilyStore';
import { useI18n } from '../../i18n';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { Chip } from '../../components/Chip';

export const FamilyTab: React.FC = () => {
  const { t } = useI18n();
  const members = useFamilyStore((s) => s.members);
  const addMember = useFamilyStore((s) => s.addMember);
  const deleteMember = useFamilyStore((s) => s.deleteMember);
  const deleteAllMembers = useFamilyStore((s) => s.deleteAllMembers);

  // Enrolment Wizard modal state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Relative');
  const [number, setNumber] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentLinkSent, setConsentLinkSent] = useState(false);

  // Recording simulation state
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // In-page Delete Confirmation Dialogs
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const resetForm = () => {
    setName('');
    setRelation('Relative');
    setNumber('');
    setConsentChecked(false);
    setConsentLinkSent(false);
    setWizardStep(1);
    setCurrentPhraseIndex(1);
    setIsRecording(false);
    setRecordingProgress(0);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingProgress(0);

    const interval = setInterval(() => {
      setRecordingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecording(false);
          if (currentPhraseIndex < 3) {
            setCurrentPhraseIndex((p) => p + 1);
          }
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleFinishEnrolment = () => {
    addMember({
      name: name.trim(),
      relation,
      number: number.trim(),
      enrolled: true,
      enrolledAt: new Date().toISOString().split('T')[0],
      consentConfirmed: true,
    });
    setIsWizardOpen(false);
    resetForm();
  };

  const samplePhrases = [
    t('family.phrase1'),
    t('family.phrase2'),
    t('family.phrase3'),
  ];

  return (
    <div className="space-y-4 p-4 text-vsText">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
            <Users className="w-4 h-4 text-vsBlue" />
            {t('family.title')}
          </h3>
          <p className="text-[11px] text-vsMuted">{t('family.subtitle')}</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            resetForm();
            setIsWizardOpen(true);
          }}
          icon={<UserPlus className="w-3.5 h-3.5" />}
          className="text-xs font-bold"
        >
          {t('family.addMember')}
        </Button>
      </div>

      {/* DPDP Act 2023 Consent-First Principle Note */}
      <div className="p-3 rounded-2xl bg-vsPanel border border-vsBlue/20 flex gap-2.5 items-start text-[11px] text-vsMuted leading-relaxed">
        <Lock className="w-4 h-4 text-vsBlue shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">DPDP Act 2023 Consent-First Design Principle</span>
          <span>{t('family.dpdpNote')}</span>
        </div>
      </div>

      {/* Circle Members List */}
      <div className="space-y-2.5">
        {members.length === 0 ? (
          <div className="p-8 text-center bg-vsPanel rounded-2xl border border-white/10 space-y-2">
            <Users className="w-10 h-10 text-vsMuted mx-auto opacity-50" />
            <p className="text-xs text-vsMuted font-medium">No family members in protection circle.</p>
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="p-3.5 rounded-2xl bg-vsPanel border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{member.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-vsMuted font-medium">
                    {member.relation}
                  </span>
                </div>
                <p className="text-xs font-mono text-vsMuted">{member.number}</p>
                <div className="pt-0.5">
                  {member.enrolled ? (
                    <Chip
                      variant="safe"
                      size="sm"
                      label={t('family.enrolled')}
                      icon={<ShieldCheck className="w-3 h-3 text-vsGreen" />}
                    />
                  ) : (
                    <Chip
                      variant="uncertain"
                      size="sm"
                      label={t('family.pending')}
                      icon={<AlertTriangle className="w-3 h-3 text-vsAmber" />}
                    />
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMemberToDelete(member)}
                className="p-2 rounded-xl text-vsMuted hover:text-vsCoral hover:bg-vsCoral/10 transition-colors focus:ring-2 focus:ring-vsCoral"
                aria-label={`Delete ${member.name} voiceprint`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Delete All Voiceprints Button with in-page confirmation */}
      {members.length > 0 && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setIsDeleteAllOpen(true)}
            className="text-[11px] text-vsCoral/80 hover:text-vsCoral hover:underline transition-colors font-medium"
          >
            {t('family.deleteAll')}
          </button>
        </div>
      )}

      {/* In-Page Confirmation: Delete Single Member */}
      <Dialog
        isOpen={Boolean(memberToDelete)}
        onClose={() => setMemberToDelete(null)}
        title="Confirm Voiceprint Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-vsText leading-relaxed">
            {t('family.confirmDelete')}
          </p>
          <div className="p-3 rounded-xl bg-vsBg border border-white/10 font-mono text-vsMuted">
            Profile: <span className="text-white font-bold">{memberToDelete?.name}</span> ({memberToDelete?.number})
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setMemberToDelete(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (memberToDelete) deleteMember(memberToDelete.id);
                setMemberToDelete(null);
              }}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* In-Page Confirmation: Delete All Members */}
      <Dialog
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        title="Wipe All Family Voiceprints?"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-vsCoral/15 border border-vsCoral/40 text-vsCoral">
            <p className="font-bold mb-1">Warning: Irreversible Action</p>
            <p>{t('family.confirmDeleteAll')}</p>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteAllOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                deleteAllMembers();
                setIsDeleteAllOpen(false);
              }}
            >
              Wipe Everything
            </Button>
          </div>
        </div>
      </Dialog>

      {/* 3-Step Enrolment Wizard Dialog */}
      <Dialog
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title={t('family.addMember')}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between text-[11px] font-mono text-vsMuted pb-2 border-b border-white/10">
            <span className={wizardStep === 1 ? 'text-vsBlue font-bold' : ''}>1. Contact</span>
            <span>→</span>
            <span className={wizardStep === 2 ? 'text-vsBlue font-bold' : ''}>2. Consent</span>
            <span>→</span>
            <span className={wizardStep === 3 ? 'text-vsBlue font-bold' : ''}>3. Samples</span>
          </div>

          {/* STEP 1: Contact Information */}
          {wizardStep === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-vsMuted mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Papa, Rohan, Priya"
                  className="w-full px-3 py-2 rounded-xl bg-vsBg border border-white/15 text-white font-medium focus:ring-1 focus:ring-vsBlue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-vsMuted mb-1 font-semibold">Relationship</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-vsBg border border-white/15 text-white focus:ring-1 focus:ring-vsBlue focus:outline-none"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Relative">Relative</option>
                </select>
              </div>

              <div>
                <label className="block text-vsMuted mb-1 font-semibold">Mobile Phone Number *</label>
                <input
                  type="tel"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-vsBg border border-white/15 text-white font-mono focus:ring-1 focus:ring-vsBlue focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-3">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!name.trim() || !number.trim()}
                  onClick={() => setWizardStep(2)}
                >
                  {t('common.next')} (Consent)
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Explicit Biometric Consent */}
          {wizardStep === 2 && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-vsPanel border border-vsBlue/30 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-vsBlue" />
                  Consent Notice for Biometric Voice Enrollment
                </h4>
                <ul className="text-[11px] text-vsMuted space-y-1.5 leading-relaxed list-disc list-inside">
                  <li><strong className="text-vsText">What is captured:</strong> 3 short spoken phrases to generate an encrypted numeric acoustic vector (voiceprint).</li>
                  <li><strong className="text-vsText">Storage:</strong> No raw audio is uploaded or stored. The voiceprint remains exclusively on this device.</li>
                  <li><strong className="text-vsText">Control:</strong> The voiceprint can be deleted at any time with immediate effect.</li>
                </ul>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-vsBg border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 text-vsBlue focus:ring-vsBlue w-4 h-4"
                />
                <span className="text-[11px] text-vsText font-medium leading-relaxed">
                  {t('family.consentCheckbox')}
                </span>
              </label>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setConsentLinkSent(true)}
                  className="text-[11px] text-vsBlue hover:underline flex items-center gap-1 font-semibold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('family.sendConsentSms')}</span>
                </button>
                {consentLinkSent && (
                  <p className="text-[10px] text-vsGreen mt-1 font-mono">
                    ✓ Simulated consent verification SMS dispatched to {number}.
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-3">
                <Button variant="outline" size="sm" onClick={() => setWizardStep(1)}>
                  {t('common.back')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!consentChecked}
                  onClick={() => setWizardStep(3)}
                >
                  Proceed to Voice Enrollment
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Voice Sample Simulation */}
          {wizardStep === 3 && (
            <div className="space-y-4 text-center">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-vsBlue font-bold uppercase">
                  {t('family.recordSample', { n: currentPhraseIndex })}
                </span>
                <p className="text-xs text-white font-semibold italic p-3 rounded-xl bg-vsBg border border-white/10">
                  {samplePhrases[currentPhraseIndex - 1]}
                </p>
              </div>

              {/* Progress Ring Simulation */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#0E1F3F"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#2D8CFF"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * recordingProgress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    className="absolute w-16 h-16 rounded-full bg-vsBlue/20 border-2 border-vsBlue flex items-center justify-center text-vsBlue hover:bg-vsBlue/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Mic className={`w-6 h-6 ${isRecording ? 'animate-pulse text-vsCoral' : ''}`} />
                  </button>
                </div>
                <span className="text-[10px] text-vsMuted mt-2 font-mono">
                  {isRecording ? 'Recording simulated audio...' : 'Tap microphone to speak phrase'}
                </span>
              </div>

              {currentPhraseIndex === 3 && recordingProgress === 100 && (
                <div className="p-3 rounded-xl bg-vsGreen/15 border border-vsGreen/40 text-vsGreen font-semibold text-xs flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                  <Check className="w-4 h-4" />
                  <span>{t('family.voiceprintSaved')}</span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => setWizardStep(2)}>
                  {t('common.back')}
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  disabled={currentPhraseIndex < 3 || recordingProgress < 100}
                  onClick={handleFinishEnrolment}
                >
                  {t('family.finish')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};
