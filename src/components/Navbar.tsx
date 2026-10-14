import React, { useState } from 'react';
import {
  Sprout,
  ScanLine,
  Bug,
  LayoutDashboard,
  BellRing,
  BookOpen,
  HeadphonesIcon,
  Info,
  User,
  Menu,
  X,
  Languages,
  Wifi,
  Sparkles,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type NavTab = 
  | 'home'
  | 'detect-disease'
  | 'pest-detection'
  | 'detect-pest'
  | 'dashboard'
  | 'alerts'
  | 'learn'
  | 'expert'
  | 'crops'
  | 'history'
  | 'settings'
  | 'about'
  | 'profile';

interface NavbarProps {
  currentTab?: NavTab;
  activeTab?: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isHighContrast?: boolean;
  onToggleContrast?: () => void;
  activeAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  activeAlertsCount = 4
}) => {
  const current = currentTab || activeTab || 'home';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t, isHindi } = useLanguage();

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Sprout },
    { id: 'detect-disease', label: t.navDetectDisease, icon: ScanLine },
    { id: 'pest-detection', label: t.navPestDetection, icon: Bug },
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'alerts', label: t.navAlerts, icon: BellRing },
    { id: 'learn', label: t.navLearn, icon: BookOpen },
    { id: 'expert', label: t.navExpert, icon: HeadphonesIcon },
    { id: 'crops', label: t.navMyCrops, icon: Sprout },
    { id: 'history', label: t.navHistory, icon: Info },
    { id: 'settings', label: t.navSettings, icon: User }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8DF] shadow-xs">
      {/* Top micro-bar with quick agri context in deep forest #163D2B */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 bg-[#163D2B] text-[#EAF0EB] text-xs font-medium border-b border-[#0F2A1E]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="font-semibold text-white">{t.cloudModelActive}</span>
          </span>
          <span className="text-[#34D399]/60">|</span>
          <span className="text-[#EAF0EB]/90">
            {isHindi ? 'प्रमुख फसलें: गन्ना, मक्का, सरसों, धान, टमाटर, आलू' : 'Target Crops: Sugarcane, Maize, Mustard, Rice, Tomato & more'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#EAF0EB]">
            <Wifi className="w-3.5 h-3.5 text-[#34D399]" />
            {t.fieldSyncOnline}
          </span>
          <span className="text-[#34D399]/60">|</span>
          <span className="text-white font-medium">
            {t.helpline}: <span className="text-[#34D399] font-mono font-bold">{t.helplineNumber}</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Tagline */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#163D2B] flex items-center justify-center text-white shadow-md shadow-[#163D2B]/20 group-hover:bg-[#1E4E37] transition-all">
              <Sprout className="w-6 h-6 text-[#34D399]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#163D2B]">
                  AgroGuard<span className="text-[#10B981]">AI</span>
                </span>
                <span className="bg-[#EAF0EB] text-[#163D2B] border border-[#163D2B]/15 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  AgriTech
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Detect Early. Act Smart. Protect Every Crop.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = current === item.id || (item.id === 'pest-detection' && current === 'detect-pest');
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#EAF0EB] text-[#163D2B] font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-[#163D2B] hover:bg-[#F3F5F2]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#163D2B]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'alerts' && activeAlertsCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                      {activeAlertsCount}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#163D2B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Instant 1-Click Language Switcher Pill */}
            <div
              id="language-switcher-pill"
              className="inline-flex items-center p-1 bg-[#EAF0EB] border border-[#E2E8DF] rounded-xl shadow-inner"
              title={isHindi ? 'भाषा बदलें (Switch Language)' : 'Switch Language to Hindi'}
            >
              <button
                type="button"
                id="btn-lang-en"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#163D2B] text-white shadow-xs'
                    : 'text-slate-700 hover:text-[#163D2B]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                id="btn-lang-hi"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'hi'
                    ? 'bg-[#163D2B] text-[#34D399] shadow-xs'
                    : 'text-slate-700 hover:text-[#163D2B]'
                }`}
              >
                <span>हिन्दी</span>
                {language === 'hi' && <Check className="w-3 h-3 text-[#34D399]" />}
              </button>
            </div>

            {/* Quick Scan Action CTA */}
            <button
              id="header-quick-scan-btn"
              onClick={() => handleNavClick('detect-disease')}
              className="flex items-center gap-2 px-4 py-2 bg-[#163D2B] hover:bg-[#1E4E37] active:bg-[#0F2A1E] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-[#34D399] group-hover:rotate-12 transition-transform" />
              <span>{t.scanCrop}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
            </button>
          </div>

          {/* Mobile menu button & quick language button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              type="button"
              id="mobile-lang-toggle"
              onClick={() => setLanguage(isHindi ? 'en' : 'hi')}
              className="px-2.5 py-1.5 bg-[#EAF0EB] text-[#163D2B] border border-[#E2E8DF] font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              aria-label="Toggle language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isHindi ? 'EN' : 'हिन्दी'}</span>
            </button>

            <button
              id="mobile-quick-scan-icon-btn"
              onClick={() => handleNavClick('detect-disease')}
              className="p-2.5 bg-[#163D2B] text-white rounded-xl shadow-xs cursor-pointer"
              aria-label={t.scanCrop}
            >
              <ScanLine className="w-5 h-5 text-[#34D399]" />
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-700 hover:text-[#163D2B] hover:bg-[#F3F5F2] rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="xl:hidden bg-white border-b border-[#E2E8DF] px-4 pt-2 pb-6 space-y-3 shadow-xl">
          {/* Mobile Language Switcher Box */}
          <div className="bg-[#F8FAF7] p-2.5 rounded-2xl border border-[#E2E8DF] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-[#163D2B]" />
              {t.langToggleLabel}:
            </span>
            <div className="inline-flex p-1 bg-white border border-[#E2E8DF] rounded-xl">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'en' ? 'bg-[#163D2B] text-white' : 'text-slate-700'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'hi' ? 'bg-[#163D2B] text-[#34D399]' : 'text-slate-700'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = current === item.id || (item.id === 'pest-detection' && current === 'detect-pest');
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium text-left min-h-[44px] transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#163D2B] text-white font-semibold shadow-xs'
                      : 'bg-[#F3F5F2] text-slate-700 hover:bg-[#EAF0EB]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#34D399]' : 'text-[#163D2B]'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.id === 'alerts' && activeAlertsCount > 0 && (
                    <span className={`ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full ${isActive ? 'bg-[#34D399] text-[#163D2B]' : 'bg-amber-500 text-white'}`}>
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E2E8DF] flex items-center justify-between text-xs text-slate-500">
            <span>{isHindi ? 'सक्रिय भाषा: हिन्दी' : 'Active Language: English'}</span>
            <span className="flex items-center gap-1 text-[#163D2B] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              {t.fieldSyncOnline}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
