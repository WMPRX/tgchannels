import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - TGChannels',
  description: 'Kişisel verileriniz nasıl korunuyor.',
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Gizlilik Politikası</h1>
      <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-card p-6 prose prose-gray dark:prose-invert max-w-none">
        <p>Kişisel verileriniz nasıl korunuyor.</p>
        <p>Bu sayfa yakında güncellenecektir.</p>
      </div>
    </div>
  );
}
