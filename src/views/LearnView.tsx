import React, { useState, useEffect } from 'react';
import { KnowledgeItem } from '../types';
import { AgroApiService } from '../services/agroApi';
import {
  BookOpen,
  Search,
  CheckCircle,
  ShieldCheck,
  Filter,
  Layers,
  ArrowRight,
  ExternalLink,
  Sprout
} from 'lucide-react';

export const LearnView: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKnowledge() {
      try {
        const data = await AgroApiService.getKnowledgeBase(searchQuery, category);
        setItems(data);
      } finally {
        setLoading(false);
      }
    }
    loadKnowledge();
  }, [searchQuery, category]);

  const categories = ['All', 'Diseases', 'Pests', 'Prevention', 'Best Practices'];

  return (
    <div id="knowledge-center-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0EB] text-[#163D2B] border border-[#163D2B]/15 text-xs font-semibold shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-[#163D2B]" />
          <span>Crop Health Encyclopedia</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AgroGuard Knowledge Center
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Comprehensive field encyclopedia covering crop pathology, insect lifecycles, symptoms, and eco-friendly Integrated Pest Management (IPM) guidelines.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8DF] shadow-xs space-y-4 max-w-4xl mx-auto">
        {/* Search Input (Prompt requirement) */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            id="knowledge-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search diseases, pests, crops, symptoms..."
            className="w-full pl-12 pr-4 py-3 bg-[#F3F5F2] border border-[#E2E8DF] rounded-2xl text-sm focus:outline-none focus:border-[#163D2B] text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold uppercase text-slate-400 mr-2 flex-shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-[#163D2B] text-white shadow-xs'
                  : 'bg-[#EAF0EB] text-slate-700 hover:bg-[#E2E8DF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#E2E8DF] overflow-hidden shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between group"
          >
            <div>
              {/* Card Image */}
              <div className="h-48 overflow-hidden relative bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg uppercase">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#163D2B]/90 text-white text-xs font-semibold rounded-md backdrop-blur-xs">
                  {item.crop}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#163D2B] transition-colors">
                    {item.name}
                  </h3>
                  {item.scientificName && (
                    <p className="text-xs font-serif italic text-slate-500">
                      {item.scientificName}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Symptoms Preview */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                    Key Symptoms:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {item.symptoms.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#163D2B] font-bold">•</span>
                        <span className="truncate">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention Preview */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                    Prevention:
                  </span>
                  <p className="text-xs text-slate-600 truncate">
                    {item.prevention[0] || 'Clean field sanitation and resistant cultivars'}
                  </p>
                </div>
              </div>
            </div>

            {/* Learn More Footer Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => setSelectedItem(item)}
                className="w-full py-2.5 bg-[#EAF0EB] hover:bg-[#E2E8DF] text-slate-700 hover:text-[#163D2B] border border-[#E2E8DF] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Full Knowledge Details */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#E2E8DF] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#E2E8DF] pb-4">
              <div>
                <span className="text-xs font-bold text-[#163D2B] uppercase tracking-wider">
                  {selectedItem.category} • {selectedItem.crop}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {selectedItem.name}
                </h3>
                {selectedItem.scientificName && (
                  <p className="text-sm font-serif italic text-slate-500">
                    {selectedItem.scientificName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              className="w-full h-56 object-cover rounded-2xl border border-[#E2E8DF]"
            />

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Pathological Overview:</h4>
                <p className="text-slate-600">{selectedItem.description}</p>
              </div>

              <div className="bg-[#F3F5F2] p-4 rounded-xl border border-[#E2E8DF] space-y-2">
                <h4 className="font-bold text-slate-900">Recognizable Field Symptoms:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  {selectedItem.symptoms.map((sym, idx) => (
                    <li key={idx}>{sym}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Preventive Practices:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  {selectedItem.prevention.map((prev, idx) => (
                    <li key={idx}>{prev}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#EAF0EB] p-4 rounded-xl border border-[#E2E8DF] text-slate-900 space-y-1">
                <h4 className="font-bold text-[#163D2B]">Remedial & IPM Management:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-800">
                  {selectedItem.management.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-slate-500 italic">
                <strong>Favorable Environmental Triggers:</strong> {selectedItem.favorableConditions}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-6 py-2.5 bg-[#163D2B] hover:bg-[#1E4E37] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
