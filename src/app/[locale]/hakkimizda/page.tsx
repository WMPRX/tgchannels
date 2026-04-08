import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkımızda - TGChannels',
  description: 'TGChannels hakkında bilgi edinin.',
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Hakkımızda</h1>
      <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-card p-6 prose prose-gray dark:prose-invert max-w-none">
        <p>TGChannels hakkında bilgi edinin.</p>
        <p>Bu sayfa yakında güncellenecektir.</p>
      </div>
    </div>
  );
}
