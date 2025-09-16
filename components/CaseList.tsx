import React from 'react';
import type { Category, Case } from '../types';

interface CaseListProps {
  categories: Category[];
  selectedCaseId: string;
  onSelectCase: (caseItem: Case) => void;
}

const CaseList: React.FC<CaseListProps> = ({ categories, selectedCaseId, onSelectCase }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold">CASE LIST</h2>
      </div>
      <div className="overflow-y-auto p-4 flex-grow">
        {categories.map((category) => (
          <div key={category.name} className="mb-6">
            <div className="bg-violet-700 py-2 text-center font-semibold text-slate-100 rounded-lg mb-3 uppercase tracking-wider shadow-md">
              {category.name}
            </div>
            <ul>
              {category.cases.map((caseItem) => (
                <li key={caseItem.id}>
                  <button
                    onClick={() => onSelectCase(caseItem)}
                    className={`w-full text-left p-3 rounded-md transition-all duration-200 text-sm ${
                      selectedCaseId === caseItem.id
                        ? 'bg-violet-500/20 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {caseItem.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseList;