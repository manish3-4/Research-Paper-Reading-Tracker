import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createPaper } from '../api';
import { ResearchPaper } from '../types';

interface AddPaperProps {
  onPaperAdded: (paper: ResearchPaper) => void;
}

export const AddPaper: React.FC<AddPaperProps> = ({ onPaperAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    firstAuthor: '',
    domain: 'Computer Science' as const,
    readingStage: 'Abstract Read' as const,
    citationCount: 0,
    impactScore: 'Unknown' as const,
    dateAdded: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const domains = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
  const readingStages = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
  const impactScores = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'citationCount' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Paper title is required');
      return;
    }
    if (!formData.firstAuthor.trim()) {
      toast.error('First author name is required');
      return;
    }
    if (formData.citationCount < 0) {
      toast.error('Citation count cannot be negative');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPaper = await createPaper({
        title: formData.title,
        firstAuthor: formData.firstAuthor,
        domain: formData.domain as any,
        readingStage: formData.readingStage as any,
        citationCount: formData.citationCount,
        impactScore: formData.impactScore as any,
        dateAdded: formData.dateAdded,
      });

      toast.success('Paper added successfully!');
      onPaperAdded(newPaper);

      setFormData({
        title: '',
        firstAuthor: '',
        domain: 'Computer Science' as const,
        readingStage: 'Abstract Read' as const,
        citationCount: 0,
        impactScore: 'Unknown' as const,
        dateAdded: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add paper');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Add New Research Paper</h2>
          <p className="text-slate-500 mt-1">Fill in the details to add a paper to your library</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Paper Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter paper title"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">First Author</label>
              <input
                type="text"
                name="firstAuthor"
                value={formData.firstAuthor}
                onChange={handleChange}
                placeholder="Enter first author name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Research Domain</label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Reading Stage</label>
              <select
                name="readingStage"
                value={formData.readingStage}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              >
                {readingStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Citation Count</label>
              <input
                type="number"
                name="citationCount"
                value={formData.citationCount}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date Added</label>
              <input
                type="date"
                name="dateAdded"
                value={formData.dateAdded}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Impact Score</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {impactScores.map(score => (
                <label
                  key={score}
                  className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.impactScore === score
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="impactScore"
                    value={score}
                    checked={formData.impactScore === score}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`text-sm font-semibold ${
                    formData.impactScore === score ? 'text-indigo-700' : 'text-slate-600'
                  }`}>
                    {score}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding Paper...' : 'Add Paper to Library'}
          </button>
        </form>
      </div>
    </div>
  );
};
