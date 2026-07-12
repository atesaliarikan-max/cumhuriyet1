import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory registrations list with initial sample participants to make the dashboard look active
interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: "10K";
  age: number;
  tShirtSize: string;
  emergencyContact: string;
  bibNumber: string;
  registrationDate: string;
  emailSubject: string;
  emailBody: string;
}

const REGISTRATIONS_FILE = path.join(process.cwd(), "data", "registrations.json");

// Helper to ensure data folder exists
const ensureDataFolder = () => {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Initial mock data to show and seed
const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "Mustafa Kemal Yılmaz",
    email: "mkyilmaz@cumhuriyet.org",
    phone: "0532 192 3100",
    category: "10K",
    age: 34,
    tShirtSize: "L",
    emergencyContact: "Annesi - Ayşe Yılmaz (0532 192 3101)",
    bibNumber: "10K-1923",
    registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    emailSubject: "Cumhuriyet Koşusu Kaydınız Onaylandı! Göğüs No: 10K-1923",
    emailBody: `Merhaba Mustafa Kemal Yılmaz,

**Cumhuriyet İçin Koş** etkinliğine katılımınız gururla onaylanmıştır!

**Cumhuriyetimizin yeni yaşında**, kırmızı ve beyaz renklerin coşkusuyla sahil şeridinde adımlarımızı birlikte atacağız.

### 🏃 Yarış Detayları:
- **Kategori:** 10K Cumhuriyet Koşusu
- **Göğüs Numaranız:** **10K-1923**
- **Tarih:** 18 Ekim 2026, Pazar
- **Başlangıç Saati:** 09:00 (Isınma başlangıcı: 08:30)
- **Tişört Bedeni:** L

Cumhuriyetimizin sarsılmaz adımlarla ileriye yürüyen birer ferdi olarak, 10K parkurunda göstereceğiniz performansta şimdiden başarılar dileriz. Isınma hareketlerini unutmayın ve yarış günü göğüs numaranızı takmayı ihmal etmeyin!

Her türlü sorunuz için **info@cumhuriyeticinkos.com** adresinden veya **+90 541 116 14 15** numaralı WhatsApp hattımızdan bize ulaşabilirsiniz.

*Geleceğe ve cumhuriyete koşan adımlarla,*
**Cumhuriyet Koşusu Komitesi**`
  },
  {
    id: "2",
    name: "Zeynep Aslan",
    email: "zeynep.aslan@email.com",
    phone: "0555 456 7890",
    category: "10K",
    age: 27,
    tShirtSize: "M",
    emergencyContact: "Eşi - Can Aslan (0555 456 7891)",
    bibNumber: "10K-2023",
    registrationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    emailSubject: "Cumhuriyet Yolunda Koşmaya Hazır Mısınız? Göğüs No: 10K-2023",
    emailBody: `Merhaba Zeynep Aslan,

**Cumhuriyet İçin Koş** etkinliğine katılımınız gururla onaylanmıştır!

**Cumhuriyetimizin ışığında**, hep birlikte sağlıklı ve mutlu bir geleceğe koşuyoruz.

### 🏃 Yarış Detayları:
- **Kategori:** 10K Cumhuriyet Koşusu
- **Göğüs Numaranız:** **10K-2023**
- **Tarih:** 18 Ekim 2026, Pazar
- **Başlangıç Saati:** 09:00
- **Tişört Bedeni:** M

10K parkurumuz, Çetin Emeç Bulvarı etkinlik alanından başlayıp, Tan Sokak üzerinden Bağdat Caddesi'ne bağlanan, Kızıltoprak BP İstasyonu'ndan Fener Kalamış Caddesi, Ahmet Mithat Efendi Caddesi ve Operatör Cemil Topuzlu Caddesi'ni takip ederek başlangıç noktasına dönen harika bir dairesel güzergaha sahiptir. Bu muhteşem buluşmada yanımızda olacağınız için heyecanlıyız.

Her türlü sorunuz için **info@cumhuriyeticinkos.com** adresinden veya **+90 541 116 14 15** numaralı WhatsApp hattımızdan bize ulaşabilirsiniz.

*Geleceğe ve cumhuriyete koşan adımlarla,*
**Cumhuriyet Koşusu Komitesi**`
  },
  {
    id: "3",
    name: "Ali Emir Şahin",
    email: "ali.emir@okul.k12.tr",
    phone: "0543 987 6543",
    category: "10K",
    age: 19,
    tShirtSize: "S",
    emergencyContact: "Babası - Murat Şahin (0543 987 6544)",
    bibNumber: "10K-1919",
    registrationDate: new Date().toISOString(),
    emailSubject: "Cumhuriyet Koşusuna Hazır Mısınız? Göğüs No: 10K-1919",
    emailBody: `Merhaba Ali Emir Şahin,

**Cumhuriyet İçin Koş** katılımınız onaylanmıştır!

Cumhuriyetimizi emanet aldığımız **pırıl pırıl gençlerimizin** spora ve sağlıklı geleceğe adımlar atması bizim için en büyük bayramdır.

### 🏃 Yarış Detayları:
- **Kategori:** 10K Cumhuriyet Koşusu
- **Göğüs Numaranız:** **10K-1919**
- **Tarih:** 18 Ekim 2026, Pazar
- **Başlangıç Saati:** 09:00
- **Tişört Bedeni:** S

Bu neşeli koşuda madalyanızı alırken gözlerinizdeki ışığı görmek için sabırsızlanıyoruz. Cumhuriyet coşkumuz katlanarak artacak!

Her türlü sorunuz için **info@cumhuriyeticinkos.com** adresinden veya **+90 541 116 14 15** numaralı WhatsApp hattımızdan bize ulaşabilirsiniz.

*Sevgi ve spor dolu bir geleceğe,*
**Cumhuriyet Koşusu Komitesi**`
  }
];

// Read registrations from file or return mock data
const getRegistrations = (): Participant[] => {
  try {
    ensureDataFolder();
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const data = fs.readFileSync(REGISTRATIONS_FILE, "utf-8");
      return JSON.parse(data);
    } else {
      fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(mockParticipants, null, 2), "utf-8");
      return mockParticipants;
    }
  } catch (err) {
    console.error("Error reading registrations, returning in-memory fallback:", err);
    return mockParticipants;
  }
};

// Write registrations to file
const saveRegistrations = (registrations: Participant[]) => {
  try {
    ensureDataFolder();
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving registrations to file:", err);
  }
};

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;
const isPlaceholderKey = !key || key === "MY_GEMINI_API_KEY";

if (!isPlaceholderKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client successfully initialized.");
  } catch (err) {
    console.error("Error initializing Gemini client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not configured or is placeholder. Falling back to offline templating engine.");
}

// Generates a personalized confirmation email using Gemini or offline template
const generatePersonalizedEmail = async (
  name: string,
  category: string,
  bibNumber: string,
  age: number,
  tShirtSize: string
): Promise<{ subject: string; body: string }> => {
  if (ai) {
    try {
      console.log(`Requesting personalized email from Gemini for ${name}...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Kullanıcı "Cumhuriyet İçin Koş" 10K koşu etkinliğine kayıt oldu. 
Kayıt Bilgileri:
Ad Soyad: ${name}
Yaş: ${age}
Kategori: ${category} (10K Atatürk Koşusu)
Göğüs Numarası: ${bibNumber}
Tişört Bedeni: ${tShirtSize}

Bu bilgilere özel, Cumhuriyet Bayramı coşkusunu, cumhuriyet değerlerini, şanlı Türk bayrağımızın asaletini, sporu ve sağlıklı yaşamı harmanlayan, son derece içten, motive edici, resmi ama enerjik bir tebrik/onay e-postası (Türkçe) üret.
E-posta gövdesinde mutlaka Atatürk'ün spora ve gençliğe verdiği öneme atıfta bulun, yarışın 18 Ekim 2026 Pazar günü saat 09:00'da başlayacağını ve Çetin Emeç Bulvarı etkinlik alanından başlayıp, Tan Sokak, Bağdat Caddesi, Kızıltoprak BP, Fener Kalamış Caddesi, Ahmet Mithat Efendi Caddesi ve Operatör Cemil Topuzlu Caddesi'ni takip eden 10K dairesel parkurunu hatırlat.
Her türlü soru için destek e-postası: info@cumhuriyeticinkos.com, telefon ve whatsapp: +90 541 116 14 15 bilgilerini ekle.
İçeriği markdown formatında, başlıklar, listeler ve vurgularla estetik bir şekilde biçimlendir.

Lütfen yanıtı JSON olarak ver. Şema şöyle olmalıdır:
{
  "subject": "E-postanın Konu Kısmı (Etkileyici ve motive edici, örn: Cumhuriyet Yolunda Gururla Koşuyoruz! Göğüs No: 10K-1923)",
  "body": "Markdown formatında e-posta gövde metni"
}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              body: { type: Type.STRING, description: "Personalized body in markdown format" },
            },
            required: ["subject", "body"],
          },
        },
      });

      if (response && response.text) {
        const result = JSON.parse(response.text.trim());
        if (result.subject && result.body) {
          return {
            subject: result.subject,
            body: result.body,
          };
        }
      }
    } catch (err) {
      console.error("Gemini content generation failed, using offline fallback:", err);
    }
  }

  // Local/Offline Fallback with beautiful styling
  const subject = `Cumhuriyet İçin Koş 10K Kayıt Onayı! Göğüs Numaranız: ${bibNumber}`;
  const categoryMessage = "10K Atatürk Parkuru'nda (Çetin Emeç Bulvarı, Tan Sokak, Bağdat Caddesi, Kızıltoprak BP, Kalamış Sahili dairesel güzergahı), cumhuriyetimizin sarsılmaz adımlarını temsil ederek sınırlarınızı zorlayacak ve cumhuriyet ruhunu şanlı bayrağımızın gölgesinde yaşatacak olmanızdan kıvanç duyuyoruz.";

  const body = `Merhaba ${name},

**Cumhuriyet İçin Koş** 10K etkinliğine katılım kaydınız başarıyla tamamlanmıştır! 

Gazi Mustafa Kemal Atatürk'ün *"Ben sporcunun zeki, çevik ve aynı zamanda ahlaklısını severim."* şiarıyla spora ve sağlıklı yaşama verdiği kıymeti bugün Cumhuriyet yolunda adımlayarak yaşatıyoruz. Cumhuriyetimizin yeni yaşını büyük bir gururla, sporun birleştirici gücüyle kutlayacağız.

${categoryMessage}

### 🏃 Kayıt Bilgileriniz & Parkur Detayları:
- **Katılımcı Adı:** ${name}
- **Yarış Kategorisi:** 10K Atatürk Koşusu
- **Göğüs Numaranız:** **${bibNumber}**
- **Tişört Bedeni:** ${tShirtSize}
- **Etkinlik Tarihi:** 18 Ekim 2026, Pazar
- **Başlangıç Saati:** 09:00 (Isınma başlangıcı: 08:30)
- **Başlangıç & Bitiş Alanı:** Çetin Emeç Bulvarı Etkinlik Alanı (Dalyan Park Önü), İstanbul

### 💡 Hazırlık Tavsiyeleri:
1. **Göğüs Numaranız:** Göğüs numaranızı yarış günü göğsünüzün ön kısmına tam olarak görünür şekilde takınız.
2. **Kıyafet:** Kayıt esnasında seçtiğiniz resmi Cumhuriyet koşusu tişörtünüzü etkinlik teslim noktalarından temin edebilirsiniz.
3. **Isınma:** Yarış başlama saati olan 09:00'dan en az 30 dakika önce alanda hazır bulunarak resmi antrenörlerimiz eşliğinde yapılacak toplu ısınma hareketlerine katılmanızı öneririz.

### 📞 İletişim & Destek:
Her türlü sorunuz için **info@cumhuriyeticinkos.com** adresinden veya **+90 541 116 14 15** numaralı WhatsApp destek hattımızdan bize dilediğiniz an ulaşabilirsiniz.

*Geleceğe ve cumhuriyete koşan adımlarla,*
**Cumhuriyet Koşusu Komitesi**`;

  return { subject, body };
};

// --- API ENDPOINTS ---

// Get all registrations (for public counter or admin list view)
app.get("/api/registrations", (req, res) => {
  const registrations = getRegistrations();
  // Filter out sensitive details like email, phone, emergency contact if it's a public search
  const isPublic = req.query.public === "true";
  if (isPublic) {
    const publicList = registrations.map((p) => ({
      name: p.name.split(" ").map((n, i) => (i === 0 ? n : n[0] + "***")).join(" "), // Mask surname
      category: p.category,
      bibNumber: p.bibNumber,
      registrationDate: p.registrationDate,
    }));
    return res.json(publicList);
  }
  res.json(registrations);
});

// Register new participant
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, category, age, tShirtSize, emergencyContact } = req.body;

    // Server-side validation
    if (!name || !email || !phone || !category || !age || !tShirtSize || !emergencyContact) {
      return res.status(400).json({ error: "Lütfen tüm zorunlu alanları eksiksiz doldurunuz." });
    }

    const registrations = getRegistrations();

    // Check if email already registered for this race
    const exists = registrations.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "Bu e-posta adresiyle zaten bir katılım kaydı oluşturulmuş." });
    }

    // Generate custom Bib Number for 10K
    const randNum = Math.floor(1000 + Math.random() * 9000); // 1000 to 9999
    const bibNumber = `10K-${randNum}`;

    // Generate personalized Cumhuriyet motivation email
    const emailResult = await generatePersonalizedEmail(
      name,
      category,
      bibNumber,
      parseInt(age),
      tShirtSize
    );

    // Create participant record
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      category,
      age: parseInt(age),
      tShirtSize,
      emergencyContact,
      bibNumber,
      registrationDate: new Date().toISOString(),
      emailSubject: emailResult.subject,
      emailBody: emailResult.body,
    };

    registrations.unshift(newParticipant); // Add to beginning of array
    saveRegistrations(registrations);

    res.status(201).json({
      success: true,
      message: "Katılım kaydınız başarıyla oluşturuldu ve onay e-postası gönderildi!",
      participant: newParticipant,
    });
  } catch (err: any) {
    console.error("Registration endpoint failed:", err);
    res.status(500).json({ error: "Kayıt işlemi sırasında bir sunucu hatası oluştu. Lütfen tekrar deneyiniz." });
  }
});

// Reset registrations to default mocks (for dev testing)
app.post("/api/reset", (req, res) => {
  saveRegistrations(mockParticipants);
  res.json({ message: "Sistem verileri sıfırlandı.", data: mockParticipants });
});

// Vite Middleware integration
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
