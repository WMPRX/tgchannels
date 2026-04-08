import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { slug: 'spor', tr: 'Spor', en: 'Sport' },
  { slug: 'oyun', tr: 'Oyun', en: 'Game' },
  { slug: 'donanim-yazilim', tr: 'Donanım-Yazılım', en: 'Hardware-Software' },
  { slug: 'haber', tr: 'Haber', en: 'News' },
  { slug: 'is-ilanlari', tr: 'İş İlanları', en: 'Job Postings' },
  { slug: 'grafik-video', tr: 'Grafik-Video', en: 'Graphics-Video' },
  { slug: 'seo', tr: 'SEO', en: 'SEO' },
  { slug: 'sohbet-arkadaslik', tr: 'Sohbet-Arkadaşlık', en: 'Chat-Friendship' },
  { slug: 'sosyal-medya', tr: 'Sosyal Medya', en: 'Social Media' },
  { slug: 'sanat-kultur', tr: 'Sanat ve Kültür', en: 'Art and Culture' },
  { slug: 'e-ticaret', tr: 'E-Ticaret', en: 'E-Commerce' },
  { slug: 'alisveris', tr: 'Alışveriş', en: 'Shopping' },
  { slug: 'topluluk', tr: 'Topluluk', en: 'Community' },
  { slug: 'saglik', tr: 'Sağlık', en: 'Health' },
  { slug: 'diger', tr: 'Diğer', en: 'Other' },
  { slug: 'ticaret', tr: 'Ticaret', en: 'Trade' },
  { slug: 'emlak', tr: 'Emlak', en: 'Real Estate' },
  { slug: 'gece-hayati', tr: 'Gece Hayatı', en: 'Nightlife' },
  { slug: 'muzik', tr: 'Müzik', en: 'Music' },
  { slug: 'ogrenci', tr: 'Öğrenci', en: 'Student' },
  { slug: 'arac', tr: 'Araç', en: 'Vehicle' },
  { slug: 'tatil', tr: 'Tatil', en: 'Holiday' },
  { slug: 'teknoloji', tr: 'Teknoloji', en: 'Technology' },
  { slug: 'universite', tr: 'Üniversite', en: 'University' },
  { slug: 'startup', tr: 'Start-up', en: 'Start-up' },
  { slug: 'dizi-film', tr: 'Dizi-Film', en: 'Series-Movie' },
  { slug: 'para-kazanma', tr: 'Para Kazanma', en: 'Earning Money' },
  { slug: 'hobi', tr: 'Hobi', en: 'Hobby' },
  { slug: 'tv', tr: 'TV', en: 'TV' },
  { slug: 'din', tr: 'Din', en: 'Religion' },
  { slug: 'yemek', tr: 'Yemek', en: 'Food' },
  { slug: 'seyahat', tr: 'Seyahat', en: 'Travel' },
  { slug: 'fotografcilik', tr: 'Fotoğrafçılık', en: 'Photography' },
  { slug: 'borsa-yatirim', tr: 'Borsa-Yatırım', en: 'Stock Exchange-Investment' },
  { slug: 'plus18', tr: '+18', en: '+18' },
  { slug: 'hizmetler', tr: 'Hizmetler', en: 'Services' },
];

async function main() {
  console.log('Seeding database...');

  // Admin user
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tgchannels.com' },
    update: {},
    create: {
      email: 'admin@tgchannels.com',
      username: 'admin',
      passwordHash,
      provider: 'email',
      role: 'admin',
    },
  });
  console.log('Admin user created:', admin.id);

  // Categories
  const catIds: Record<string, number> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        translations: {
          create: [
            { locale: 'tr', name: cat.tr },
            { locale: 'en', name: cat.en },
          ],
        },
      },
    });
    catIds[cat.slug] = created.id;
  }
  console.log('Categories created:', Object.keys(catIds).length);

  // Sample groups
  const groups = [
    // WhatsApp Groups
    { title: 'Türkiye Spor Haberleri', description: 'Türkiyedeki tüm spor gelişmelerini takip edin. Futbol, basketbol, voleybol ve daha fazlası bu grupta paylaşılıyor.', platform: 'whatsapp_group' as const, slug: 'spor', link: 'https://chat.whatsapp.com/Abc123DefGhi456JklMno', views: 3200 },
    { title: 'Teknoloji Dünyası', description: 'Yazılım, donanım, yapay zeka ve teknoloji dünyasındaki son gelişmeleri takip edebileceğiniz aktif bir WhatsApp grubu.', platform: 'whatsapp_group' as const, slug: 'teknoloji', link: 'https://chat.whatsapp.com/Xyz789PqrStu012VwxYza', views: 2800 },
    { title: 'İş İlanları Türkiye', description: 'Türkiyeden güncel iş ilanları ve kariyer fırsatları paylaşılıyor. Her sektörden ilanlar mevcuttur.', platform: 'whatsapp_group' as const, slug: 'is-ilanlari', link: 'https://chat.whatsapp.com/BcdEfg234HijKlm567Nop', views: 4100 },
    { title: 'Emlak Yatırım Grubu', description: 'Türkiyede emlak yatırımı yapanlar için özel grup. Konut, işyeri ve arsa fırsatları paylaşılıyor.', platform: 'whatsapp_group' as const, slug: 'emlak', link: 'https://chat.whatsapp.com/QrsTuv890WxyZab123Cde', views: 1900 },
    { title: 'Yemek Tarifleri', description: 'Türk mutfağından dünya mutfağına binlerce tarif. Hergün yeni tarifler paylaşılıyor, sorularınızı sorabilirsiniz.', platform: 'whatsapp_group' as const, slug: 'yemek', link: 'https://chat.whatsapp.com/FghIjk456LmnOpq789Rst', views: 5200 },
    { title: 'Borsa ve Yatırım', description: 'Hisse senedi, forex, kripto para yatırımları hakkında günlük analizler ve yorumlar paylaşılan aktif yatırım grubu.', platform: 'whatsapp_group' as const, slug: 'borsa-yatirim', link: 'https://chat.whatsapp.com/UvwXyz012AbcDef345Ghi', views: 3700 },
    { title: 'Sohbet ve Arkadaşlık', description: 'Yeni insanlarla tanışmak ve sohbet etmek için kurulmuş samimi bir topluluk. Herkes davetlidir!', platform: 'whatsapp_group' as const, slug: 'sohbet-arkadaslik', link: 'https://chat.whatsapp.com/JklMno678PqrStu901Vwx', views: 2300 },
    { title: 'Seyahat Paylaşımları', description: 'Yurt içi ve yurt dışı seyahat deneyimlerini paylaşın, tavsiye alın ve verin. Tur grupları burada organize ediliyor.', platform: 'whatsapp_group' as const, slug: 'seyahat', link: 'https://chat.whatsapp.com/YzaAbc234DefGhi567Jkl', views: 1800 },
    { title: 'Müzik Severler', description: 'Her türden müzik dinleyicilerini bir araya getiren grup. Playlist önerileri, konser haberleri ve müzik tartışmaları.', platform: 'whatsapp_group' as const, slug: 'muzik', link: 'https://chat.whatsapp.com/MnoPqr890StuVwx123Yza', views: 2100 },
    { title: 'Grafik Tasarım Topluluğu', description: 'Türk grafik tasarımcılar için iş bulma, portföy paylaşımı ve eğitim içerikleri sunan aktif bir topluluk.', platform: 'whatsapp_group' as const, slug: 'grafik-video', link: 'https://chat.whatsapp.com/BcdEfg456HijKlm789Nop', views: 1600 },

    // WhatsApp Channels
    { title: 'Haber Kanalı TR', description: 'Türkiyenin en güncel haberlerini anında paylaşan resmi haber kanalı. Sabah akşam gündem özeti yayınlanmaktadır.', platform: 'whatsapp_channel' as const, slug: 'haber', link: 'https://chat.whatsapp.com/QrsTuv234WxyZab567Cde', views: 8900 },
    { title: 'Teknoloji Haberleri', description: 'Dünya teknoloji gündemini takip edin. Apple, Google, Samsung ve diğer teknoloji şirketlerinden haberler.', platform: 'whatsapp_channel' as const, slug: 'teknoloji', link: 'https://chat.whatsapp.com/FghIjk012LmnOpq345Rst', views: 7200 },
    { title: 'Borsa Sinyalleri', description: 'Profesyonel analistlerin hazırladığı günlük borsa sinyalleri ve yatırım önerileri. BIST100 odaklı içerikler.', platform: 'whatsapp_channel' as const, slug: 'borsa-yatirim', link: 'https://chat.whatsapp.com/UvwXyz678AbcDef901Ghi', views: 6100 },
    { title: 'Dizi Film Önerileri', description: 'Netflix, BluTV, Amazon Prime ve diğer platformlardaki dizi ve film önerilerini takip edin.', platform: 'whatsapp_channel' as const, slug: 'dizi-film', link: 'https://chat.whatsapp.com/JklMno234PqrStu567Vwx', views: 5400 },
    { title: 'Sağlıklı Yaşam', description: 'Diyet, egzersiz, meditasyon ve sağlıklı yaşam için günlük ipuçları. Uzman görüşleri ve bilimsel araştırmalar.', platform: 'whatsapp_channel' as const, slug: 'saglik', link: 'https://chat.whatsapp.com/YzaAbc890DefGhi123Jkl', views: 4300 },
    { title: 'Fotoğraf Sanatı', description: 'Amatör ve profesyonel fotoğrafçıların eserlerini paylaştığı estetik bir kanal. Haftalık fotoğraf yarışmaları.', platform: 'whatsapp_channel' as const, slug: 'fotografcilik', link: 'https://chat.whatsapp.com/MnoPqr456StuVwx789Yza', views: 3100 },
    { title: 'Girişimcilik ve Start-up', description: 'Türk girişimciler için ilham, haber ve rehber içerikler. Başarı hikayeleri ve yatırım fırsatları.', platform: 'whatsapp_channel' as const, slug: 'startup', link: 'https://chat.whatsapp.com/BcdEfg012HijKlm345Nop', views: 2800 },
    { title: 'E-Ticaret İpuçları', description: 'Online satış, dropshipping, Trendyol ve Hepsiburada satıcıları için pratik ipuçları ve stratejiler.', platform: 'whatsapp_channel' as const, slug: 'e-ticaret', link: 'https://chat.whatsapp.com/QrsTuv678WxyZab901Cde', views: 3900 },
    { title: 'Müzik Keşif', description: 'Her hafta yeni müzisyenler, albümler ve parçaları keşfedin. Türk ve dünya müziğinden özel seçkiler.', platform: 'whatsapp_channel' as const, slug: 'muzik', link: 'https://chat.whatsapp.com/FghIjk234LmnOpq567Rst', views: 2200 },
    { title: 'Spor Dünyası', description: 'Futbol, basketbol, tenis ve olimpiyat haberleri. Maç özetleri ve spor yorumları günlük paylaşılıyor.', platform: 'whatsapp_channel' as const, slug: 'spor', link: 'https://chat.whatsapp.com/UvwXyz890AbcDef123Ghi', views: 5600 },

    // Telegram Groups
    { title: 'Yazılımcılar TR', description: 'Türk yazılım geliştiricileri için aktif topluluk. JavaScript, Python, Go ve daha fazla dil hakkında yardım ve tartışmalar.', platform: 'telegram_group' as const, slug: 'donanim-yazilim', link: 'https://t.me/yazilimcilartr', views: 4500 },
    { title: 'SEO Uzmanları', description: 'Türk SEO uzmanları ve dijital pazarlamacılar için özel grup. Google güncellemeleri, case studyler ve ipuçları.', platform: 'telegram_group' as const, slug: 'seo', link: 'https://t.me/seouzmanlaritr', views: 3200 },
    { title: 'Crypto Yatırımcıları', description: 'Bitcoin, Ethereum ve altcoin yatırımları hakkında teknik analizler, haberler ve tartışmalar. DYOR!', platform: 'telegram_group' as const, slug: 'borsa-yatirim', link: 'https://t.me/cryptoyatirimtr', views: 6800 },
    { title: 'Üniversite Öğrencileri', description: 'Türk üniversite öğrencilerinin buluşma noktası. Ders notları, sınav tavsiyeleri ve öğrenci yaşantısı.', platform: 'telegram_group' as const, slug: 'universite', link: 'https://t.me/universiteogrencileri', views: 2900 },
    { title: 'Girişimcilik Ekosistemi', description: 'Start-up kurucuları, yatırımcılar ve mentorlar bir arada. Haftalık online etkinlikler ve networking fırsatları.', platform: 'telegram_group' as const, slug: 'startup', link: 'https://t.me/girisimciliktr', views: 2100 },
    { title: 'Sağlıklı Beslenme', description: 'Vejetaryen, vegan ve glutensiz beslenme hakkında tarifler, araştırmalar ve deneyimler paylaşılıyor.', platform: 'telegram_group' as const, slug: 'saglik', link: 'https://t.me/sagliklibeslenme', views: 1800 },
    { title: 'Fotoğraf ve Sinema', description: 'Fotoğrafçılık ve sinema tutkunu insanların buluştuğu grup. Teknik ipuçları, ekipman önerileri ve eser paylaşımı.', platform: 'telegram_group' as const, slug: 'fotografcilik', link: 'https://t.me/fotografvesinemaseverler', views: 1500 },
    { title: 'Sosyal Medya Yöneticileri', description: 'Instagram, TikTok ve Twitter yöneticileri için içerik fikirleri, algoritmalar ve büyüme stratejileri.', platform: 'telegram_group' as const, slug: 'sosyal-medya', link: 'https://t.me/sosyalmedyayoneticileri', views: 2700 },
    { title: 'Araç Tutkunları', description: 'Araba, motorsiklet ve bisiklet meraklıları için modifikasyon, bakım ve alım-satım platformu.', platform: 'telegram_group' as const, slug: 'arac', link: 'https://t.me/aractutkunlaritr', views: 3300 },
    { title: 'Oyun Dünyası TR', description: 'PC, konsol ve mobil oyuncular için turnuvalar, haberler ve tartışmalar. CS2, Valorant ve daha fazlası.', platform: 'telegram_group' as const, slug: 'oyun', link: 'https://t.me/oyundünyasitr', views: 5100 },

    // Telegram Channels
    { title: 'Teknoloji Bülteni', description: 'Teknoloji dünyasından özenle seçilmiş haberler ve analizler. Her gün sabah yayınlanan gündem özeti.', platform: 'telegram_channel' as const, slug: 'teknoloji', link: 'https://t.me/teknolojibulteni', views: 9200 },
    { title: 'Para Kazanma Yolları', description: 'Online ve offline para kazanma yöntemleri, pasif gelir fikirleri ve freelance fırsatları.', platform: 'telegram_channel' as const, slug: 'para-kazanma', link: 'https://t.me/parakazanmayollari', views: 7800 },
    { title: 'Sinema ve Dizi Günlüğü', description: 'Her gün yeni bir dizi veya film önerisi. Spoilersiz yorumlar ve izleme listeleri.', platform: 'telegram_channel' as const, slug: 'dizi-film', link: 'https://t.me/sinemadizigunlugu', views: 6400 },
    { title: 'Seyahat Rehberi', description: 'Dünyadan ve Türkiyeden seyahat rotaları, otel önerileri, uçuş fırsatları ve gezi rehberleri.', platform: 'telegram_channel' as const, slug: 'seyahat', link: 'https://t.me/seyahatrehberi', views: 5100 },
    { title: 'Hobi ve El Sanatları', description: 'Örgü, ahşap boyama, seramik ve daha birçok el sanatı için eğitim videoları ve ilham fotoğrafları.', platform: 'telegram_channel' as const, slug: 'hobi', link: 'https://t.me/hobiveelsanatlari', views: 3800 },
    { title: 'Günlük Haber Özeti', description: 'Türkiyenin ve dünyanın gündemini her sabah özetleyen güvenilir haber kanalı.', platform: 'telegram_channel' as const, slug: 'haber', link: 'https://t.me/gunlukhaber', views: 11200 },
    { title: 'Sosyal Medya Büyüme', description: 'Instagram ve TikTok büyüme stratejileri, viral içerik sırları ve monetizasyon rehberleri.', platform: 'telegram_channel' as const, slug: 'sosyal-medya', link: 'https://t.me/sosyalmedyabüyüme', views: 4600 },
    { title: 'Grafik Tasarım İlhamı', description: 'Her gün taze tasarım fikirleri, renk paletleri, font önerileri ve UI/UX trendleri.', platform: 'telegram_channel' as const, slug: 'grafik-video', link: 'https://t.me/grafiktasarimilhami', views: 3200 },
    { title: 'Yemek Tarifleri Kanalı', description: 'Videolu Türk ve dünya mutfağı tarifleri. Hergün yeni ve kolay tarifler paylaşılıyor.', platform: 'telegram_channel' as const, slug: 'yemek', link: 'https://t.me/yemektariflerikanal', views: 7100 },
    { title: 'Oyun Haberleri', description: 'Gaming dünyasından son dakika haberleri, oyun incelemeleri ve çıkış tarihleri.', platform: 'telegram_channel' as const, slug: 'oyun', link: 'https://t.me/oyunhaberleri', views: 5900 },

    // Discord Servers
    { title: 'TurkGamers', description: 'Türk oyuncuların buluşma noktası. CS2, Valorant, LoL ve daha birçok oyun için özel kanallar, turnuvalar ve etkinlikler düzenleniyor.', platform: 'discord_server' as const, slug: 'oyun', link: 'https://discord.gg/turkgamers', views: 8700 },
    { title: 'Yazılım Geliştirme TR', description: 'Türk yazılımcılar için Discord sunucusu. Frontend, backend, mobile ve DevOps konularında yardım, proje ortaklığı ve mentorluk.', platform: 'discord_server' as const, slug: 'donanim-yazilim', link: 'https://discord.gg/yazilimtr', views: 6300 },
    { title: 'Dijital Sanat & Tasarım', description: 'Dijital sanatçılar, illüstratörler ve grafik tasarımcılar için yaratıcı ortam. Eser paylaşımı, feedback ve iş birliği.', platform: 'discord_server' as const, slug: 'sanat-kultur', link: 'https://discord.gg/dijitalsanat', views: 4200 },
    { title: 'Kripto & DeFi Türkiye', description: 'Kripto para, DeFi, NFT ve Web3 hakkında her şey. Türk kripto topluluğunun en aktif Discord sunucusu.', platform: 'discord_server' as const, slug: 'borsa-yatirim', link: 'https://discord.gg/kriptotr', views: 7500 },
    { title: 'Müzik Üretimi TR', description: 'Beat maker, prodüktör ve müzisyenler için Discord. Beat paylaşımı, kolaborasyon ve eğitim kanalları.', platform: 'discord_server' as const, slug: 'muzik', link: 'https://discord.gg/muzikuretimi', views: 3100 },
    { title: 'Anime & Manga Türkiye', description: 'Anime ve manga hayranları için Türkçe Discord sunucusu. Tartışmalar, öneriler ve fan art paylaşımları.', platform: 'discord_server' as const, slug: 'hobi', link: 'https://discord.gg/animetr', views: 5800 },
    { title: 'Girişimci Network', description: 'Türk girişimciler ve iş insanları için networking sunucusu. Pitch kanalları, yatırımcı bağlantıları ve iş ortaklıkları.', platform: 'discord_server' as const, slug: 'startup', link: 'https://discord.gg/girisimcinetwork', views: 2900 },
    { title: 'Fotoğrafçılık Kulübü', description: 'Türk fotoğrafçılar için Discord. Fotoğraf paylaşımı, teknik sorular, ekipman önerileri ve aylık yarışmalar.', platform: 'discord_server' as const, slug: 'fotografcilik', link: 'https://discord.gg/fotografcilik', views: 2400 },
    { title: 'Üniversite Öğrenci Hub', description: 'Farklı üniversitelerden öğrenciler için ortak platform. Ders yardımı, ders notu paylaşımı ve sosyal etkinlikler.', platform: 'discord_server' as const, slug: 'universite', link: 'https://discord.gg/ogrencihub', views: 4800 },
    { title: 'Türk E-spor Ligi', description: 'Türk e-spor tutkunları için profesyonel ortam. Takım kurma, maç ayarlama ve turnuva organizasyonu kanalları.', platform: 'discord_server' as const, slug: 'spor', link: 'https://discord.gg/turkesporlig', views: 6100 },
  ];

  let created = 0;
  for (const g of groups) {
    await prisma.group.create({
      data: {
        userId: admin.id,
        title: g.title,
        description: g.description,
        platform: g.platform,
        categoryId: catIds[g.slug],
        inviteLink: g.link,
        language: 'tr',
        status: 'approved',
        viewCount: g.views,
      },
    });
    created++;
  }
  console.log('Groups created:', created);

  // Sponsor links
  await prisma.sponsorLink.createMany({
    data: [
      { title: 'VDS & Hosting Çözümleri', url: 'https://example.com/hosting', isActive: true, sortOrder: 1 },
      { title: 'Dijital Pazarlama Ajansı', url: 'https://example.com/agency', isActive: true, sortOrder: 2 },
    ],
  });
  console.log('Sponsor links created');
  console.log('Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
