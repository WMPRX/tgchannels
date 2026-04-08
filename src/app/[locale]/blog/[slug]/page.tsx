import { notFound } from 'next/navigation';
import Link from 'next/link';

// Static blog posts — extend as needed
const posts: Record<string, { title: string; date: string; content: string }> = {
  'telegram-gruplari-nasil-bulunur': {
    title: 'Telegram Grupları Nasıl Bulunur?',
    date: '2024-01-15',
    content: `
Telegram, dünya genelinde milyonlarca kullanıcıya sahip olan ve giderek büyüyen bir mesajlaşma platformudur.
Telegram gruplarına katılmak için birkaç farklı yöntem mevcuttur.

## Arama Motorları Üzerinden Arama

Google gibi arama motorlarında "Telegram grup linki" veya ilgilendiğiniz konuyu belirterek arama yapabilirsiniz.

## Dizin Siteleri

TGChannels.com gibi grup dizin sitelerini kullanarak kategorilere göre Telegram gruplarını keşfedebilirsiniz.

## Davet Linkleri

Arkadaşlarınız veya tanıdıklarınız size doğrudan davet linki paylaşabilir. Bu linkler t.me/ ile başlar.

## Sosyal Medya

Twitter, Reddit ve diğer sosyal medya platformlarında ilgilendiğiniz konularla ilgili paylaşımları takip ederek
grup linklerine ulaşabilirsiniz.
    `.trim(),
  },
  'whatsapp-gruplari-2024': {
    title: 'En İyi WhatsApp Grupları 2024',
    date: '2024-02-01',
    content: `
WhatsApp grupları, aynı ilgi alanlarına sahip kişilerin bir araya gelerek iletişim kurmasını sağlar.
2024 yılında en popüler WhatsApp grup kategorilerine göz atın.

## Eğitim Grupları

Üniversite öğrencileri, lise öğrencileri ve profesyoneller için özel eğitim grupları mevcuttur.

## Teknoloji Grupları

Yazılım geliştiriciler, tasarımcılar ve teknoloji meraklıları için özel gruplar bulunmaktadır.

## Eğlence Grupları

Film, müzik, oyun ve spor gibi eğlence kategorilerinde binlerce grup sizi bekliyor.

## Nasıl Katılırım?

TGChannels üzerinden istediğiniz grubu bulun ve "Gruba Katıl" butonuna tıklayın.
    `.trim(),
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default function BlogPostPage({ params: { slug, locale } }: { params: { slug: string; locale: string } }) {
  const post = posts[slug];
  if (!post) notFound();

  const paragraphs = post.content.split('\n\n');

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href={`/${locale}/blog`} className="text-sm text-[#ff6b35] hover:underline mb-6 inline-block">
        ← Blog&apos;a Dön
      </Link>
      <article>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{post.date}</p>
        <div className="prose dark:prose-invert max-w-none space-y-4">
          {paragraphs.map((p, i) => {
            if (p.startsWith('## ')) {
              return (
                <h2 key={i} className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6">
                  {p.replace('## ', '')}
                </h2>
              );
            }
            return (
              <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {p}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}
