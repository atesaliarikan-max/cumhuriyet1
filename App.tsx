import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  MapPin,
  Award,
  Clock,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  ChevronDown,
  Sparkles,
  Info,
  X,
  ArrowRight,
  Inbox,
  Menu,
  Activity,
  Search,
  Users,
  Route,
  Flame,
  HeartHandshake,
  AlertCircle,
  Trophy
} from "lucide-react";

// Types
interface Participant {
  name: string;
  category: string;
  bibNumber: string;
  registrationDate: string;
  emailSubject?: string;
  emailBody?: string;
}

// Interactive Map Stations Data
const stations = [
  {
    id: "start",
    x: 510,
    y: 445,
    title: "BAŞLANGIÇ & BİTİŞ (Çetin Emeç Etkinlik Alanı)",
    km: "0.0K / 10.0K",
    type: "Ana Etkinlik Alanı",
    desc: "Yarışımız Çetin Emeç Etkinlik Alanı'ndan başlar. Çetin Emeç Bulvarı üzerindeki festival alanı olan başlangıç noktasından start alıp dairesel rotayı tamamlayarak yine burada sonlanacaktır."
  },
  {
    id: "turn-tan",
    x: 630,
    y: 440,
    title: "TAN SOKAK DÖNÜŞÜ (Çatalçeşme)",
    km: "1.2K",
    type: "Kritik Bağlantı",
    desc: "Sahil yolundan (Çetin Emeç Bulvarı) sapılarak Tan Sokak üzerinden kuzeye doğru ilerlenip Bağdat Caddesi'ne çıkılan bağlantı güzergahı."
  },
  {
    id: "water-ciftehavuzlar",
    x: 390,
    y: 290,
    title: "ÇİFTEHAVUZLAR SU İSTASYONU",
    km: "4.0K",
    type: "Su İstasyonu",
    desc: "Parkurun 4. kilometresinde, Bağdat Caddesi üzerinde yer alan sporcuların su, enerji takviyesi ve sünger yardımı alabileceği destek noktası."
  },
  {
    id: "turn-kiziltoprak",
    x: 75,
    y: 140,
    title: "KIZILTOPRAK BP DÖNÜŞÜ (Kalamış)",
    km: "6.2K",
    type: "Kritik U-Turn",
    desc: "Bağdat Caddesi sonundaki BP istasyonunun önünden Kalamış (Fener Kalamış Caddesi) yönüne dönülerek sahil yoluna doğru inişin başladığı nokta."
  },
  {
    id: "water-cemiltopuzlu",
    x: 320,
    y: 390,
    title: "CEMİL TOPUZLU SAĞLIK VE SU NOKTASI",
    km: "8.5K",
    type: "Su & Tıbbi Destek",
    desc: "Cemil Topuzlu Caddesi üzerinde yer alan su ve ambulans tıbbi müdahale istasyonu. Bitişe son 1.5 kilometre kala son takviye noktasıdır."
  }
];

// Comprehensive 10K Race Rules based on TAF / IAAF regulations
const rulesCategories = [
  {
    title: "Katılım & Yaş Sınırları",
    icon: <User className="h-5 w-5" />,
    items: [
      {
        title: "Minimum Yaş Koşulu",
        desc: "Yarışmaya katılabilmek için Türkiye Atletizm Federasyonu (TAF) ve uluslararası atletizm kuralları gereği yarış günü itibarıyla en az 18 yaşını doldurmuş olmak zorunludur."
      },
      {
        title: "Kişisel Sağlık Beyanı",
        desc: "Kayıt yaptıran tüm sporcular, online katılım formunu onaylayarak sağlık durumlarının bu koşuya katılmaya elverişli olduğunu beyan etmiş sayılırlar. Kalp, tansiyon veya kronik rahatsızlığı bulunan kişilerin yarış öncesi doktor kontrolünden geçmesi önemle tavsiye edilir."
      },
      {
        title: "Kişiye Özel Kayıt",
        desc: "Kayıtlar sadece başvuru sahibi adına geçerlidir. Kayıtların başka bir koşucuya devredilmesi, satılması veya başkasının göğüs numarasıyla koşulması kesinlikle yasaktır."
      }
    ]
  },
  {
    title: "Kayıt & Kit Dağıtımı",
    icon: <Calendar className="h-5 w-5" />,
    items: [
      {
        title: "Kit Dağıtım Tarihleri ve Saatleri",
        desc: "Koşu kitlerinin (göğüs numarası, zamanlama çipi ve resmi anı tişörtü) dağıtımı 15-17 Ekim 2026 tarihleri arasında, 10:00 - 20:00 saatleri arasında belirlenecek resmi kayıt noktalarından yapılacaktır."
      },
      {
        title: "Yarış Günü Kit Dağıtımı Yapılmayacaktır",
        desc: "Yarış sabahı başlangıç alanında veya parkurda kesinlikle göğüs numarası, çip ve tişört dağıtımı gerçekleştirilmeyecektir. Katılımcıların kitlerini belirtilen tarih aralığında teslim alması zorunludur."
      },
      {
        title: "Kimlik ve Onay İbrazı",
        desc: "Kitinizi teslim alırken resmi kimlik kartınızı (Nüfus Cüzdanı, Ehliyet veya Pasaport) ve kayıt onay belgenizi/karekodunuzu yetkililere göstermeniz gerekmektedir."
      }
    ]
  },
  {
    title: "Zaman Ölçümü & Çip Kullanımı",
    icon: <Clock className="h-5 w-5" />,
    items: [
      {
        title: "Elektronik Zamanlama Çipi",
        desc: "Yarış dereceleri, göğüs numarasının arkasına entegre edilmiş tek kullanımlık elektronik zamanlama çipleri ile saniye hassasiyetinde ölçülecektir."
      },
      {
        title: "Göğüs Numarası Kullanım Esasları",
        desc: "Göğüs numarasının yarış boyunca göğüs bölgesinde, ön tarafta tam olarak görünecek şekilde takılması zorunludur. Numaranın katlanması, kesilmesi, bükülmesi veya çipin üzerine iğne batırılması zamanlama sisteminin çalışmasını engelleyebilir."
      },
      {
        title: "Kontrol Noktası Zorunluluğu",
        desc: "Parkurun başlangıç, dönüş (U-Turn) ve bitiş noktalarında elektronik zamanlama halıları bulunmaktadır. Bu noktalardan herhangi birini es geçen veya halının üzerinden geçmeyen koşucuların yarış süreleri hesaplanamaz ve diskalifiye edilirler."
      }
    ]
  },
  {
    title: "Güvenlik & Parkur Disiplini",
    icon: <Shield className="h-5 w-5" />,
    items: [
      {
        title: "Trafiğe Kapalı Alan",
        desc: "Yarışma güzergahı yarış saatlerinden önce emniyet birimleri koordinasyonuyla araç trafiğine tamamen kapatılacak ve emniyet altına alınacaktır."
      },
      {
        title: "Tekerlekli Araç ve Evcil Hayvan Yasağı",
        desc: "Güvenlik gerekçesiyle parkura evcil hayvanla girilmesi, bebek arabası, bisiklet, paten, kaykay, scooter veya herhangi bir motorlu/motorlu olmayan tekerlekli araçla koşulması kesinlikle yasaktır."
      },
      {
        title: "Yetkili Direktiflerine Uyum",
        desc: "Yarış boyunca parkurda görevli resmi hakemlerin, yönlendirme personellerinin, polis memurlarının ve organizasyon komitesi yetkililerinin talimatlarına uymak zorunludur."
      }
    ]
  },
  {
    title: "Zaman Sınırı (Time Limit)",
    icon: <Activity className="h-5 w-5" />,
    items: [
      {
        title: "90 Dakika Tamamlama Süresi",
        desc: "10K Cumhuriyet Koşusu'nun resmi tamamlanma süresi 90 dakikadır (1 saat 30 dakika). Bu süre sonunda parkur trafiğe kademeli olarak açılacaktır."
      },
      {
        title: "Limit Aşımında Uygulanacak Kurallar",
        desc: "Zaman sınırını aşan veya belirlenen sürede geride kalan koşucular, emniyet tedbirleri bittikten sonra kendi sorumluluklarında kaldırımlardan koşmaya devam edebilirler ya da organizasyon süpürge aracına binebilirler."
      }
    ]
  },
  {
    title: "Emanet Eşya & Bagaj",
    icon: <Inbox className="h-5 w-5" />,
    items: [
      {
        title: "Emanet Çadırı Hizmeti",
        desc: "Başlangıç ve bitiş alanında tüm sporcuların kullanımına açık ücretsiz bir emanet eşya çadırı bulunacaktır. Katılımcılar sadece kendilerine kit ile verilen emanet çantasını teslim edebilirler."
      },
      {
        title: "Değerli Eşya Kabul Edilmemesi",
        desc: "Cüzdan, cep telefonu, takı, dizüstü bilgisayar, anahtar gibi kıymetli ve hassas eşyalar emanet çadırına kabul edilmez. Kaybolan veya zarar gören değerli eşyalardan organizasyon komitesi hiçbir şekilde sorumlu tutulamaz."
      },
      {
        title: "Teslim Alma Süresi",
        desc: "Emanet bırakılan tüm eşyaların yarış bittikten sonra en geç 2 saat içerisinde, göğüs numarası ibraz edilerek teslim alınması gerekmektedir."
      }
    ]
  },
  {
    title: "Diskalifiye Nedenleri",
    icon: <AlertCircle className="h-5 w-5" />,
    items: [
      {
        title: "Göğüs Numarası Olmaksızın Koşmak",
        desc: "Göğüs numarası olmayan veya göğüs numarasını başkasına devreden sporcular doğrudan diskalifiye edilirler."
      },
      {
        title: "Parkur Dışı Kestirmeler",
        desc: "Belirlenen resmi parkurun dışına çıkmak, herhangi bir noktada kestirme yolları kullanmak veya dışarıdan fiziksel destek/ulaşım yardımı almak kural ihlalidir."
      },
      {
        title: "Sportmenlik Dışı Davranışlar",
        desc: "Diğer sporcuları kasten engellemek, tehlikeye düşürmek, hakemlere veya görevlilere sözlü/fiziksel müdahalede bulunmak ve centilmenliğe aykırı davranmak anında diskalifiye ile sonuçlanır."
      }
    ]
  }
];

interface Sponsor {
  id: string;
  name: string;
  role: "Ana Sponsor" | "Gıda Sponsoru" | "Medya Sponsoru" | "Destekçilerimiz";
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
}

const DEFAULT_SPONSORS: Sponsor[] = [];

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "routes" | "rules" | "awards" | "faq" | "participants" | "sponsors">("home");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sponsors State
  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    const saved = localStorage.getItem("republic_run_sponsors_live");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing sponsors", e);
      }
    }
    return DEFAULT_SPONSORS;
  });

  const [newSponsor, setNewSponsor] = useState<{
    name: string;
    role: "Ana Sponsor" | "Gıda Sponsoru" | "Medya Sponsoru" | "Destekçilerimiz";
    logoUrl: string;
    websiteUrl: string;
    description: string;
  }>({
    name: "",
    role: "Ana Sponsor",
    logoUrl: "",
    websiteUrl: "",
    description: ""
  });
  const [isAddingSponsor, setIsAddingSponsor] = useState(false);
  const [sponsorError, setSponsorError] = useState("");

  useEffect(() => {
    localStorage.setItem("republic_run_sponsors_live", JSON.stringify(sponsors));
  }, [sponsors]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "10K",
    age: "",
    tShirtSize: "M",
    emergencyContact: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<any | null>(null);

  // Registered Public Participants List
  const [publicParticipants, setPublicParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("10K");
  const [rulesSearchQuery, setRulesSearchQuery] = useState("");

  // Fetch registered list for counter and search tab
  const fetchParticipants = async () => {
    try {
      const res = await fetch("/api/registrations?public=true");
      if (res.ok) {
        const data = await res.json();
        setPublicParticipants(data);
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    // Race starts on October 18, 2026, at 09:00:00 AM
    const targetDate = new Date("2026-10-18T09:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle registration submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    // Validation
    if (!formData.name.trim()) return setFormError("Lütfen adınızı ve soyadınızı giriniz.");
    if (!formData.email.trim()) return setFormError("Lütfen e-posta adresinizi giriniz.");
    if (!formData.phone.trim()) return setFormError("Lütfen telefon numaranızı giriniz.");
    if (!formData.age || parseInt(formData.age) < 18 || parseInt(formData.age) > 99) {
      return setFormError("Lütfen geçerli bir yaş giriniz. 10K Cumhuriyet Koşusu için katılım yaşı minimum 18'dir.");
    }
    if (!formData.emergencyContact.trim()) {
      return setFormError("Lütfen acil durumda aranacak bir yakınınızın adı ve numarasını giriniz.");
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, category: "10K" }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Kayıt işlemi başarısız oldu.");
      }

      setRegistrationSuccess(result.participant);
      // Refresh list
      fetchParticipants();
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "10K",
        age: "",
        tShirtSize: "M",
        emergencyContact: "",
      });
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // State for Map interactives
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  // FAQ Data
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const faqs = [
    {
      q: "Cumhuriyet İçin Koş 10K etkinliğine kimler katılabilir?",
      a: "Etkinliğimiz tüm sporseverlere açıktır. Türkiye Atletizm Federasyonu kuralları gereği 10K Cumhuriyet Koşusu için katılım yaşı minimum 18'dir."
    },
    {
      q: "Kayıt ücretli midir?",
      a: "Cumhuriyet Koşusu katılım bedeli 1500 TL'dir. Bu ücrete profesyonel koşu kiti (göğüs numarası, elektronik zamanlama çipi, resmi anı tişörtü, sırt çantası ve bitişte verilecek özel anı madalyası) tamamen dahildir."
    },
    {
      q: "Göğüs numarası, çip ve tişört dağıtımı ne zaman yapılacak?",
      a: "Göğüs numarası, çip ve anı tişörtü dağıtımı 15-17 Ekim 2026 tarihlerinde, 10:00 - 20:00 saatleri arasında belirlenecek kayıt noktalarından gerçekleştirilecektir. Yarış sabahı dağıtım yapılmayacaktır."
    },
    {
      q: "Yarış günü zaman ölçümü (timing) nasıl yapılacak?",
      a: "Tüm katılımcılara göğüs numaralarıyla birlikte tek kullanımlık zamanlama çipleri verilecektir. Başlangıç ve bitiş noktalarında yer alan elektronik zamanlama halıları üzerinden geçerken süreniz otomatik olarak ölçülür."
    },
    {
      q: "Parkur boyunca tıbbi destek sağlanacak mı?",
      a: "Evet. Parkurun çeşitli stratejik noktalarında (özellikle su istasyonlarında ve başlangıç/bitiş alanında) tam donanımlı ambulanslar ve acil müdahale ekipleri görev yapacaktır. Ayrıca güzergah trafiğe tamamen kapatılacaktır."
    },
    {
      q: "Ödüllendirme nasıl olacak?",
      a: "10K Cumhuriyet Kupası genel klasman ve yaş kategorilerinde dereceye giren sporcular için özel başarı kupaları ve madalyaları takdim edilecektir."
    }
  ];

  // Deleted placeholder to remove municipality references

  // Helper for background animations or elements
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-neutral-800 antialiased selection:bg-red-500 selection:text-white">
      {/* TOP DECORATIVE RED LINE */}
      <div className="h-2 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700" />

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* PREMIUM REPUBLIC RUN VECTOR LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-md shadow-red-200">
              <svg viewBox="0 0 100 100" className="h-8 w-8 text-white">
                {/* Elegant, premium modern crescent and running star */}
                <path d="M48,15 C28.67,15 13,30.67 13,50 C13,69.33 28.67,85 48,85 C40,78 36,69 36,50 C36,31 40,22 48,15 Z" fill="currentColor" />
                <path d="M68,32 L70,37 L75,37 L71,41 L73,46 L68,43 L63,46 L65,41 L61,37 L66,37 Z" fill="currentColor" />
                <path d="M41,35 C43.2,35 45,33.2 45,31 C45,28.8 41.2,27 41,27 C40.8,27 37,28.8 37,31 C37,33.2 38.8,35 41,35 Z" fill="currentColor" />
                <path d="M29,42 C32,40 36,39 40,39 C43,39 46,42 44,47 C42,51 37,55 34,59 L43,72" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M37,47 L29,57 L21,53" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M38,42 L48,38 L56,43" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-ping rounded-full bg-red-500 opacity-75" />
              <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-red-600 border border-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-sans text-lg font-black tracking-tight text-neutral-900 leading-none">
                  CUMHURİYET <span className="text-red-600">İÇİN KOŞ</span>
                </h1>
                {/* Small elegant Turkish Flag SVG */}
                <div className="flex items-center shadow-sm border border-neutral-100 rounded overflow-hidden">
                  <svg className="h-3 w-4.5" viewBox="0 0 30 20">
                    <rect width="30" height="20" fill="#E30A17" />
                    <circle cx="11.5" cy="10" r="4.5" fill="#FFFFFF" />
                    <circle cx="13" cy="10" r="3.6" fill="#E30A17" />
                    <polygon points="17.5,10 19.5,10.6 18,11.8 18.5,13.6 17,12.5 15.5,13.6 16,11.8 14.5,10.6 16.5,10" fill="#FFFFFF" />
                  </svg>
                </div>
              </div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold mt-1">
                10K CUMHURİYET KOŞUSU
              </p>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-2 text-sm font-semibold transition-all rounded-lg ${
                activeTab === "home" ? "bg-red-50 text-red-600" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              Ana Sayfa
            </button>
            <button
              onClick={() => setActiveTab("routes")}
              className={`px-3 py-2 text-sm font-semibold transition-all rounded-lg ${
                activeTab === "routes" ? "bg-red-50 text-red-600" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              Koşu Parkuru
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`px-3 py-2 text-sm font-semibold transition-all rounded-lg ${
                activeTab === "rules" ? "bg-red-50 text-red-600" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              Yarış Kuralları
            </button>
            <button
              onClick={() => setActiveTab("awards")}
              className={`px-3 py-2 text-sm font-semibold transition-all rounded-lg ${
                activeTab === "awards" ? "bg-red-50 text-red-600" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              Yarış Ödülleri
            </button>
            <button
              onClick={() => setActiveTab("sponsors")}
              className={`px-3 py-2 text-sm font-semibold transition-all rounded-lg ${
                activeTab === "sponsors" ? "bg-red-50 text-red-600" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              Sponsorlar
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={`px-3 py-2 text-sm font-semibold transition-all rounded-lg ${
                activeTab === "participants" ? "bg-red-50 text-red-600" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              Katılımcı Sorgulama
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-3 py-2 text-sm font-semibold transition-all rounded-lg ${
                activeTab === "faq" ? "bg-red-50 text-red-600" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              Sıkça Sorulanlar (SSS)
            </button>
          </nav>

          {/* REGISTER ACTION */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => {
                window.open("https://www.taf.org.tr", "_blank");
              }}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 hover:shadow-red-300"
            >
              <Flame className="h-4 w-4 fill-current" />
              Kayıt Ol
            </button>
          </div>

          {/* MOBILE NAV BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 md:hidden hover:bg-neutral-50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* MOBILE MENU PANEL */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-100 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab("home");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${
                  activeTab === "home" ? "bg-red-50 text-red-600" : "text-neutral-600"
                }`}
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => {
                  setActiveTab("routes");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${
                  activeTab === "routes" ? "bg-red-50 text-red-600" : "text-neutral-600"
                }`}
              >
                Koşu Parkuru
              </button>
              <button
                onClick={() => {
                  setActiveTab("rules");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${
                  activeTab === "rules" ? "bg-red-50 text-red-600" : "text-neutral-600"
                }`}
              >
                Yarış Kuralları
              </button>
              <button
                onClick={() => {
                  setActiveTab("awards");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${
                  activeTab === "awards" ? "bg-red-50 text-red-600" : "text-neutral-600"
                }`}
              >
                Yarış Ödülleri
              </button>
              <button
                onClick={() => {
                  setActiveTab("sponsors");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${
                  activeTab === "sponsors" ? "bg-red-50 text-red-600" : "text-neutral-600"
                }`}
              >
                Sponsorlar
              </button>
              <button
                onClick={() => {
                  setActiveTab("participants");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${
                  activeTab === "participants" ? "bg-red-50 text-red-600" : "text-neutral-600"
                }`}
              >
                Katılımcı Sorgulama
              </button>
              <button
                onClick={() => {
                  setActiveTab("faq");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${
                  activeTab === "faq" ? "bg-red-50 text-red-600" : "text-neutral-600"
                }`}
              >
                Sıkça Sorulanlar (SSS)
              </button>
              <button
                onClick={() => {
                  window.open("https://www.taf.org.tr", "_blank");
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md animate-pulse"
              >
                <Flame className="h-4 w-4 fill-current" />
                Kayıt Ol
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN VIEW CONTENT AREA */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* HERO SECTION WITH COUNTDOWN TIMER */}
              <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 text-white md:px-16 md:py-24 shadow-xl">
                {/* Ambient Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
                {/* Red Gradient Flare */}
                <div className="absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-red-600/20 blur-[100px]" />
                <div className="absolute -left-20 -bottom-20 h-[300px] w-[300px] rounded-full bg-red-600/10 blur-[80px]" />

                <div className="relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
                  <div className="space-y-6 lg:col-span-7">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-4 py-1.5 text-xs font-semibold text-red-400">
                      <Sparkles className="h-3.5 w-3.5 text-red-400" />
                      18 Ekim 2026 Saat 09:00 - Kadıköy, İstanbul
                    </div>
                    <h2 className="font-sans text-4xl font-black tracking-tight md:text-6xl leading-tight">
                      Cumhuriyet İçin <br />
                      <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                        Gururla Koş!
                      </span>
                    </h2>
                    <p className="max-w-xl text-neutral-300 text-base md:text-lg leading-relaxed">
                      Atatürk'ün spora, sporcuya ve cumhuriyet nesillerine olan sarsılmaz inancıyla, Cumhuriyetimizin kuruluş coşkusunu Kadıköy sahilinde hep birlikte adımlayarak kutluyoruz. Kadını, erkeği, yaşlısı ve çocuğuyla Cumhuriyet yolunda omuz omuza koşmaya davetlisiniz!
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        onClick={() => {
                          window.open("https://www.taf.org.tr", "_blank");
                        }}
                        className="flex items-center gap-2 rounded-2xl bg-red-600 px-8 py-4 font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 hover:scale-[1.02]"
                      >
                        Hemen Kaydol
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setActiveTab("routes")}
                        className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 font-semibold text-neutral-200 transition-all hover:bg-white/10 hover:border-white/40"
                      >
                        <Route className="h-4 w-4 text-red-500" />
                        Parkurları İncele
                      </button>
                    </div>
                  </div>

                  {/* COUNTDOWN TIMER WIDGET */}
                  <div className="lg:col-span-5">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-red-500" />
                          <span className="text-sm font-semibold tracking-wide text-neutral-300">
                            YARIŞ BAŞLANGIÇ GERİ SAYIMI
                          </span>
                        </div>
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>

                      {timeLeft.isCompleted ? (
                        <div className="text-center py-6">
                          <p className="text-2xl font-extrabold text-red-500">Yarış Başladı!</p>
                          <p className="text-sm text-neutral-300 mt-2">Cumhuriyet koşucuları parkurda!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div className="space-y-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                            <span className="block text-3xl font-extrabold text-white md:text-4xl">
                              {timeLeft.days.toString().padStart(2, "0")}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                              Gün
                            </span>
                          </div>
                          <div className="space-y-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                            <span className="block text-3xl font-extrabold text-white md:text-4xl">
                              {timeLeft.hours.toString().padStart(2, "0")}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                              Saat
                            </span>
                          </div>
                          <div className="space-y-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                            <span className="block text-3xl font-extrabold text-white md:text-4xl">
                              {timeLeft.minutes.toString().padStart(2, "0")}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                              Dakika
                            </span>
                          </div>
                          <div className="space-y-1 bg-white/5 rounded-2xl p-3 border border-white/5 animate-pulse">
                            <span className="block text-3xl font-extrabold text-red-500 md:text-4xl">
                              {timeLeft.seconds.toString().padStart(2, "0")}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                              Saniye
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-neutral-400">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <span>Başlangıç Saati: 18 Ekim Pazar, 09:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 10K CUMHURİYET KOŞUSU FEATURE SPOTLIGHT */}
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-neutral-900 md:text-3xl">
                    10K Cumhuriyet Koşusu
                  </h3>
                  <p className="text-neutral-500 max-w-xl mx-auto text-sm">
                    Cumhuriyet coşkusunu, ay-yıldızlı şanlı bayrağımızın gölgesinde, 10 kilometrelik resmi ve profesyonel parkurumuzda hep birlikte adımlayarak yaşatıyoruz.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-neutral-100 p-6 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />
                  <div className="grid gap-8 md:grid-cols-12 items-center">
                    <div className="md:col-span-5 space-y-4">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-2xl shadow-md shadow-red-200">
                        10K
                      </div>
                      <h4 className="font-black text-2xl text-neutral-900">Resmi 10K Dairesel Parkur</h4>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        Yarışımız Çetin Emeç Etkinlik Alanı'ndan başlayarak doğu yönünde Çatalçeşme'ye kadar ilerler, Tan Sokak üzerinden kuzeye saparak Bağdat Caddesi'ne bağlanır. Bağdat Caddesi boyunca batı yönünde Göztepe, Çiftehavuzlar ve Selamiçeşme'den geçip Kızıltoprak BP İstasyonu'na ulaşır. Buradan Kalamış güzergahını (Fener Kalamış Caddesi, Ahmet Mithat Efendi Caddesi ve Cemil Topuzlu Caddesi) takip ederek başlangıç ve bitiş alanı olan Çetin Emeç Etkinlik Alanı'nda tamamlanır.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-600 font-semibold text-xs rounded-lg">Minimum Yaş: 18+</span>
                        <span className="px-3 py-1 bg-red-50 text-red-600 font-semibold text-xs rounded-lg border border-red-100">Elektronik Zamanlama Çipi</span>
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-600 font-semibold text-xs rounded-lg">Özel Tasarım Tişört</span>
                      </div>
                    </div>
                    <div className="md:col-span-7 grid gap-4 sm:grid-cols-2">
                      <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                        <h5 className="font-extrabold text-neutral-800 text-sm">Zamanlama Çipleri</h5>
                        <p className="text-xs text-neutral-500 leading-relaxed">Göğüs numaranıza entegre özel zamanlama çipleri ile resmi dereceniz saniyeler içinde ölçülür.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                        <h5 className="font-extrabold text-neutral-800 text-sm">Resmi Hakemlik</h5>
                        <p className="text-xs text-neutral-500 leading-relaxed">Türkiye Atletizm Federasyonu standartlarında görevli resmi hakem heyeti denetimi.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                        <h5 className="font-extrabold text-neutral-800 text-sm">Tıbbi Güvenlik</h5>
                        <p className="text-xs text-neutral-500 leading-relaxed">Güzergah boyunca konumlandırılmış tam teşekküllü ambulanslar ve acil tıp teknisyenleri.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                        <h5 className="font-extrabold text-neutral-800 text-sm">Özel Anı Kitleri</h5>
                        <p className="text-xs text-neutral-500 leading-relaxed">Yarıştan önce dağıtılacak olan özel tişört ve göğüs numarası, bitişte ise anı madalyası.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STATS INFOGRAPHICS */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 rounded-2xl bg-neutral-50 border border-neutral-200/50 p-6">
                <div className="text-center space-y-1 border-r border-neutral-200/50 last:border-0 pr-2">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 mb-1">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="block text-2xl md:text-3xl font-black text-neutral-900">
                    {publicParticipants.length > 0 ? publicParticipants.length + 423 : 426}
                  </span>
                  <span className="text-[11px] font-bold text-neutral-500 tracking-wide uppercase">
                    Kayıtlı Koşucu
                  </span>
                </div>
                <div className="text-center space-y-1 border-r border-neutral-200/50 last:border-0 pr-2">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 mb-1">
                    <Route className="h-5 w-5" />
                  </div>
                  <span className="block text-2xl md:text-3xl font-black text-neutral-900">10K</span>
                  <span className="text-[11px] font-bold text-neutral-500 tracking-wide uppercase">
                    Tek Parkur
                  </span>
                </div>
                <div className="text-center space-y-1 border-r border-neutral-200/50 last:border-0 pr-2">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-1">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="block text-2xl md:text-3xl font-black text-neutral-900">Özel</span>
                  <span className="text-[11px] font-bold text-neutral-500 tracking-wide uppercase">
                    Anı Madalyası
                  </span>
                </div>
                <div className="text-center space-y-1 last:border-0">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 mb-1">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="block text-2xl md:text-3xl font-black text-neutral-900">%100</span>
                  <span className="text-[11px] font-bold text-neutral-500 tracking-wide uppercase">
                    Güvenli Kayıt
                  </span>
                </div>
              </div>

              {/* MOTIVATIONAL STATEMENT PORTRAIT OF ATHLETE */}
              <div className="grid gap-8 md:grid-cols-12 items-center border border-neutral-100 rounded-3xl bg-white p-6 md:p-10">
                <div className="md:col-span-4 rounded-2xl overflow-hidden shadow-sm aspect-square bg-gradient-to-tr from-neutral-900 to-red-950 flex flex-col justify-between p-6 text-white relative">
                  <div className="absolute inset-0 bg-red-800/10 mix-blend-color-dodge" />
                  {/* Subtle vector silhouette or icon representing energy */}
                  <Activity className="h-10 w-10 text-red-500 opacity-80" />
                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">
                      Cumhuriyet Değeri
                    </span>
                    <h5 className="font-extrabold text-xl leading-tight">
                      "Zeki, Çevik ve Ahlaklı..."
                    </h5>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Atatürk'ün sporu ve sporcuları tanımlayan o eşsiz vizyonunu her adımımızda hissediyoruz.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-6">
                  <h4 className="text-xl md:text-2xl font-extrabold text-neutral-900">
                    Neden Cumhuriyet İçin Koşmalıyız?
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 text-sm text-neutral-600">
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <p>
                        <strong>Tarihi Coşku:</strong> Cumhuriyet bayramımızı sadece seyrederek değil, bizzat bedenimiz ve enerjimizle, spor yaparak gururla kutlamak için.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <p>
                        <strong>Sahil Yolunun Keyfi:</strong> Caddebostan sahilinde, boğazın taze havasıyla, trafiğe tamamen kapalı eşsiz ve dümdüz bir koşu parkuru deneyimi.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <p>
                        <strong>Profesyonel Koşu Kiti Dahil:</strong> Katılım ücretine (1500 TL) dahil olarak özel tasarlanmış resmi anı tişörtü, elektronik çip entegreli göğüs numarası, koşu sırt çantası ve bitişte özel anı madalyası verilmektedir.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <p>
                        <strong>Atatürk'ün İzinde:</strong> Sporun birleştirici ve iyileştirici gücü sayesinde sağlıklı, zinde ve cumhuriyet ruhuna sahip nesiller inşa etme.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "routes" && (
            <motion.div
              key="routes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h3 className="text-2xl font-black text-neutral-900 md:text-3xl">
                  İnteraktif Parkur Haritası
                </h3>
                <p className="text-sm text-neutral-500">
                  Aşağıdaki sekmelerden parkurları seçerek rotaları ve parkur üzerindeki kritik noktaları interaktif olarak görebilirsiniz.
                </p>
              </div>

              {/* 10K PARKOUR SPOTLIGHT HEADER */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-red-700 font-extrabold text-sm">
                  <span>Mesafe: 10.00 km</span>
                  <span className="w-1 h-1 rounded-full bg-red-400" />
                  <span>Başlangıç ve Bitiş Aynı Nokta</span>
                </div>
              </div>

              {/* MAP & DETAIL CONTAINER */}
              <div className="grid gap-8 lg:grid-cols-12">
                {/* VECTOR INTERACTIVE MAP DISPLAY */}
                <div className="lg:col-span-8 bg-[#091124] rounded-3xl p-6 border border-blue-950 relative overflow-hidden flex flex-col justify-between min-h-[480px] shadow-2xl">
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
                  
                  {/* MAP HEADER STATUS */}
                  <div className="relative z-10 flex items-center justify-between border-b border-blue-900/40 pb-3">
                    <span className="text-xs font-mono tracking-widest text-blue-400 font-bold">
                      10K CUMHURİYET DAİRESEL KOŞU PARKURU İNTERAKTİF SİMÜLASYONU
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase">CANLI ROTASYON</span>
                    </div>
                  </div>

                  {/* HIGH-QUALITY VECTOR SVG SCHEMATIC MAP */}
                  <div className="relative z-10 my-4 flex justify-center items-center overflow-x-auto">
                    <svg viewBox="0 0 1100 550" className="w-full min-w-[700px] h-auto select-none">
                      {/* Self-contained style for flowing route animation */}
                      <style>{`
                        @keyframes flow-dots {
                          to {
                            stroke-dashoffset: -40;
                          }
                        }
                        .animate-route-flow {
                          animation: flow-dots 2s linear infinite;
                        }
                      `}</style>

                      {/* Marmara Denizi (Sea Body) at bottom-left */}
                      <path
                        d="M 0,280 C 80,310 110,360 170,380 C 230,400 250,440 330,450 C 410,460 450,500 510,505 C 570,510 630,535 680,550 L 0,550 Z"
                        fill="#030814"
                        className="transition-all duration-500"
                      />

                      {/* Map Grids / Background secondary streets */}
                      {/* Göztepe & Kadıköy vertical-ish streets */}
                      <line x1="220" y1="50" x2="280" y2="400" stroke="#172554" strokeWidth="1.5" opacity="0.4" />
                      <line x1="340" y1="60" x2="410" y2="430" stroke="#172554" strokeWidth="1.5" opacity="0.4" />
                      <line x1="460" y1="80" x2="520" y2="460" stroke="#172554" strokeWidth="1.5" opacity="0.4" />
                      <line x1="580" y1="100" x2="640" y2="480" stroke="#172554" strokeWidth="1.5" opacity="0.4" />
                      <line x1="720" y1="120" x2="790" y2="500" stroke="#172554" strokeWidth="1.5" opacity="0.4" />
                      <line x1="850" y1="140" x2="900" y2="520" stroke="#172554" strokeWidth="1.5" opacity="0.3" />

                      {/* Parallel background streets */}
                      <path d="M 50,110 C 200,150 400,210 700,290" fill="none" stroke="#172554" strokeWidth="1.5" opacity="0.35" />
                      <path d="M 100,60 C 250,100 450,160 750,240" fill="none" stroke="#172554" strokeWidth="1.5" opacity="0.3" />
                      <path d="M 20,220 C 120,260 220,310 320,330" fill="none" stroke="#172554" strokeWidth="1" opacity="0.4" />
                      <path d="M 400,320 C 500,360 600,410 750,440" fill="none" stroke="#172554" strokeWidth="1" opacity="0.4" />

                      {/* STREET UNDERLAYS (Highlighting actual roads on the track) */}
                      {/* Bağdat Caddesi underlay */}
                      <path
                        d="M 75,140 L 630,400"
                        fill="none"
                        stroke="#1e3a8a"
                        strokeWidth="10"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                      {/* Coast road underlay */}
                      <path
                        d="M 75,140 C 110,280 180,310 240,330 C 320,390 380,420 440,430 C 510,445 630,440 630,440"
                        fill="none"
                        stroke="#1e3a8a"
                        strokeWidth="10"
                        strokeLinecap="round"
                        opacity="0.5"
                      />

                      {/* NEIGHBORHOOD LABELS */}
                      <text x="110" y="165" fill="#e2e8f0" fontSize="13" fontWeight="900" letterSpacing="0.08em" opacity="0.85">KIZILTOPRAK</text>
                      <text x="230" y="225" fill="#94a3b8" fontSize="11" fontWeight="800" opacity="0.65">SELAMİÇEŞME</text>
                      <text x="340" y="275" fill="#94a3b8" fontSize="11" fontWeight="800" opacity="0.65">ÇİFTEHAVUZLAR</text>
                      <text x="450" y="195" fill="#94a3b8" fontSize="11" fontWeight="800" opacity="0.65">GÖZTEPE</text>
                      <text x="380" y="480" fill="#38bdf8" fontSize="11" fontWeight="900" letterSpacing="0.04em" opacity="0.9">ÇETİN EMEÇ ETKİNLİK ALANI</text>
                      <text x="650" y="465" fill="#e2e8f0" fontSize="12" fontWeight="900" letterSpacing="0.06em" opacity="0.85">ÇATALÇEŞME</text>
                      <text x="750" y="110" fill="#334155" fontSize="16" fontWeight="900" letterSpacing="0.15em">ANADOLU YAKASI</text>

                      {/* THE 10K RED TRACK */}
                      {/* Glow outer track */}
                      <path
                        d="M 510,445 L 630,440 L 630,400 L 75,140 C 110,280 180,310 240,330 C 320,390 380,420 440,430 Z"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.3"
                      />
                      {/* Solid inner bright red track */}
                      <path
                        d="M 510,445 L 630,440 L 630,400 L 75,140 C 110,280 180,310 240,330 C 320,390 380,420 440,430 Z"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Flowing direction dots */}
                      <path
                        d="M 510,445 L 630,440 L 630,400 L 75,140 C 110,280 180,310 240,330 C 320,390 380,420 440,430 Z"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeDasharray="10 30"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.75"
                        className="animate-route-flow"
                      />

                      {/* DIRECTION INDICATOR ARROWS */}
                      {/* Westward arrow on Bağdat Caddesi */}
                      <path d="M 320,225 L 310,220 L 320,215" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                      {/* Eastward arrow on Cemil Topuzlu */}
                      <path d="M 280,365 L 290,360 L 280,355" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

                      {/* INTERACTIVE STATION NODES */}
                      {stations.map((station) => (
                        <g
                          key={station.id}
                          className="cursor-pointer group/pin"
                          onMouseEnter={() => setHoveredStation(station.id)}
                          onMouseLeave={() => setHoveredStation(null)}
                        >
                          {/* Radial Ripple Glow ring on hover */}
                          <circle
                            cx={station.x}
                            cy={station.y}
                            r="20"
                            className="fill-red-500/0 stroke-red-500/0 stroke-1 group-hover/pin:fill-red-500/10 group-hover/pin:stroke-red-500/40 transition-all duration-300 origin-center"
                            style={{ transformOrigin: `${station.x}px ${station.y}px` }}
                          />
                          {/* Outer pulse indicator */}
                          <circle
                            cx={station.x}
                            cy={station.y}
                            r={hoveredStation === station.id ? "11" : "8"}
                            className="fill-red-600 stroke-white stroke-2 transition-all duration-300 animate-pulse origin-center"
                            style={{ transformOrigin: `${station.x}px ${station.y}px` }}
                          />
                          {/* Inner white core */}
                          <circle cx={station.x} cy={station.y} r="4" fill="#ffffff" />
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* INTERACTIVE HUD / DESCRIPTION BOX */}
                  <div className="relative z-10 bg-slate-950/80 border border-blue-950/80 rounded-2xl p-4 backdrop-blur-md flex flex-col md:flex-row gap-4 justify-between items-start md:items-center min-h-[90px] transition-all duration-300">
                    {hoveredStation ? (
                      (() => {
                        const active = stations.find((s) => s.id === hoveredStation);
                        if (!active) return null;
                        return (
                          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400 uppercase">
                                  {active.type}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-neutral-400">
                                  Mesafe: {active.km}
                                </span>
                              </div>
                              <h4 className="text-sm font-black text-white tracking-tight uppercase">
                                {active.title}
                              </h4>
                              <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                                {active.desc}
                              </p>
                              {active.id === "start" && (
                                <div className="pt-2">
                                  <a
                                    href="https://maps.apple.com/directions?map=hybrid&destination=Caddebostan+Etkinlik+Alan%C4%B1%2C+Caddebostan+Sahil+Park%C4%B1+%C4%B0%C3%A7i+Yolu%2C+34728+Kad%C4%B1k%C3%B6y+%C4%B0stanbul%2C+T%C3%BCrkiye&destination-place-id=I86EA363CA5EC0E3D&mode=driving"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-extrabold hover:underline"
                                  >
                                    <MapPin className="h-3.5 w-3.5 text-red-500 animate-bounce" />
                                    Konum & Yol Tarifi Al (Apple Maps)
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="shrink-0 text-left md:text-right">
                              <span className="text-[10px] font-mono text-red-400 font-extrabold tracking-widest uppercase bg-red-950/40 px-2 py-1 rounded border border-red-900/30">
                                SİMÜLE EDİLİYOR
                              </span>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex items-center gap-3 py-1.5 text-xs text-neutral-300 w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-400 shrink-0 animate-pulse" />
                          <span>Harita üzerindeki kırmızı kontrol noktalarının ve istasyonların üzerine gelerek detaylı güzergah detaylarını simüle edin.</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 shrink-0 hidden sm:inline">10K CUMHURİYET PARKURU</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* DETAILED STATS FOR CHOSEN PATH */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm space-y-6"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                        <span className="font-extrabold text-neutral-900 text-lg">10K Cumhuriyet Koşusu</span>
                        <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs">Dairesel Rota</span>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-neutral-50 rounded-xl">
                            <span className="block text-xs text-neutral-400 uppercase font-bold tracking-wider">Mesafe</span>
                            <span className="text-xl font-extrabold text-neutral-800">10.00 km</span>
                          </div>
                          <div className="p-3 bg-neutral-50 rounded-xl">
                            <span className="block text-xs text-neutral-400 uppercase font-bold tracking-wider">Yükseklik</span>
                            <span className="text-xl font-extrabold text-neutral-800">8 m (Düz)</span>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm text-neutral-600">
                          <div className="flex justify-between py-1.5 border-b border-neutral-50">
                            <strong>Yaş Sınırı:</strong>
                            <span>18 Yaş ve Üzeri</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-neutral-50 items-center">
                            <strong>Başlangıç & Bitiş:</strong>
                            <div className="text-right flex flex-col items-end">
                              <span className="font-semibold text-neutral-800">Çetin Emeç Etkinlik Alanı</span>
                              <a
                                href="https://maps.apple.com/directions?map=hybrid&destination=Caddebostan+Etkinlik+Alan%C4%B1%2C+Caddebostan+Sahil+Park%C4%B1+%C4%B0%C3%A7i+Yolu%2C+34728+Kad%C4%B1k%C3%B6y+%C4%B0stanbul%2C+T%C3%BCrkiye&destination-place-id=I86EA363CA5EC0E3D&mode=driving"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-extrabold hover:underline mt-0.5"
                              >
                                <MapPin className="h-3 w-3 text-red-500" />
                                Yol Tarifi (Apple Maps)
                              </a>
                            </div>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-neutral-50">
                            <strong>En Yüksek Eğim:</strong>
                            <span>Tan Sokak Çıkışı (%2)</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-neutral-50">
                            <strong>Su İstasyonları:</strong>
                            <span>2 Ana Nokta</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-neutral-50">
                            <strong>Zaman Limiti:</strong>
                            <span>90 Dakika</span>
                          </div>
                        </div>

                        <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-xs text-red-700 leading-relaxed space-y-2">
                          <strong className="block text-sm">Önemli Parkur Notu:</strong>
                          <p>Bostancı sahilinden başlayıp dairesel dikey dönüşle Bağdat Caddesi ve Kalamış'tan geçerek Çetin Emeç Bulvarı'na dönen bu resmi parkur, tamamen trafiğe kapatılacak olup her kilometrede yönlendirme hakemleri yer alacaktır.</p>
                        </div>

                        <button
                          onClick={() => {
                            window.open("https://www.taf.org.tr", "_blank");
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-semibold text-sm shadow-md shadow-red-100 transition-all"
                        >
                          10K Kategorisine Kaydol
                        </button>
                      </div>
                    </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "rules" && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-2">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-neutral-900 md:text-3xl">
                  Yarışma Kuralları & Katılım Şartları
                </h3>
                <p className="text-sm text-neutral-500">
                  Cumhuriyet İçin Koş 10K Cumhuriyet Koşusu'nun güvenli, adil ve profesyonel bir ortamda gerçekleştirilmesi için uygulanan resmi kurallar.
                </p>
              </div>

              {/* RULES SEARCH AND FILTER */}
              <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm max-w-4xl mx-auto">
                <div className="grid gap-6 md:grid-cols-12 items-center">
                  <div className="md:col-span-8 space-y-1">
                    <h4 className="font-extrabold text-neutral-800 text-base">Kural Arama & Hızlı Erişim</h4>
                    <p className="text-xs text-neutral-400">Aradığınız kuralı hızlıca bulmak için kelime girerek filtreleyebilirsiniz.</p>
                  </div>
                  <div className="md:col-span-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Kural ara... (örn: çip, yaş, emanet)"
                      value={rulesSearchQuery}
                      onChange={(e) => setRulesSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* TWO COLUMN CONTENT */}
              <div className="grid gap-8 lg:grid-cols-12 max-w-7xl mx-auto">
                
                {/* LEFT SIDEBAR: QUICK STATS / HIGHLIGHTS */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-600/15 blur-2xl" />
                    <h4 className="font-extrabold text-lg relative z-10 mb-4 border-b border-white/10 pb-2">Temel Bilgiler</h4>
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex gap-3 items-center">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-neutral-400">Yaş Sınırı</span>
                          <span className="text-sm font-extrabold">18 Yaş ve Üzeri (18+)</span>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-neutral-400">Süre Limiti (Time Limit)</span>
                          <span className="text-sm font-extrabold">90 Dakika (1.5 Saat)</span>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <Shield className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-neutral-400">Federasyon Onayı</span>
                          <span className="text-sm font-extrabold">TAF Standartları</span>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <Flame className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-neutral-400">Katılım Bedeli</span>
                          <span className="text-sm font-extrabold text-red-500">1500 TL (Kit Dahil)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QUICK ADVICE CARD */}
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-3xl p-6 space-y-3">
                    <div className="flex gap-2 items-center text-amber-800">
                      <Info className="h-5 w-5 text-amber-600 shrink-0" />
                      <h5 className="font-extrabold text-sm uppercase">Önemli Sağlık Tavsiyesi</h5>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Lütfen yarıştan önce mutlaka kardiyolojik muayene yaptırınız. Solunum sıkıntısı, göğüs ağrısı ya da ritim bozukluğu gibi şikayetleri olan sporcuların yarışmaya katılması kesinlikle tavsiye edilmez. Yarış esnasında kendinizi kötü hissettiğinizde en yakın hakeme veya sağlık görevlisine başvurun.
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: DETAIL CARDS */}
                <div className="lg:col-span-8 space-y-6">
                  {rulesCategories
                    .filter(category => {
                      if (!rulesSearchQuery) return true;
                      const query = rulesSearchQuery.toLowerCase();
                      const categoryMatch = category.title.toLowerCase().includes(query);
                      const itemsMatch = category.items.some(item => 
                        item.title.toLowerCase().includes(query) || 
                        item.desc.toLowerCase().includes(query)
                      );
                      return categoryMatch || itemsMatch;
                    })
                    .map((category, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-3xl border border-neutral-100 p-6 md:p-8 shadow-sm space-y-4"
                      >
                        <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                          <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                            {category.icon}
                          </div>
                          <h4 className="font-extrabold text-neutral-900 text-lg uppercase tracking-tight">{category.title}</h4>
                        </div>
                        
                        <div className="divide-y divide-neutral-100">
                          {category.items
                            .filter(item => {
                              if (!rulesSearchQuery) return true;
                              const query = rulesSearchQuery.toLowerCase();
                              return item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
                            })
                            .map((item, itemIdx) => (
                              <div key={itemIdx} className="py-4 first:pt-0 last:pb-0 space-y-1">
                                <h5 className="font-bold text-neutral-800 text-sm flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                                  {item.title}
                                </h5>
                                <p className="text-xs text-neutral-500 leading-relaxed pl-3.5">{item.desc}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}

                  {/* NO RESULTS STATE */}
                  {rulesCategories.filter(category => {
                    if (!rulesSearchQuery) return true;
                    const query = rulesSearchQuery.toLowerCase();
                    const categoryMatch = category.title.toLowerCase().includes(query);
                    const itemsMatch = category.items.some(item => 
                      item.title.toLowerCase().includes(query) || 
                      item.desc.toLowerCase().includes(query)
                    );
                    return categoryMatch || itemsMatch;
                  }).length === 0 && (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-neutral-200">
                      <AlertCircle className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                      <h4 className="font-extrabold text-neutral-700">Sonuç Bulunamadı</h4>
                      <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                        Girdiğiniz arama terimiyle eşleşen bir yarış kuralı bulunamadı. Lütfen başka bir kelime deneyin (örn: çip, yaş, emanet, limit).
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === "awards" && (
            <motion.div
              key="awards"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-2">
                  <Trophy className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-neutral-900 md:text-3xl">
                  Cumhuriyet Kupası Ödülleri
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  10K Cumhuriyet Koşusu'nda genel klasman kadınlar ve erkekler kategorilerinde ilk 10 dereceyi elde eden sporcularımıza verilecek nakdi para ödülleri aşağıda belirtilmiştir.
                </p>
              </div>

              {/* DETAILED PRIZES LIST */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden animate-fade-in">
                  <div className="bg-neutral-900 p-6 text-white text-center">
                    <span className="inline-block px-3 py-1 bg-red-600 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-2">
                      RESMİ NAKDİ PARA ÖDÜLLERİ
                    </span>
                    <h4 className="text-xl font-black">Genel Klasman Ödül Tablosu</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      * Ödüller Erkek ve Kadın kategorileri için ayrı ayrı olmak üzere her iki klasmanda da ilk 10'a giren sporculara aynı miktarda ödenir.
                    </p>
                  </div>

                  {/* GRID FOR TOP 3 SHINY CARDS */}
                  <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                    <h5 className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest text-center mb-6">
                      KÜRSÜ DERECELERİ (PODIUM)
                    </h5>
                    <div className="grid gap-4 md:grid-cols-3">
                      {/* 1ST PLACE */}
                      <div className="relative border-2 border-amber-400 rounded-2xl bg-amber-50/30 p-5 text-center shadow-sm flex flex-col justify-between">
                        <div className="absolute top-3 right-3">
                          <Trophy className="h-6 w-6 text-amber-500 fill-amber-300" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                            1.lik Ödülü
                          </span>
                          <h6 className="text-neutral-900 font-extrabold text-lg mt-2">Şampiyon</h6>
                        </div>
                        <div className="text-2xl font-black text-amber-600 mt-4">
                          15.000 TL
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1">Kadın & Erkek (Ayrı Ayrı)</p>
                      </div>

                      {/* 2ND PLACE */}
                      <div className="relative border-2 border-slate-300 rounded-2xl bg-slate-50 p-5 text-center shadow-sm flex flex-col justify-between">
                        <div className="absolute top-3 right-3">
                          <Trophy className="h-6 w-6 text-slate-400 fill-slate-200" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-full">
                            2.lik Ödülü
                          </span>
                          <h6 className="text-neutral-900 font-extrabold text-lg mt-2">İkinci</h6>
                        </div>
                        <div className="text-2xl font-black text-slate-600 mt-4">
                          12.500 TL
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1">Kadın & Erkek (Ayrı Ayrı)</p>
                      </div>

                      {/* 3RD PLACE */}
                      <div className="relative border-2 border-amber-700/30 rounded-2xl bg-amber-700/5 p-5 text-center shadow-sm flex flex-col justify-between">
                        <div className="absolute top-3 right-3">
                          <Trophy className="h-6 w-6 text-amber-700/70 fill-amber-700/20" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-700/10 px-2 py-0.5 rounded-full">
                            3.lük Ödülü
                          </span>
                          <h6 className="text-neutral-900 font-extrabold text-lg mt-2">Üçüncü</h6>
                        </div>
                        <div className="text-2xl font-black text-amber-800 mt-4">
                          10.000 TL
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1">Kadın & Erkek (Ayrı Ayrı)</p>
                      </div>
                    </div>
                  </div>

                  {/* LIST FOR 4 TO 10 PLACE */}
                  <div className="p-6">
                    <h5 className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest text-center mb-4">
                      DİĞER DERECE ÖDÜLLERİ (4 - 10)
                    </h5>
                    <div className="divide-y divide-neutral-100">
                      {[
                        { rank: 4, label: "4. Derece Ödülü", amount: "7.500 TL" },
                        { rank: 5, label: "5. Derece Ödülü", amount: "5.000 TL" },
                        { rank: 6, label: "6. Derece Ödülü", amount: "4.000 TL" },
                        { rank: 7, label: "7. Derece Ödülü", amount: "3.000 TL" },
                        { rank: 8, label: "8. Derece Ödülü", amount: "2.500 TL" },
                        { rank: 9, label: "9. Derece Ödülü", amount: "2.000 TL" },
                        { rank: 10, label: "10. Derece Ödülü", amount: "1.500 TL" },
                      ].map((item) => (
                        <div key={item.rank} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 font-extrabold text-xs">
                              {item.rank}
                            </span>
                            <span className="text-sm font-semibold text-neutral-700">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-neutral-900">{item.amount}</span>
                            <span className="text-[10px] text-neutral-400 font-medium">(Kadın / Erkek)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* MOTIVATION STAT */}
              <div className="max-w-xl mx-auto p-4 bg-neutral-100 rounded-2xl text-xs text-neutral-500 text-center flex items-center justify-center gap-2">
                <Info className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Para ödülleri Türkiye Atletizm Federasyonu resmi sonuçları onaylandıktan sonra hak sahiplerine ödenecektir. Tüm katılan sporcularımıza başarılar dileriz!</span>
              </div>
            </motion.div>
          )}

          {activeTab === "participants" && (
            <motion.div
              key="participants"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h3 className="text-2xl font-black text-neutral-900 md:text-3xl">
                  Katılımcı ve Göğüs No Sorgulama
                </h3>
                <p className="text-sm text-neutral-500">
                  Kayıt işlemini tamamlayan tüm koşucularımız göğüs numaralarını ve kategorilerini bu panelden güvenle sorgulayabilir.
                </p>
              </div>

              {/* FILTER BAR */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm max-w-3xl mx-auto grid gap-4 md:grid-cols-12">
                <div className="md:col-span-6 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Adınız, soyadınız veya göğüs numaranız..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className="md:col-span-4">
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                  >
                    <option value="Tümü">Tüm Kategoriler</option>
                    <option value="10K">10K Cumhuriyet Koşusu</option>
                    <option value="5K">5K Cumhuriyet Koşusu</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={fetchParticipants}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-xl h-full transition-colors"
                  >
                    Yenile
                  </button>
                </div>
              </div>

              {/* PARTICIPANTS DISPLAY LIST */}
              <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden max-w-3xl mx-auto">
                <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500 tracking-wider">KAYITLI KOŞUCU LİSTESİ</span>
                  <span className="px-2.5 py-1 rounded-md bg-neutral-200 text-neutral-700 text-[10px] font-bold">
                    {publicParticipants.length} Kayıt Gösteriliyor
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
                  {publicParticipants.length === 0 ? (
                    <div className="p-8 text-center text-neutral-400 text-sm">
                      Kayıtlı koşucu bulunamadı. Hemen ilk kaydı oluşturun!
                    </div>
                  ) : (
                    publicParticipants
                      .filter((p) => {
                        const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                             p.bibNumber.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesCat = searchCategory === "Tümü" || p.category === searchCategory;
                        return matchesQuery && matchesCat;
                      })
                      .map((runner, index) => (
                        <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50/50">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                              runner.category === "10K" ? "bg-red-50 text-red-600" : 
                              runner.category === "5K" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                            }`}>
                              {runner.category === "10K" ? "10K" : runner.category === "5K" ? "5K" : "1K"}
                            </div>
                            <div>
                              <span className="block font-semibold text-neutral-800 text-sm">{runner.name}</span>
                              <span className="text-[11px] text-neutral-400">Kayıt: {new Date(runner.registrationDate).toLocaleDateString("tr-TR")}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-neutral-100 border border-neutral-200/50 rounded-lg text-xs font-mono font-bold text-neutral-700">
                              {runner.bibNumber}
                            </span>
                            <span className="block text-[10px] text-neutral-400 mt-1">Göğüs Numarası</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "faq" && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-neutral-900 md:text-3xl">
                  Sıkça Sorulan Sorular (SSS)
                </h3>
                <p className="text-sm text-neutral-500">
                  Etkinlik, parkurlar, teslimatlar ve güvenlik önlemleri hakkında merak ettiğiniz tüm detaylar.
                </p>
              </div>

              {/* FAQ ACCORDION PANEL */}
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-neutral-100 bg-white rounded-2xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-neutral-800 hover:bg-neutral-50/50"
                    >
                      <span className="text-base">{faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-neutral-400 transition-transform ${
                          openFaqIndex === i ? "rotate-180 text-red-500" : ""
                        }`}
                      />
                    </button>
                    {openFaqIndex === i && (
                      <div className="px-5 pb-5 pt-1 text-sm text-neutral-500 border-t border-neutral-50 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CONTACT SUPPORT EXTRA CARD */}
              <div className="rounded-3xl bg-neutral-900 text-white p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-600/15 blur-2xl" />
                <div className="space-y-2 relative z-10 text-center md:text-left">
                  <h4 className="font-extrabold text-lg">Başka bir sorunuz mu var?</h4>
                  <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
                    Yarışma ile ilgili detaylı teknik konular, kurumsal katılım talepleri veya engelli sporcu destek başvuruları için destek birimimiz her zaman hazır.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0 relative z-10 justify-center md:justify-end">
                  <a
                    href="mailto:info@cumhuriyeticinkos.com"
                    className="px-5 py-3 rounded-2xl bg-white/10 text-neutral-100 font-semibold text-xs border border-white/10 hover:bg-white/20 transition-all"
                  >
                    info@cumhuriyeticinkos.com
                  </a>
                  <a
                    href="https://wa.me/905411161415"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-all shadow-md flex items-center gap-1"
                  >
                    WhatsApp (+90 541 116 14 15)
                  </a>
                  <a
                    href="tel:+905411161415"
                    className="px-5 py-3 rounded-2xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-all shadow-md"
                  >
                    Telefon (+90 541 116 14 15)
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "sponsors" && (
            <motion.div
              key="sponsors"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12 max-w-6xl mx-auto"
            >
              {/* HEADER HERO */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-100 px-4 py-1.5 text-xs font-semibold text-red-600">
                  <HeartHandshake className="h-4 w-4" />
                  Cumhuriyet Yolunda Birlikteyiz
                </div>
                <h3 className="text-3xl font-black text-neutral-900 md:text-4xl">
                  Değerli Sponsorlarımız ve Destekçilerimiz
                </h3>
                <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
                  Geleneksel Cumhuriyet Koşusu'nun hayat bulmasında, sporun birleştirici gücüyle cumhuriyet coşkusunun nesilden nesile aktarılmasında desteklerini esirgemeyen tüm kurumlara teşekkür ederiz.
                </p>
              </div>

              {/* DYNAMIC SPONSOR GROUPS */}
              <div className="space-y-16">
                {[
                  {
                    title: "Ana Sponsor",
                    role: "Ana Sponsor",
                    gridClass: "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-8",
                    cardClass: "p-8 border-2 border-amber-200/60 bg-gradient-to-b from-amber-50/30 to-white hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100/30",
                    isPremium: true
                  },
                  {
                    title: "Gıda Sponsorları",
                    role: "Gıda Sponsoru",
                    gridClass: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6",
                    cardClass: "p-6 border border-neutral-100 bg-white hover:border-red-200 hover:shadow-md",
                    isPremium: false
                  },
                  {
                    title: "Medya Sponsorları",
                    role: "Medya Sponsoru",
                    gridClass: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6",
                    cardClass: "p-6 border border-neutral-100 bg-white hover:border-red-200 hover:shadow-md",
                    isPremium: false
                  },
                  {
                    title: "Resmi Destekçilerimiz",
                    role: "Destekçilerimiz",
                    gridClass: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
                    cardClass: "p-5 border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-red-200 hover:shadow-md",
                    isPremium: false
                  }
                ].map((group) => {
                  const filtered = sponsors.filter((s) => s.role === group.role);
                  return (
                    <div key={group.role} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <h4 className={`font-black tracking-tight text-neutral-900 ${group.isPremium ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}>
                          {group.title}
                        </h4>
                        <div className="h-px bg-neutral-200 flex-grow" />
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{filtered.length} Kurum</span>
                      </div>

                      {filtered.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50 text-neutral-400 text-sm">
                          Bu kategoriye henüz sponsor eklenmedi.
                        </div>
                      ) : (
                        <div className={`grid ${group.gridClass}`}>
                          {filtered.map((sponsor) => (
                            <div
                              key={sponsor.id}
                              className={`group relative flex flex-col justify-between rounded-3xl transition-all duration-300 ${group.cardClass}`}
                            >
                              <div className="space-y-4">
                                {/* LOGO WORKSPACE */}
                                <div className="aspect-[1.8/1] w-full rounded-2xl bg-neutral-50 border border-neutral-100/80 flex items-center justify-center p-4 overflow-hidden relative shadow-inner bg-gradient-to-br from-neutral-50/50 to-neutral-100/50">
                                  {sponsor.logoUrl ? (
                                    <img
                                      src={sponsor.logoUrl}
                                      alt={sponsor.name}
                                      referrerPolicy="no-referrer"
                                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center text-center space-y-1 select-none">
                                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-200`}>
                                        {sponsor.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
                                      </div>
                                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">LOGO GEREKLİ</span>
                                    </div>
                                  )}
                                  
                                  {/* Hover overlay link icon */}
                                  {sponsor.websiteUrl && (
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="bg-white/90 text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-neutral-200/50 shadow flex items-center gap-1">
                                        Sitesi <ArrowRight className="h-3 w-3" />
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-1.5 text-center md:text-left">
                                  <div className="flex items-center justify-between gap-2">
                                    <h5 className="font-bold text-neutral-800 text-sm md:text-base leading-tight group-hover:text-red-600 transition-colors">
                                      {sponsor.name}
                                    </h5>
                                    {group.isPremium && (
                                      <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-200 text-amber-800 font-bold text-[9px] uppercase tracking-wider">
                                        PREMIUM
                                      </span>
                                    )}
                                  </div>
                                  {sponsor.description && (
                                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                                      {sponsor.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* ACTIONS FOR SPONSOR */}
                              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                                {sponsor.websiteUrl ? (
                                  <a
                                    href={sponsor.websiteUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline inline-flex items-center gap-1"
                                  >
                                    Web Sitesini Ziyaret Et
                                    <ArrowRight className="h-3 w-3" />
                                  </a>
                                ) : (
                                  <span className="text-xs text-neutral-400">Web Sitesi Yok</span>
                                )}

                                <button
                                  onClick={() => {
                                    if (confirm(`${sponsor.name} sponsorunu silmek istediğinize emin misiniz?`)) {
                                      setSponsors(sponsors.filter((s) => s.id !== sponsor.id));
                                    }
                                  }}
                                  className="text-[11px] font-bold text-neutral-400 hover:text-red-600 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                                  title="Sponsoru Sil"
                                >
                                  Sil
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* SPONSOR ADD FORM & ACTION FOR USER TO ADD LIVE */}
              <div className="border border-neutral-100 bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-neutral-800 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-red-500 animate-pulse" />
                      Sponsor Yönetim Paneli
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Yeni sponsorlar oluşturup logolarını ekleyebilirsiniz. Logolar anında yukarıdaki kategorilerde listelenir.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSponsor(!isAddingSponsor);
                      setSponsorError("");
                    }}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                      isAddingSponsor 
                        ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200" 
                        : "bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200"
                    }`}
                  >
                    {isAddingSponsor ? "Kapat" : "Yeni Sponsor Ekle"}
                  </button>
                </div>

                {isAddingSponsor && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSponsorError("");
                      if (!newSponsor.name.trim()) {
                        setSponsorError("Lütfen sponsor adını giriniz.");
                        return;
                      }

                      const created: Sponsor = {
                        id: Date.now().toString(),
                        name: newSponsor.name.toUpperCase(),
                        role: newSponsor.role,
                        logoUrl: newSponsor.logoUrl.trim() || undefined,
                        websiteUrl: newSponsor.websiteUrl.trim() || undefined,
                        description: newSponsor.description.trim() || undefined,
                      };

                      setSponsors([...sponsors, created]);
                      setNewSponsor({
                        name: "",
                        role: "Ana Sponsor",
                        logoUrl: "",
                        websiteUrl: "",
                        description: ""
                      });
                      setIsAddingSponsor(false);
                    }}
                    className="space-y-4 max-w-2xl"
                  >
                    {sponsorError && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {sponsorError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 uppercase">Sponsor Adı *</label>
                        <input
                          type="text"
                          required
                          value={newSponsor.name}
                          onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                          placeholder="Örn: CUMHURİYET BELEDİYESİ"
                          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-neutral-50/50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 uppercase">Sponsorluk Türü</label>
                        <select
                          value={newSponsor.role}
                          onChange={(e) => setNewSponsor({ ...newSponsor, role: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                        >
                          <option value="Ana Sponsor">Ana Sponsor</option>
                          <option value="Gıda Sponsoru">Gıda Sponsoru</option>
                          <option value="Medya Sponsoru">Medya Sponsoru</option>
                          <option value="Destekçilerimiz">Destekçilerimiz</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 uppercase">Sponsor Logo URL (İsteğe Bağlı)</label>
                        <input
                          type="url"
                          value={newSponsor.logoUrl}
                          onChange={(e) => setNewSponsor({ ...newSponsor, logoUrl: e.target.value })}
                          placeholder="Örn: https://site.com/logo.png"
                          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-neutral-50/50"
                        />
                        <span className="text-[10px] text-neutral-400 block leading-tight">
                          Boş bırakırsanız baş harflerinden otomatik şık bir logo üretilecektir.
                        </span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 uppercase">Sponsor Web Sitesi (İsteğe Bağlı)</label>
                        <input
                          type="url"
                          value={newSponsor.websiteUrl}
                          onChange={(e) => setNewSponsor({ ...newSponsor, websiteUrl: e.target.value })}
                          placeholder="Örn: https://isbank.com.tr"
                          className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-neutral-50/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600 uppercase">Açıklama (İsteğe Bağlı)</label>
                      <textarea
                        value={newSponsor.description}
                        onChange={(e) => setNewSponsor({ ...newSponsor, description: e.target.value })}
                        placeholder="Kurumun bu yarışmadaki desteği veya katkısı..."
                        rows={2}
                        className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-neutral-50/50"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingSponsor(false);
                          setSponsorError("");
                        }}
                        className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-semibold text-xs hover:bg-neutral-50 transition-colors"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors shadow-md"
                      >
                        Sponsoru Kaydet ve Yayınla
                      </button>
                    </div>
                  </form>
                )}

                {!isAddingSponsor && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <HeartHandshake className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-neutral-800">Canlı Yönetim</span>
                        <span className="text-[11px] text-neutral-400">Yeni logoları ekleyip anında görün.</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-neutral-800">Otomatik Logo Üretimi</span>
                        <span className="text-[11px] text-neutral-400">Logo resmi yoksa harika monogram hazırlar.</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-neutral-800">Kalıcı Kayıt</span>
                        <span className="text-[11px] text-neutral-400">Sponsorlar tarayıcınızda otomatik saklanır.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER AREA */}
      <footer className="border-t border-neutral-100 bg-white py-12 mt-16 text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-12 items-center">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-neutral-900">
                CUMHURİYET <span className="text-red-600">İÇİN KOŞ</span>
              </span>
            </div>
            <p className="leading-relaxed">
              Cumhuriyet İçin Koş Komitesi tarafından organize edilen 10K Cumhuriyet Koşusu, Mustafa Kemal Atatürk'ün aydınlık vizyonunu sporun evrensel değerleriyle yaşatmayı hedefler.
            </p>
            <p className="text-[10px] text-neutral-400">
              © {new Date().getFullYear()} Cumhuriyet İçin Koş. Tüm hakları saklıdır.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">Etkinlik Linkleri</h5>
            <div className="flex flex-col gap-2">
              <span className="hover:text-neutral-900 cursor-pointer" onClick={() => setActiveTab("home")}>Ana Sayfa</span>
              <span className="hover:text-neutral-900 cursor-pointer" onClick={() => setActiveTab("routes")}>Parkurlar</span>
              <span className="hover:text-neutral-900 cursor-pointer" onClick={() => setActiveTab("awards")}>Yarış Ödülleri</span>
              <span className="hover:text-neutral-900 cursor-pointer" onClick={() => setActiveTab("faq")}>Sıkça Sorulanlar</span>
            </div>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h5 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px]">Güvenlik & Gizlilik</h5>
            <p className="leading-relaxed text-neutral-400">
              Girdiğiniz katılım bilgileri 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında sadece organizasyon, sigorta poliçelendirme ve göğüs numarası teslimatı için Cumhuriyet İçin Koş Komitesi tarafından işlenmektedir.
            </p>
            <div className="flex gap-2 items-center">
              <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="text-[10px] text-emerald-600 font-semibold">SSL Korumalı Güvenli Altyapı</span>
            </div>
          </div>

        </div>
      </footer>

      {/* REGISTRATION MODAL / SLIDE-OVER */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh]"
            >
              {/* MODAL HEADER */}
              <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-white animate-pulse" />
                  <div>
                    <h3 className="font-extrabold text-base">CUMHURİYET KOŞUSU KATILIM FORMU</h3>
                    <p className="text-[10px] text-white/80">Bilgilerinizi eksiksiz ve güvenle giriniz.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRegisterOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* MODAL BODY (SCROLLABLE) */}
              <div className="p-6 overflow-y-auto space-y-6">
                {!registrationSuccess ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    
                    {/* INFO DISCLAIMER */}
                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/50 flex gap-3 items-start">
                      <Shield className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-neutral-500 leading-relaxed">
                        <strong>Güvenli Kayıt:</strong> Bu form üzerinden toplanan sağlık ve iletişim verileri, acil müdahale koordinasyonu ve yarış organizasyonu amacıyla kullanılacaktır.
                      </div>
                    </div>

                    {formError && (
                      <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs flex gap-2 items-center">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* AD SOYAD */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 block">Ad Soyad *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input
                            type="text"
                            required
                            placeholder="Örn: Mustafa Kemal"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                          />
                        </div>
                      </div>

                      {/* E-POSTA */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 block">E-Posta Adresi *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input
                            type="email"
                            required
                            placeholder="isim@adres.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                          />
                        </div>
                        <span className="text-[10px] text-neutral-400 block">Bu adrese Gemini destekli onay maili gönderilecektir.</span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {/* TELEFON */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-neutral-600 block">Cep Telefonu *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input
                            type="tel"
                            required
                            placeholder="05XX XXX XX XX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                          />
                        </div>
                      </div>

                      {/* YAŞ */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 block">Yaş *</label>
                        <input
                          type="number"
                          required
                          min="18"
                          max="99"
                          placeholder="Örn: 27"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* KOŞU KATEGORİSİ */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 block">Yarış Kategorisi *</label>
                        <input
                          type="text"
                          readOnly
                          value="10K Cumhuriyet Koşusu"
                          className="w-full px-3 py-2 text-sm border border-neutral-200 bg-neutral-100 text-neutral-500 rounded-xl font-semibold cursor-not-allowed"
                        />
                      </div>

                      {/* T-SHIRT BEDENİ */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 block">Resmi Tişört Bedeni *</label>
                        <select
                          value={formData.tShirtSize}
                          onChange={(e) => setFormData({ ...formData, tShirtSize: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                        >
                          <option value="XS">XS (Ekstra Küçük)</option>
                          <option value="S">S (Küçük)</option>
                          <option value="M">M (Orta)</option>
                          <option value="L">L (Büyük)</option>
                          <option value="XL">XL (Çok Büyük)</option>
                          <option value="XXL">XXL (Maksimum Büyük)</option>
                        </select>
                      </div>
                    </div>

                    {/* ACİL DURUM İLETİŞİM */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600 block">Acil Durumda Aranacak Kişi (Ad & Telefon) *</label>
                      <div className="relative">
                        <HeartHandshake className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                          type="text"
                          required
                          placeholder="Örn: Ayşe Yılmaz (Eşi) - 0532 XXX XX XX"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                          className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                        />
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-4 shrink-0">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 text-sm font-semibold rounded-2xl text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                          isSubmitting
                            ? "bg-red-500/50 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 shadow-red-200 hover:scale-[1.01]"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Gemini E-Posta Onayınız Hazırlanıyor...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Güvenli Kaydı Tamamla</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                ) : (
                  // REGISTRATION SUCCESS STATE WITH SIMULATED EMAIL CLIENT
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                      </div>
                      <h4 className="font-extrabold text-neutral-900 text-xl">Cumhuriyet Yolunda İlk Adımı Attınız!</h4>
                      <p className="text-sm text-neutral-500 max-w-md mx-auto">
                        Kayıt işleminiz tamamen güvenli bir şekilde sunucumuza kaydedilmiştir. Aşağıdaki e-posta simülatöründen e-postanızı görebilirsiniz.
                      </p>
                    </div>

                    {/* SUMMARY DETAIL CARDS */}
                    <div className="grid grid-cols-3 gap-4 bg-neutral-50 p-4 rounded-2xl text-center border border-neutral-200/50">
                      <div>
                        <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Göğüs No</span>
                        <span className="text-base font-mono font-black text-red-600">{registrationSuccess.bibNumber}</span>
                      </div>
                      <div className="border-x border-neutral-200">
                        <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Kategori</span>
                        <span className="text-sm font-extrabold text-neutral-800">{registrationSuccess.category}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Tişört</span>
                        <span className="text-sm font-extrabold text-neutral-800">{registrationSuccess.tShirtSize}</span>
                      </div>
                    </div>

                    {/* INTERACTIVE EMAIL SIMULATOR CLIENT WIDGET */}
                    <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-neutral-100">
                      
                      {/* EMAIL CLIENT HEADER */}
                      <div className="px-4 py-3 bg-neutral-800 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                          <span className="text-xs font-bold font-mono tracking-widest text-neutral-400 pl-2">OTOMATİK ONAY E-POSTASI ALINDI</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <Inbox className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-bold font-mono">Gelen Kutusu (1)</span>
                        </div>
                      </div>

                      {/* EMAIL METADATA */}
                      <div className="p-4 bg-white border-b border-neutral-200 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-500"><strong>Kimden:</strong> info@cumhuriyeticinkos.com (Cumhuriyet Koşusu Komitesi)</span>
                          <span className="text-neutral-400">{new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute:'2-digit' })}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500"><strong>Kime:</strong> {registrationSuccess.email}</span>
                        </div>
                        <div className="pt-2">
                          <span className="text-neutral-800 text-sm font-bold block">{registrationSuccess.emailSubject}</span>
                        </div>
                      </div>

                      {/* EMAIL CONTENT */}
                      <div className="p-5 bg-white max-h-[300px] overflow-y-auto text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {registrationSuccess.emailBody}
                      </div>

                    </div>

                    {/* CLOSE AND FINISH BUTTON */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsRegisterOpen(false);
                          setActiveTab("participants");
                        }}
                        className="flex-1 py-3 text-sm font-bold bg-neutral-900 text-white rounded-2xl hover:bg-neutral-800 transition-all text-center"
                      >
                        Katılımcı Listesinde Gör
                      </button>
                      <button
                        onClick={() => setIsRegisterOpen(false)}
                        className="flex-1 py-3 text-sm font-bold bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all text-center shadow-lg shadow-red-100"
                      >
                        Tamam, Kapat
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
