import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { fetchAnalyticsSummary, fetchFunnelData, fetchScatterData, fetchStackedBarData } from '../api';
import { AnalyticsSummary, FunnelDataPoint, ScatterDataPoint, StackedBarDataPoint } from '../types';

interface AnalyticsDashboardProps {
  papers: any[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ papers }) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelDataPoint[]>([]);
  const [scatterData, setScatterData] = useState<ScatterDataPoint[]>([]);
  const [stackedBarData, setStackedBarData] = useState<StackedBarDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [summary, funnel, scatter, bar] = await Promise.all([
          fetchAnalyticsSummary(),
          fetchFunnelData(),
          fetchScatterData(),
          fetchStackedBarData(),
        ]);
        setSummary(summary);
        setFunnelData(funnel);
        setScatterData(scatter);
        setStackedBarData(bar);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [papers]);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-slate-500 text-lg font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const impactScoreColors: Record<string, string> = {
    'High Impact': '#f43f5e',
    'Medium Impact': '#f59e0b',
    'Low Impact': '#94a3b8',
    'Unknown': '#cbd5e1',
  };

  const stageColors = [
    '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#ddd6fe', '#ede9fe'
  ];

  const readingStages = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];

  const impactScoreMap: Record<string, number> = {
    "Low Impact": 1,
    "Medium Impact": 2,
    "High Impact": 3,
    Unknown: 4,
  };

  const impactScoreLabels: Record<number, string> = {
    1: "Low Impact",
    2: "Medium Impact",
    3: "High Impact",
    4: "Unknown",
  };

  const chartData = scatterData.map((paper) => ({
    x: paper.citationCount,
    y: impactScoreMap[paper.impactScore] ?? 4,
    title: paper.title,
    impactScore: paper.impactScore,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="text-4xl font-bold text-slate-900 mb-2">
            {summary.totalCount}
          </div>
          <div className="text-sm text-slate-500">Total Papers in Library</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl border-0 shadow-sm p-6 text-white">
          <div className="text-5xl font-bold text-white mb-2">
            {summary.completionRate}%
          </div>
          <div className="text-sm text-indigo-100 font-medium">
            Completion Rate
          </div>
          <div className="text-xs text-indigo-200 mt-3">
            {summary.fullyReadCount} of {summary.totalCount} papers fully read
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="text-4xl font-bold text-emerald-600 mb-2">
            {summary.fullyReadCount}
          </div>
          <div className="text-sm text-slate-500">Fully Read Papers</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          Reading Stage Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {summary.stageBreakdown.map((item, index) => (
            <div
              key={item.readingStage}
              className="relative overflow-hidden rounded-xl p-4 bg-slate-50 border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-indigo-600"
                style={{ opacity: 0.3 + index * 0.1 }}
              />
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {item.count}
              </div>
              <div className="text-xs text-slate-600 font-medium leading-tight">
                {item.readingStage}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            Average Citations per Domain
          </h3>
        </div>
        <div className="overflow-x-auto ">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Avg Citations
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Papers
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.avgCitationsByDomain.map((item) => (
                <tr
                  key={item.domain}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-center text-slate-900">
                    {item.domain}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 text-center font-medium">
                    {item.avgCitations.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 text-center">
                    {item.paperCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {funnelData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Reading Funnel
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis
                dataKey="stage"
                type="category"
                width={150}
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {scatterData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            Citations by Impact Score
          </h3>

          <ResponsiveContainer width="100%" height={450}>
            <ScatterChart
              margin={{
                top: 20,
                right: 50,
                left: 50,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis
                type="number"
                dataKey="x"
                name="Citation Count"
                stroke="#64748b"
                label={{
                  value: "Citation Count",
                  position: "insideBottom",
                  offset: -10,
                }}
              />

              <YAxis
                type="number"
                dataKey="y"
                ticks={[1, 2, 3, 4]}
                domain={[0.5, 4.5]}
                tickFormatter={(value) => impactScoreLabels[value]}
                stroke="#64748b"
                label={{
                  value: "",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <ZAxis range={[80, 80]} />

              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const paper = payload[0].payload;

                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                      <p className="font-semibold text-slate-900">
                        {paper.title}
                      </p>

                      <p className="text-lg text-slate-600">
                        Citations: {paper.x}
                      </p>

                      <p className="text-lg text-slate-600">
                        Impact Score: {paper.impactScore}
                      </p>
                    </div>
                  );
                }}
              />

              <Scatter data={chartData}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={impactScoreColors[entry.impactScore]}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {stackedBarData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Papers by Domain & Reading Stage
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={stackedBarData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="domain"
                stroke="#64748b"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              {readingStages.map((stage, idx) => (
                <Bar
                  key={stage}
                  dataKey={stage}
                  stackId="a"
                  fill={stageColors[idx]}
                  radius={
                    idx === readingStages.length - 1
                      ? [4, 4, 0, 0]
                      : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
