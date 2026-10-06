'use client';

import React, { useState } from 'react';
import { Briefcase, Plus, UserPlus, Users, ArrowRight } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Candidate, JobOpening } from '@/lib/types';

const PIPELINE_STAGES: Candidate['stage'][] = [
  'Applied',
  'Screening',
  'Interview',
  'Assessment',
  'Offer',
  'Hired',
];

export default function RecruitmentPage() {
  const { state, addJobOpening, addCandidate, updateCandidateStage, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering & IT',
    type: 'Full-time' as JobOpening['type'],
    positions: 1,
    experienceLevel: 'Mid-Senior (3-5 yrs)',
  });

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: state.jobOpenings[0]?.title || 'Senior Software Engineer',
    stage: 'Applied' as Candidate['stage'],
    score: 85,
    notes: '',
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title) return;
    addJobOpening({
      title: jobForm.title,
      department: jobForm.department,
      type: jobForm.type,
      positions: Number(jobForm.positions),
      experienceLevel: jobForm.experienceLevel,
      status: 'Active',
    });
    logAudit('Posted Job Vacancy', 'recruitment', `Created opening: ${jobForm.title}`, currentUser.name, currentUser.id);
    setIsJobModalOpen(false);
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.email) return;
    addCandidate({
      jobId: 'job-1',
      jobTitle: candidateForm.jobTitle,
      name: candidateForm.name,
      email: candidateForm.email,
      phone: candidateForm.phone || '+1 555-0100',
      stage: candidateForm.stage,
      score: Number(candidateForm.score),
      notes: candidateForm.notes || 'Applied via career portal',
    });
    logAudit('Added Candidate', 'recruitment', `Candidate applied: ${candidateForm.name}`, currentUser.name, currentUser.id);
    setIsCandidateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" /> Recruitment & Talent Acquisition
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end applicant tracking pipeline (Applied → Screening → Interview → Offer → Hired).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('recruitment', 'create') && (
            <>
              <Button variant="outline" onClick={() => setIsJobModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                Post Vacancy
              </Button>
              <Button onClick={() => setIsCandidateModalOpen(true)} icon={<UserPlus className="w-4 h-4" />}>
                Add Candidate
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Active Job Openings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.jobOpenings.map((job) => (
          <div
            key={job.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="indigo">{job.department}</Badge>
                <Badge variant={job.status === 'Active' ? 'success' : 'neutral'}>{job.status}</Badge>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2.5">{job.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{job.experienceLevel} • {job.type}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{job.positions} Open Seat(s)</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {state.candidates.filter((c) => c.jobTitle === job.title).length} Candidates
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Candidate Pipeline (Kanban-Style) */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Applicant Pipeline Tracker
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PIPELINE_STAGES.map((stage) => {
            const candidatesInStage = state.candidates.filter((c) => c.stage === stage);
            return (
              <div
                key={stage}
                className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col min-h-[380px]"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{stage}</span>
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold flex items-center justify-center">
                    {candidatesInStage.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {candidatesInStage.map((cand) => (
                    <div
                      key={cand.id}
                      className="bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700 rounded-lg p-2.5 shadow-sm space-y-1.5 text-xs hover:border-indigo-400 transition-colors"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{cand.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{cand.jobTitle}</div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-600 font-bold">Score: {cand.score}/100</span>
                      </div>
                      <div className="pt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <select
                          value={cand.stage}
                          onChange={(e) => updateCandidateStage(cand.id, e.target.value as any)}
                          className="text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5"
                        >
                          {PIPELINE_STAGES.map((s) => (
                            <option key={s} value={s}>
                              Move: {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Job Modal */}
      <Modal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        title="Post New Vacancy"
        description="Publish a new career requisition for internal & external hiring."
      >
        <form onSubmit={handleCreateJob} className="space-y-4">
          <Input
            label="Job Title"
            required
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
            placeholder="e.g. Lead DevOps Engineer"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={jobForm.department}
              onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
              options={state.departments.map((d) => ({ label: d.name, value: d.name }))}
            />
            <Select
              label="Employment Type"
              value={jobForm.type}
              onChange={(e) => setJobForm({ ...jobForm, type: e.target.value as any })}
              options={[
                { label: 'Full-time', value: 'Full-time' },
                { label: 'Part-time', value: 'Part-time' },
                { label: 'Remote', value: 'Remote' },
                { label: 'Contract', value: 'Contract' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Positions"
              type="number"
              min={1}
              value={jobForm.positions}
              onChange={(e) => setJobForm({ ...jobForm, positions: Number(e.target.value) })}
            />
            <Input
              label="Experience Level"
              value={jobForm.experienceLevel}
              onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
              placeholder="e.g. Senior (5+ yrs)"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsJobModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Vacancy
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Candidate Modal */}
      <Modal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        title="Add New Candidate"
        description="Record a new applicant profile into the ATS pipeline."
      >
        <form onSubmit={handleCreateCandidate} className="space-y-4">
          <Input
            label="Candidate Full Name"
            required
            value={candidateForm.name}
            onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
            placeholder="e.g. Alex Henderson"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={candidateForm.email}
              onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              value={candidateForm.phone}
              onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Applied Job Requisition"
              value={candidateForm.jobTitle}
              onChange={(e) => setCandidateForm({ ...candidateForm, jobTitle: e.target.value })}
              options={state.jobOpenings.map((j) => ({ label: j.title, value: j.title }))}
            />
            <Input
              label="Technical Score (0-100)"
              type="number"
              value={candidateForm.score}
              onChange={(e) => setCandidateForm({ ...candidateForm, score: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Screening Notes
            </label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-sm bg-white dark:bg-slate-900 focus:outline-none"
              value={candidateForm.notes}
              onChange={(e) => setCandidateForm({ ...candidateForm, notes: e.target.value })}
              placeholder="Candidate interview notes..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCandidateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add to Pipeline
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
