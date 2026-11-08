import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

// Initialize Gemini client on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Master Projects Data from M5mOsH Catalog & Reference Book
const projectsData = [
  {
    id: 'nexus',
    name: 'M5mOsH Nexus',
    category: 'cloud_ai',
    subtitle: 'الفهرس والمنصة المركزية للأرشفة وإدارة الخدمات السحابية',
    description: 'المنصة المحورية لربط GitHub، Render، Replit، وقواعد البيانات PostgreSQL وSQLite. توفير لوحة تحكم موحدة، متابعة التقارير، وإدارة استمرارية المشاريع.',
    status: 'مؤكد ونشط',
    tech: ['React', 'FastAPI', 'Node.js', 'PostgreSQL', 'Render API'],
    stats: '23 خدمة سحابية مُدارة',
    actionText: 'استعراض المنظومة المركزية',
    image: '/src/assets/images/hero_m5mosh_hq_1794142344389.jpg'
  },
  {
    id: 'voice-nexus',
    name: 'M5mOsH Voice Nexus — صدى الحرف',
    category: 'cloud_ai',
    subtitle: 'Voice • Identity • Access • Future',
    description: 'منصة ذكية متكاملة لتحويل الكلام إلى نص، التعرف على الهوية عبر البصمة الصوتية، التحقق الآمن، ودعم ذوي صعوبات النطق وتمكين التواصل المؤسسي.',
    status: 'تصميم وتشغيل نشط',
    tech: ['Voice AI', 'FastAPI', 'SADA Engine', 'Pythonista', 'WebSockets'],
    stats: 'تحويل صوت فوري وهوية رقمية',
    actionText: 'تفاصيل صدى الحرف',
    image: '/src/assets/images/hero_m5mosh_hq_1794142344389.jpg'
  },
  {
    id: 'wasl-ai',
    name: 'WASL AI / Human Bridge',
    category: 'cloud_ai',
    subtitle: 'منظومة الوصول الإنساني والتواصل المساند',
    description: 'مشروع وصول إنساني متكامل لدعم الصم وضعاف السمع وغير الناطقين عبر الترجمة الذكية بين العربية، لغة الإشارة السعودية، الصوت، والنص المكتوب.',
    status: 'تطوير تدريجي',
    tech: ['Sign Language AI', 'Computer Vision', 'Audio Synthesis', 'Avatar Engine'],
    stats: 'رؤية إنسانية شاملة',
    actionText: 'استكشاف جسر التواصل'
  },
  {
    id: 'control-center',
    name: 'M5mOsH Control Center / SADA',
    category: 'cloud_ai',
    subtitle: 'مركز التحكم التشغيلي والذاكرة وإدارة الخدمات',
    description: 'نظام إدارة تشغيلي متكامل لمراقبة الخدمات ونشر التحديثات، متصل بمستودع SADA وخدمات Render السحابية مع حماية مسارات API بالمفاتيح الأمنية.',
    status: 'منشور ومؤكد',
    tech: ['Flask', 'Tailwind', 'Render Cloud', 'Bearer Auth'],
    stats: 'مراقبة ومفاتيح حماية',
    actionText: 'لوحة التحكم'
  },
  {
    id: 'modat-221',
    name: 'مُعدّات 221 (Modat 221)',
    category: 'equipment',
    subtitle: 'المنصة الرائدة لبيع وتأجير المعدات والآلات الاحترافية بالمملكة',
    description: 'منظومة متكاملة لخدمات المقاولات وحلول المعدات الثقيلة: حفارات، رافعات، شاحنات، وآلات متخصصة مع خيارات الشراء والتأجير التشغيلي طويل وقصير الأجل.',
    status: 'تجاري ونشط',
    tech: ['Pnpm Monorepo', 'TypeScript', 'Express', 'Drizzle ORM', 'PostgreSQL'],
    stats: 'معدات معتمدة ومساندة لوجستية',
    actionText: 'طلب تأجير أو شراء معدات',
    image: '/src/assets/images/modat_machinery_1794142358616.jpg'
  },
  {
    id: 'aus-luxe',
    name: 'AUS Luxe Automotive Storefront',
    category: 'equipment',
    subtitle: 'معرض وخدمات السيارات الفارهة وتأجير الأسطول الحصري',
    description: 'واجهة فاخرة لخدمات مبيعات السيارات السوبر والفاخرة، وتوفير أساطيل النقل VIP ورجال الأعمال والمناسبات الخاصة بأعلى معايير الرفاهية والأمان.',
    status: 'خدمة تجارية حصرية',
    tech: ['React', 'Modern UI', 'Vehicle Booking', 'Luxe Catalog'],
    stats: 'أسطول فاخر وخدمات VIP',
    actionText: 'حجز سيارة أو استفسار مبيعات',
    image: '/src/assets/images/luxe_auto_showroom_1794142359233.jpg'
  },
  {
    id: 'bizweb',
    name: 'BizWeb Platform / Smart Marketer',
    category: 'ecommerce',
    subtitle: 'منصة التجارة الإلكترونية متعددة المتاجر والتسويق الذكي',
    description: 'حلول المتاجر الإلكترونية المتكاملة: تسجيل العملاء السريع عبر OTP، إدارة المنتجات والمخزون، السلة الذكية، إدارة الطلبات، والتحليلات التسويقية المتقدمة.',
    status: 'جاهز للإطلاق',
    tech: ['Next.js / React', 'OTP Auth', 'Inventory Control', 'Smart Analytics'],
    stats: 'إطلاق متجر متكامل في دقائق',
    actionText: 'إنشاء متجرك الإلكتروني'
  },
  {
    id: 'tamara-hub',
    name: 'Tamara & Tabby Hub — هندسة الدفع الآجل',
    category: 'ecommerce',
    subtitle: 'تكاملات الدفع الإلكتروني والتقسيط وبوابات السداد',
    description: 'هندسة عمليات الدفع الرقمي، الربط المعتمد مع بوابات Tamara وTabby وBeeFitness، إدارة Webhooks، وأمن التسويات وحفظ سجلات المعاملات بأعلى درجات الموثوقية.',
    status: 'بنية هندسية متطورة',
    tech: ['Webhooks API', 'Fintech Security', 'Tamara SDK', 'Automated Settlement'],
    stats: 'دفع آمن وتسويات مؤتمتة',
    actionText: 'ربط بوابات الدفع'
  },
  {
    id: 'sharq-marble',
    name: 'رخام وجرانيت الشرق (Al-Sharq Marble)',
    category: 'contracting',
    subtitle: 'توريد وتركيب الرخام الفاخر والجرانيت والديكورات الحجرية',
    description: 'أعمال التوريد والتركيب للفلل والقصور والمشاريع الكبرى: رخام ستاتوريو، أونيكس مضيء، جرانيت للأرضيات والواجهات، وقص مخصص بالوترجيت والـ CNC.',
    status: 'مشاريع منفذة',
    tech: ['Architectural Stone', 'Waterjet Cutting', 'Bookmatch Marble', 'Installation'],
    stats: 'جودة فاخرة وضمان تنفيذ',
    actionText: 'طلب معاينة وعرض أسعار',
    image: '/src/assets/images/marble_architecture_1794142359280.jpg'
  },
  {
    id: 'rouat-aljory',
    name: 'روعة الجوري / الزهراني للمقاولات والتشطيبات',
    category: 'contracting',
    subtitle: 'مقاولات عامة وتشطيبات داخلية وخارجية بأعلى دقة',
    description: 'تنفيذ أعمال العظم والتشطيبات والديكورات الحديثة، شبكات التكييف والسباكة والكهرباء، وعزل الأسطح وفق الكود السعودي للبناء وإشراف هندسي صارم.',
    status: 'نشط في المملكة',
    tech: ['General Contracting', 'Interior Finishing', 'Civil Supervision'],
    stats: 'إشراف هندسي وعقود رسمية',
    actionText: 'طلب مقايسة أعمال'
  },
  {
    id: 'jizan-1448',
    name: 'منصة جازان 1448 (Jizan 1448)',
    category: 'contracting',
    subtitle: 'منظومة الخدمات الصحية وتبديل ورديات التمريض الميداني',
    description: 'منصة مخصصة لتنسيق الكوادر التمريضية والصحية في منطقة جازان والمحافظات التابعة، تبادل الورديات، وتأمين التغطيات الطبية الميدانية بكفاءة وسرعة.',
    status: 'خدمة ميدانية متخصصة',
    tech: ['Healthcare Dispatch', 'Shift Scheduling', 'Mobile Coordination'],
    stats: 'تنسيق فوري وتغطيات سريعة',
    actionText: 'استعراض خدمات المنصة'
  },
  {
    id: 'numberbook',
    name: 'NumberBook Intelligence & Scam Shield',
    category: 'cloud_ai',
    subtitle: 'الفحص الذكي للأرقام وحماية المجتمع من الاحتيال',
    description: 'سجل استعادة وتطوير فكرة NumberBook الأصلية: كشف هوية المتصل، فحص نسبة الخطر، والتحذير الفوري بالذكاء الاصطناعي من محاولات النصب الهاتفي.',
    status: 'استعادة وتطوير مستمر',
    tech: ['Gemini AI Analysis', 'Directory Core', 'Fraud Detection', 'Security AI'],
    stats: 'حماية أمنية وتدقيق متقدم',
    actionText: 'فحص رقم هاتف'
  }
];

// Reference Book Chapters & Articles
const bookData = {
  title: 'M5mOsH — من الفكرة إلى المنظومة',
  subtitle: 'الكتاب المرجعي لتاريخ الأفكار والمشاريع والتطوير',
  owner: 'أحمد (صاحب القرار والمالك)',
  phone: '0507190799',
  email: 'Jvf5810@gmail.com',
  copyright: '© M5mOsH All Rights Reserved',
  edition: 'المخطوط التأسيسي 0.1 (أكتوبر – نوفمبر 2026)',
  principles: [
    { title: 'Human-AI Collaboration', desc: 'التعاون المتوازن بين الإنسان والذكاء الاصطناعي مع حفظ قيادة وتوجيه أحمد.' },
    { title: 'Evidence-Driven Intelligence', desc: 'اتخاذ القرارات وفق الأدلة والحقائق المسجلة؛ لا إعلان عن إنجاز دون إثبات.' },
    { title: 'Privacy by Design', desc: 'تضمين الخصوصية في صميم البنية التحتية، الأسرار، والصوت والبيانات الحساسة.' },
    { title: 'Read-Only by Default', desc: 'الفحص والقراءة دون تغيير تلقائي، والرجوع لأحمد قبل أي نشر أو تعديل حساس.' }
  ],
  chapters: [
    {
      num: 1,
      title: 'الهوية والرؤية ودور أحمد',
      summary: 'M5mOsH هو الاسم المرجعي للمنظومة الجامعة. أحمد هو صاحب القرار النهائي ومالك الأفكار والأولويات، والمساعد يقدم الاستشارات والتحليل البرمجي والتنظيمي.'
    },
    {
      num: 2,
      title: 'ميثاق التشغيل وقاعدة الصلاحيات',
      summary: 'القاعدة التشغيلية Read-Only by Default. التغييرات الإنتاجية والنشر وتعديل قواعد البيانات تتطلب إذناً صريحاً وتصنيفاً للمعلومات (مؤكد، غير مؤكد، قيد التنفيذ، يحتاج إصلاحاً).'
    },
    {
      num: 3,
      title: 'التسلسل التاريخي (أكتوبر – نوفمبر 2026)',
      summary: 'تطور المشاريع من Elite Console X وControl Center وSADA، إلى صدى الحرف Voice Nexus وWASL AI ومحرك الاستمرارية Auto-Continuity Engine.'
    },
    {
      num: 4,
      title: 'موسوعة المشاريع والخدمات',
      summary: 'توثيق دقيق لكل من: Nexus, Intelligence, Voice Nexus, SADA STORE, Commerce Hub, Tamara/Tabby, Mailer Inbox, Sawa Monitor, مُعدّات 221، AUS Luxe، ورخام الشرق.'
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
  ]
};

// Endpoints
app.get('/api/portfolio', (req, res) => {
  res.json({
    owner: bookData.owner,
    phone: bookData.phone,
    email: bookData.email,
    copyright: bookData.copyright,
    projects: projectsData,
    book: bookData
  });
});

app.post('/api/estimate-quote', (req, res) => {
  const { serviceType, scope, urgency, details } = req.body;
  
  let basePrice = 5000;
  let estimatedDays = 14;

  if (serviceType === 'cloud_ai') {
    basePrice = scope === 'enterprise' ? 18000 : 9500;
    estimatedDays = scope === 'enterprise' ? 25 : 12;
  } else if (serviceType === 'ecommerce') {
    basePrice = scope === 'enterprise' ? 14000 : 7000;
    estimatedDays = scope === 'enterprise' ? 20 : 10;
  } else if (serviceType === 'equipment') {
    basePrice = scope === 'enterprise' ? 25000 : 12000;
    estimatedDays = 5;
  } else if (serviceType === 'marble') {
    basePrice = scope === 'enterprise' ? 35000 : 15000;
    estimatedDays = 15;
  }

  if (urgency === 'urgent') {
    basePrice = Math.round(basePrice * 1.25);
    estimatedDays = Math.max(3, Math.round(estimatedDays * 0.6));
  }

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم م. أحمد (M5mOsH)،\nأود طلب عرض سعر وتنفيذ خدمة:\n` +
    `• نوع الخدمة: ${serviceType}\n` +
    `• نطاق العمل: ${scope}\n` +
    `• التقدير الاسترشادي: ${basePrice} ريال سعودي\n` +
    `• المدة المقدرة: ${estimatedDays} يوم عمل\n` +
    `• تفاصيل إضافية: ${details || 'لا يوجد'}\n` +
    `\nيرجى التواصل معي لتأكيد موعد البدء والاتفاق.`
  );

  const whatsappUrl = `https://wa.me/966507190799?text=${whatsappMessage}`;

  res.json({
    basePrice,
    estimatedDays,
    whatsappUrl,
    phone: '0507190799'
  });
});

// AI Advisor using Gemini 3.8 Flash
app.post('/api/ai-advisor', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'قائمة الرسائل مطلوبة' });
    }

    const systemInstruction = `أنت المستشار الذكي الرسمي لمنظومة "M5mOsH" والمهندس أحمد (المالك وصاحب القرار).
رقم التواصل المباشر والواتساب: 0507190799 (+966507190799).
البريد الإلكتروني: Jvf5810@gmail.com.
حقوق الملكية: © M5mOsH All Rights Reserved.

تغطي المنظومة الخدمات والمشاريع التالية:
1. الأنظمة السحابية والذكاء الاصطناعي:
   - M5mOsH Nexus: الفهرس والمنصة المركزية للتحكم والأرشفة.
   - Voice Nexus (صدى الحرف): Voice • Identity • Access • Future (بصمة صوتية، تحويل الصوت لنص، دعم ذوي صعوبات النطق).
   - WASL AI (Human Bridge): الإتاحة والترجمة المساندة للغة الإشارة.
   - SADA & Control Center: إدارة الخدمات السحابية ومراقبة النظم.
   - Security & Diagnostics: التدقيق الأمني، الفحص الجنائي، ومكافحة CVEs.
2. المتاجر الإلكترونية وبوابات الدفع:
   - BizWeb Platform / Smart Marketer: إنشاء متاجر متكاملة مع تسجيل OTP وتحليلات ذكية.
   - Tamara & Tabby Hub & BeeFitness: هندسة بوابات الدفع الإلكتروني والتقسيط.
   - Mailer Inbox: إدارة المراسلات والحملات.
3. بيع وتأجير المعدات الثقيلة:
   - منصة مُعدّات 221 (Modat 221): تأجير وبيع الرافعات والحفارات والآلات الإنشائية.
4. السيارات الفارهة والنقل الحصري:
   - AUS Luxe Automotive Storefront: مبيعات وأساطيل سيارات السوبر والـ VIP.
5. المقاولات والرخام والخدمات الميدانية:
   - رخام وجرانيت الشرق (Al-Sharq Marble): أفخر أنواع الرخام الإيطالي، الأونيكس، والديكورات الحجرية.
   - روعة الجوري / الزهراني للمقاولات العامة والتشطيبات.
   - منصة جازان 1448: تبديل التمريض والخدمات الصحية.
6. مشروع NumberBook: كشف هوية المتصل ومكافحة الاحتيال.

فلسفة العمل:
- التعاون بين الإنسان والذكاء الاصطناعي (Human-AI Collaboration).
- اتخاذ القرار وفق الأدلة (Evidence-Driven).
- الخصوصية بالتصميم (Privacy by Design).
- الصلاحية المقيدة (Read-Only by Default).

مهمتك: الإجابة باحترافية باللغة العربية، شرح تفاصيل أي خدمة، إبراز مزايا M5mOsH التقنية، وتوجيه العميل للتواصل الفوري مع أحمد عبر الهاتف أو واتساب 0507190799.`;

    const formattedHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
      history: formattedHistory
    });

    const lastMsg = messages[messages.length - 1].content;
    const response = await chat.sendMessage({ message: lastMsg });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Advisor error:', error);
    res.status(500).json({ error: error.message || 'حدث خطأ في المستشار الذكي' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`M5mOsH Enterprise Server running on http://localhost:${port}`);
  });
}

startServer();
