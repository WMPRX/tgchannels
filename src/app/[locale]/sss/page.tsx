import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular - TGChannels',
  description: 'Sık sorulan sorular.',
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Sıkça Sorulan Sorular</h1>
      <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-card p-6 prose prose-gray dark:prose-invert max-w-none">
        <p>Sık sorulan sorular.</p>
        <p>Bu sayfa yakında güncellenecektir.</p>
      </div>
    </div>
  );
}
