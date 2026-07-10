import React, { useState, useMemo } from 'react';
import { Trash2, ChevronDown, X, Filter, Library } from 'lucide-react';
import toast from 'react-hot-toast';
import { deletePaper } from '../api';
import { ResearchPaper } from '../types';
import { differenceInCalendarDays, parseISO } from 'date-fns';

interface PaperLibraryProps {
  papers: ResearchPaper[];
  onPaperDeleted: (id: string) => void;
}

export const PaperLibrary: React.FC<PaperLibraryProps> = ({ papers, onPaperDeleted }) => {
  const [expandedFilters, setExpandedFilters] = useState(true);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedImpactScores, setSelectedImpactScores] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'quarter'>('all');

  const stages = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
  const domains = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
  const impactScores = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];

  const getDateRangeFilter = (date: string) => {
    const paperDate = parseISO(date);
    const today = new Date();
    const daysDiff = differenceInCalendarDays(today, paperDate);

    switch (dateRange) {
      case 'week':
        return daysDiff >= 0 && daysDiff <= 7;
      case 'month':
        return daysDiff >= 0 && daysDiff <= 30;
      case 'quarter':
        return daysDiff >= 0 && daysDiff <= 90;
      default:
        return true;
    }
  };

  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const stageMatch = selectedStages.length === 0 || selectedStages.includes(paper.readingStage);
      const domainMatch = selectedDomains.length === 0 || selectedDomains.includes(paper.domain);
      const impactMatch = selectedImpactScores.length === 0 || selectedImpactScores.includes(paper.impactScore);
      const dateMatch = getDateRangeFilter(paper.dateAdded);

      return stageMatch && domainMatch && impactMatch && dateMatch;
    });
  }, [papers, selectedStages, selectedDomains, selectedImpactScores, dateRange]);

  const handleDeletePaper = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deletePaper(id);
      toast.success('Paper deleted successfully');
      onPaperDeleted(id);
    } catch (error) {
      toast.error('Failed to delete paper');
    }
  };

  const toggleStage = (stage: string) => {
    setSelectedStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
  };

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const toggleImpactScore = (score: string) => {
    setSelectedImpactScores(prev =>
      prev.includes(score) ? prev.filter(s => s !== score) : [...prev, score]
    );
  };

  const clearFilters = () => {
    setSelectedStages([]);
    setSelectedDomains([]);
    setSelectedImpactScores([]);
    setDateRange('all');
  };

  const hasActiveFilters = selectedStages.length > 0 || selectedDomains.length > 0 || selectedImpactScores.length > 0 || dateRange !== 'all';

  const activeFilterCount = selectedStages.length + selectedDomains.length + selectedImpactScores.length + (dateRange !== 'all' ? 1 : 0);

  const Chip = ({ label, isSelected, onToggle }: { label: string; isSelected: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'
          : 'bg-slate-50 text-slate-700 border-2 border-transparent hover:bg-slate-100'
      }`}
    >
      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center mr-2 transition-all duration-200 ${
        isSelected
          ? 'bg-indigo-600 border-indigo-600'
          : 'border-slate-300 bg-white'
      }`}>
        {isSelected && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div
          className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
          onClick={() => setExpandedFilters(!expandedFilters)}
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-bold text-slate-900">Filters</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                {activeFilterCount} active
              </span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${expandedFilters ? 'rotate-180' : ''}`} />
        </div>

        {expandedFilters && (
          <div className="px-4 sm:px-6 pb-6 space-y-6 border-t border-slate-100 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Reading Stage</h4>
                <div className="flex flex-wrap gap-2">
                  {stages.map(stage => {
                    const isSelected = selectedStages.includes(stage);
                    return (
                      <Chip
                        key={stage}
                        label={stage}
                        isSelected={isSelected}
                        onToggle={() => toggleStage(stage)}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Research Domain</h4>
                <div className="flex flex-wrap gap-2">
                  {domains.map(domain => {
                    const isSelected = selectedDomains.includes(domain);
                    return (
                      <Chip
                        key={domain}
                        label={domain}
                        isSelected={isSelected}
                        onToggle={() => toggleDomain(domain)}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Impact Score</h4>
                <div className="flex flex-wrap gap-2">
                  {impactScores.map(score => {
                    const isSelected = selectedImpactScores.includes(score);
                    return (
                      <Chip
                        key={score}
                        label={score}
                        isSelected={isSelected}
                        onToggle={() => toggleImpactScore(score)}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Date Added</h4>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                >
                  <option value="all">All Time</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">Last 3 Months</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 active:bg-slate-300 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredPapers.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Library className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-900 text-lg font-semibold">No papers found</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or add a new paper</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="divide-y divide-slate-100 sm:hidden">
              {filteredPapers.map(paper => (
                <div key={paper.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900 leading-tight">{paper.title}</div>
                    <button
                      onClick={() => handleDeletePaper(paper.id, paper.title)}
                      className="p-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 flex-shrink-0"
                      title="Delete paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-slate-600">{paper.firstAuthor}</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                      {paper.domain}
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      {paper.readingStage}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      paper.impactScore === 'High Impact' ? 'bg-rose-100 text-rose-700' :
                      paper.impactScore === 'Medium Impact' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {paper.impactScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{paper.citationCount} citations</span>
                    <span>{new Date(paper.dateAdded).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Citations</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Impact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPapers.map(paper => (
                    <tr key={paper.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-900 max-w-xs truncate">{paper.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{paper.firstAuthor}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                          {paper.domain}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          {paper.readingStage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">{paper.citationCount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          paper.impactScore === 'High Impact' ? 'bg-rose-100 text-rose-700' :
                          paper.impactScore === 'Medium Impact' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {paper.impactScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(paper.dateAdded).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeletePaper(paper.id, paper.title)}
                          className="p-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
                          title="Delete paper"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {filteredPapers.length > 0 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{filteredPapers.length}</span> of <span className="font-semibold">{papers.length}</span> papers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
