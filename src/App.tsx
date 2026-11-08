import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  Shield,
  Layers,
  Cpu,
  ShoppingCart,
  Truck,
  Car,
  Compass,
  ArrowUpRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Bot,
  Send,
  Calculator,
  CheckCircle,
  BookOpen,
  Terminal,
  Activity,
  Award,
  Globe,
  Lock,
  Copy,
  Check,
  Building,
  Menu,
  X
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  category: 'cloud_ai' | 'ecommerce' | 'equipment' | 'contracting';
  subtitle: string;
  description: string;
  status: string;
  tech: string[];
  stats: string;
  actionText: string;
  image?: string;
}

interface Chapter {
  num: number;
  title: string;
  summary: string;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Estimator State
  const [serviceType, setServiceType] = useState('cloud_ai');
  const [scope, setScope] = useState('standard');
  const [urgency, setUrgency] = useState('normal');
  const [projectDetails, setProjectDetails] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(9500);
  const [estimatedDays, setEstimatedDays] = useState(14);
  const [estimatorLoading, setEstimatorLoading] = useState(false);

  // AI Advisor Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    {
      role: 'model',
      content: 'أهلاً بك في منصة M5mOsH الرسمية الخاصة بالمهندس أحمد. كيف يمكنني إرشادك اليوم بخصوص مشاريع الذكاء الاصطناعي، الأنظمة السحابية، التجارة الإلكترونية، المعدات، أو الرخام والمقاولات؟'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Selected project modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (data.projects) setProjects(data.projects);
      })
      .catch(err => console.error('Error fetching portfolio:', err));
  }, []);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('0507190799');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleCalculateEstimate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEstimatorLoading(true);
    try {
      const res = await fetch('/api/estimate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceType, scope, urgency, details: projectDetails })
      });
      const data = await res.json();
      setEstimatedPrice(data.basePrice);
      setEstimatedDays(data.estimatedDays);
    } catch (err) {
      console.error('Estimate error:', err);
    } finally {
      setEstimatorLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isChatLoading) return;

    const userText = inputMsg.trim();
    setInputMsg('');
    const newChat = [...messages, { role: 'user' as const, content: userText }];
    setMessages(newChat);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newChat })
      });
      const data = await res.json();
      setMessages([...newChat, { role: 'model', content: data.reply || 'عذراً، لم أتمكن من المعالجة حالياً.' }]);
    } catch (err) {
      console.error('Chat advisor error:', err);
      setMessages([...newChat, { role: 'model', content: 'حدث خطأ مؤقت في الاتصال بالمستشار الذكي.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const chapters: Chapter[] = [
    {
      num: 1,
      title: 'الهوية والرؤية ودور أحمد',
      summary: 'M5mOsH هو الاسم المرجعي للمنظومة الجامعة تحت ملكية وقرار أحمد. مبادئ المنظومة: التعاون بين الإنسان والذكاء الاصطناعي (Human-AI Collaboration)، اتخاذ القرارات وفق الأدلة (Evidence-Driven)، والخصوصية بالتصميم (Privacy by Design).'
    },
    {
      num: 2,
      title: 'ميثاق التشغيل وقاعدة الصلاحيات',
      summary: 'القاعدة التشغيلية الحالية هي Read-Only by Default، أي الفحص دون تغيير افتراضي. العمليات الإنتاجية وتعديل قواعد البيانات والنشر تتطلب موافقة صريحة من أحمد مع تصنيف دقيق لحالة المعلومات (مؤكد، غير مؤكد، قيد التنفيذ، يحتاج إصلاحاً).'
    },
    {
      num: 3,
      title: 'التسلسل التاريخي (أكتوبر – نوفمبر 2026)',
      summary: 'سجل حافل بدأ من Elite Console X وM5mOsH Control Center وSADA، وتطور إلى Voice Nexus (صدى الحرف) وWASL AI (Human Bridge) ومحرك الاستمرارية Auto-Continuity Engine.'
    },
    {
      num: 4,
      title: 'موسوعة المشاريع والخدمات الشاملة',
      summary: 'توثيق دقيق لكل المنتجات: M5mOsH Nexus, Voice Nexus, SADA STORE, Commerce Hub, Tamara/Tabby Hub, Mailer Inbox, Sawa Play Monitor, مُعدّات 221، معرض AUS Luxe، ورخام الشرق.'
    },
    {
      num: 5,
      title: 'NumberBook وسجل الاستعادة',
      summary: 'استعادة وتوحيد كل أفكار NumberBook، كشف الهوية ومكافحة الاحتيال مع فصل الوظائف وحفظ الأدلة في سجل NumberBook Recovery.'
    },
    {
      num: 6,
      title: 'منظومة النماذج المتخصصة والحوكمة',
      summary: 'تخصيص مساعد أو نموذج متخصص لكل مشروع (Nexus AI, Security AI, Business AI, Voice Nexus AI, Developer AI) تحت إدارة M5mOsH Central Governance.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* 1. TOP BAR CONTRACT: Exactly 3 Zones */}
      <header className="sticky top-0 z-50 bg-[#07090E]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a href="#hero" className="flex items-center space-x-2.5 space-x-reverse whitespace-nowrap shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              M5
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              M5mOsH
            </span>
          </a>

          {/* Zone 2: 4–5 single-line text links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#projects" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">المشاريع والخدمات</a>
            <a href="#philosophy" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">ميثاق المنظومة</a>
            <a href="#reference-book" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">الكتاب المرجعي</a>
            <a href="#estimator" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">حاسبة التكلفة</a>
            <a href="#advisor" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">المستشار الذكي</a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/966507190799"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 rounded-lg transition-all shadow-md shadow-emerald-500/20 flex items-center space-x-2 space-x-reverse whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب 0507190799</span>
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-2 border-t border-slate-800 mt-3 space-y-2 text-sm font-medium text-slate-300 animate-fadeIn">
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-cyan-400">المشاريع والخدمات</a>
            <a href="#philosophy" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-cyan-400">ميثاق المنظومة</a>
            <a href="#reference-book" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-cyan-400">الكتاب المرجعي</a>
            <a href="#estimator" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-cyan-400">حاسبة التكلفة</a>
            <a href="#advisor" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-cyan-400">المستشار الذكي</a>
            <div className="pt-2 flex flex-col gap-2">
              <a href="tel:0507190799" className="text-center py-2 bg-slate-800 rounded-lg text-slate-200">اتصال هاتف: 0507190799</a>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (Copy & CTAs) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed metadata kicker */}
              <div className="flex items-center gap-2 text-xs text-slate-400 tracking-wide font-medium">
                <span className="text-cyan-400 font-bold">M5mOsH</span>
                <span aria-hidden="true">·</span>
                <span>المالك وصاحب القرار: م. أحمد</span>
                <span aria-hidden="true">·</span>
                <span>المملكة العربية السعودية</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight" style={{ textWrap: 'balance' }}>
                من الفكرة إلى المنظومة: <br />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                  هندسة الحلول الذكية والأعمال التجارية
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                بوابة الأعمال والمشاريع الموحدة لـ M5mOsH: تصميم وتشغيل الأنظمة السحابية والذكاء الاصطناعي، التجارة الرقمية وبوابات الدفع، بيع وتأجير المعدات الثقيلة، والسيارات الفارهة والمقاولات العامة.
              </p>

              {/* Direct Communication Bar */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">الخط المباشر المعتمد</span>
                    <span className="text-lg font-bold text-white font-mono-numbers" dir="ltr">0507190799</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyPhone}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-1.5 space-x-reverse"
                    title="نسخ الرقم"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPhone ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                  <a
                    href="tel:0507190799"
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-cyan-600/20 flex items-center justify-center space-x-1.5 space-x-reverse"
                  >
                    <Phone className="w-4 h-4" />
                    <span>اتصال فوري</span>
                  </a>
                  <a
                    href="https://wa.me/966507190799"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 space-x-reverse"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>

              {/* Unboxed key indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>خصوصية تامة وحوكمة صارمة</span>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>استمرارية وتطوير دائم</span>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>تغطية شاملة لكل مناطق المملكة</span>
                </div>
              </div>
            </div>

            {/* Right Column (Hero Visual Anchor) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src="/src/assets/images/hero_m5mosh_hq_1794142344389.jpg"
                  alt="مقر ومقر قيادة منظومة M5mOsH الابتكاري في الرياض"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-5 right-5 left-5 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-1">
                    <span>M5mOsH Core Headquarters</span>
                    <span className="font-mono-numbers">Riyadh, KSA</span>
                  </div>
                  <h3 className="text-white text-sm font-bold">المنظومة السحابية والمشاريع المتكاملة</h3>
                  <p className="text-slate-400 text-xs mt-1">إشراف هندسي وتنفيذ متطور تحت قيادة م. أحمد</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PHILOSOPHY & OPERATIONAL CHARTER */}
      <section id="philosophy" className="py-16 bg-slate-950/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase block mb-2">الفصل الأول والثاني من الكتاب المرجعي</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">مبادئ العمل وميثاق التشغيل</h2>
            <p className="text-slate-400 text-sm mt-2">
              تعتمد منظومة M5mOsH على قواعد هندسية وحوكمة دقيقة تحمي الملكية وتضمن تنفيذ المهام بأعلى موثوقية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Human-AI Collaboration',
                arabic: 'التعاون بين الإنسان والذكاء الاصطناعي',
                desc: 'أحمد هو صاحب القرار النهائي ومالك الرؤية، بينما يتولى الذكاء الاصطناعي التحليل والتنظيم والاقتراح البرمجي المنضبط.'
              },
              {
                num: '02',
                title: 'Evidence-Driven Intelligence',
                arabic: 'اتخاذ القرارات وفق الأدلة',
                desc: 'التنفيذ لا يُعتبر مكتملاً إلا بوجود دليل واختبارات معلنة؛ لا ادعاء ولا افتراض دون فحص صريح.'
              },
              {
                num: '03',
                title: 'Privacy by Design',
                arabic: 'الخصوصية في صميم التصميم',
                desc: 'تأمين الأسرار والبيانات الحساسة، حماية البصمات الصوتية وقواعد البيانات، وعزل الصلاحيات عبر بنية مشفرة.'
              },
              {
                num: '04',
                title: 'Read-Only by Default',
                arabic: 'ميثاق الصلاحيات المنضبط',
                desc: 'القراءة والفحص دون تعديل تلقائي؛ أي نشر أو ترقية أو تعديل على الإنتاج يتطلب اعتماداً صريحاً ومباشراً من أحمد.'
              }
            ].map((p, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                <span className="text-2xl font-black text-cyan-500/40 font-mono-numbers block mb-2">{p.num}</span>
                <h3 className="text-white text-base font-bold">{p.arabic}</h3>
                <span className="text-xs text-cyan-400/80 font-mono block mt-0.5 mb-3">{p.title}</span>
                <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPREHENSIVE PROJECT & SERVICE CATALOG */}
      <section id="projects" className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase block mb-2">موسوعة المشاريع الشاملة</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">معرض الأعمال والخدمات المتكاملة</h2>
              <p className="text-slate-400 text-sm mt-1">تصفح كافة مشاريع المنظومة حسب القطاع والنشاط التجاري والتقني.</p>
            </div>

            {/* Category Filter Controls */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
              {[
                { id: 'all', label: 'كافة الأعمال' },
                { id: 'cloud_ai', label: 'الأنظمة السحابية والذكاء الاصطناعي' },
                { id: 'ecommerce', label: 'التجارة والمتاجر وبوابات الدفع' },
                { id: 'equipment', label: 'المعدات والسيارات الفارهة' },
                { id: 'contracting', label: 'المقاولات والرخام والخدمات' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeCategory === tab.id
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Bento & Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all"
              >
                <div>
                  {project.image && (
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-400 border border-slate-700">
                        {project.status}
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {!project.image && (
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                        <span className="text-cyan-400 font-mono text-[11px]">{project.category.toUpperCase()}</span>
                        <span className="text-emerald-400 font-medium">{project.status}</span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-cyan-300 font-medium mt-1 mb-3">{project.subtitle}</p>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map((t, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{project.stats}</span>
                  <a
                    href={`https://wa.me/966507190799?text=${encodeURIComponent(`السلام عليكم م. أحمد، بخصوص مشروع (${project.name})، أود الاستفسار وطلب الخدمة.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 space-x-reverse"
                  >
                    <span>طلب الخدمة</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE REFERENCE BOOK SECTION */}
      <section id="reference-book" className="py-20 bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase block mb-2">المخطوط التأسيسي 0.1</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              الكتاب المرجعي: M5mOsH من الفكرة إلى المنظومة
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              سجل تاريخي يوثق تطور الأفكار والمشاريع بقيادة أحمد، وفصل المهام وحفظ الأصول وعدم طمس التاريخ.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
            {/* Chapters navigation */}
            <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-l border-slate-800 pb-6 lg:pb-0 lg:pl-8">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-4">فصول الكتاب المرجعي</span>
              {chapters.map((chap, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-full text-right p-3.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    activeChapterIndex === idx
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="font-mono-numbers text-slate-500 font-bold">0{chap.num}.</span>
                    <span className="font-semibold text-slate-200">{chap.title}</span>
                  </div>
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>

            {/* Chapter Reader Details */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center space-x-2 space-x-reverse text-xs text-cyan-400 font-mono mb-2">
                  <span>الفصل 0{chapters[activeChapterIndex].num}</span>
                  <span>·</span>
                  <span>وثيقة معتمدة ومسجلة</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  {chapters[activeChapterIndex].title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                  {chapters[activeChapterIndex].summary}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
                <span>حقوق الملكية: © M5mOsH All Rights Reserved</span>
                <div className="flex items-center gap-3">
                  <a
                    href="tel:0507190799"
                    className="text-cyan-400 hover:underline flex items-center space-x-1 space-x-reverse"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>للتنسيق: 0507190799</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROJECT COST & DELIVERY ESTIMATOR */}
      <section id="estimator" className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase block">حاسبة التسعير والتعاقد</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">تقدير تكلفة ومدة تنفيذ مشروعك</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                حدد نوع الخدمة المطلوبة ونطاق العمل، واحصل على تقدير أولي فوري وقم بإرساله مباشرة لمناقشة التفاصيل وتوقيع العقد مع م. أحمد عبر واتساب.
              </p>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                  <span>التقدير المالي الاسترشادي</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono-numbers">
                    {estimatedPrice.toLocaleString()} <span className="text-sm font-normal text-slate-400">ريال</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>المدة المتوقعة للإنجاز</span>
                  <span className="text-lg font-bold text-white font-mono-numbers">
                    {estimatedDays} <span className="text-xs font-normal text-slate-400">يوم عمل</span>
                  </span>
                </div>
                <a
                  href={`https://wa.me/966507190799?text=${encodeURIComponent(`السلام عليكم م. أحمد، قمت بحساب تقدير لمشروعي بقيمة (${estimatedPrice} ريال) ومدة (${estimatedDays} يوم). تفاصيل: ${projectDetails || 'طلب تنفيذ'}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 space-x-reverse shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تأكيد الطلب عبر واتساب 0507190799</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <form onSubmit={handleCalculateEstimate} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">نوع الخدمة أو المشروع</label>
                  <select
                    value={serviceType}
                    onChange={e => { setServiceType(e.target.value); }}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="cloud_ai">الأنظمة السحابية والذكاء الاصطناعي (Nexus, Voice AI)</option>
                    <option value="ecommerce">المتاجر وبوابات الدفع الإلكتروني (BizWeb, Tamara)</option>
                    <option value="equipment">بيع وتأجير المعدات الثقيلة (Modat 221)</option>
                    <option value="marble">توريد وتركيب الرخام والجرانيت الفاخر (رخام الشرق)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">نطاق العمل</label>
                    <select
                      value={scope}
                      onChange={e => setScope(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value="standard">مستوى قياسي (Standard MVP)</option>
                      <option value="enterprise">مستوى مؤسسي شامل (Enterprise Pro)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">أولوية التسليم</label>
                    <select
                      value={urgency}
                      onChange={e => setUrgency(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value="normal">جدول عمل اعتيادي</option>
                      <option value="urgent">أولوية تسليم قصوى (+25%)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">ملاحظات أو مواصفات إضافية</label>
                  <textarea
                    rows={3}
                    value={projectDetails}
                    onChange={e => setProjectDetails(e.target.value)}
                    placeholder="اكتب نبذة عن متطلباتك أو موقع المشروع أو تاريخ البدء المستهدف..."
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={estimatorLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-cyan-600/25 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <Calculator className="w-4 h-4" />
                  <span>تحديث التقدير المالي والزمني</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 7. AI SYSTEM ADVISOR CHAT */}
      <section id="advisor" className="py-20 bg-slate-950/60 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase block">استشارات ذكية ومباشرة</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">مستشار M5mOsH الذكي</h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              اسأل عن أي تفاصيل تقنية، استفسر عن خدمات أحمد، أو استشر النموذج حول الحل الأنسب لمشروعك.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-[520px]">
            {/* Header of Chat */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">مستشار المنظومة (Gemini 3.8 Flash)</h4>
                  <p className="text-[11px] text-slate-400">مرتبط بالكتاب المرجعي وحوكمة M5mOsH</p>
                </div>
              </div>
              <a
                href="tel:0507190799"
                className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 space-x-reverse font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>0507190799</span>
              </a>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4 px-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/80'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-400 rounded-2xl px-4 py-2.5 text-xs flex items-center space-x-2 space-x-reverse">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>جاري تحليل استفسارك...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="اسأل عن خدمات النظم، المتاجر، تأجير المعدات، أو الرخام..."
                className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isChatLoading || !inputMsg.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center shadow-md shadow-cyan-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 8. QUIET PROFESSIONAL FOOTER */}
      <footer className="bg-[#05070B] border-t border-slate-800/80 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start space-x-2 space-x-reverse">
              <span className="text-white font-bold text-sm tracking-wider">M5mOsH</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">من الفكرة إلى المنظومة</span>
            </div>
            <p className="text-slate-500 text-[11px]">المالك وصاحب القرار: م. أحمد | © M5mOsH All Rights Reserved</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300">
            <a href="tel:0507190799" className="hover:text-cyan-400 transition-colors font-mono-numbers">
              هاتف: 0507190799
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a href="https://wa.me/966507190799" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              واتساب معتمد
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a href="mailto:Jvf5810@gmail.com" className="hover:text-cyan-400 transition-colors">
              Jvf5810@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
