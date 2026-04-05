import { Users, LayoutGrid, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface Stats {
  totalGroups: number;
  pendingGroups: number;
  approvedGroups: number;
  totalUsers: number;
  totalReports: number;
  pendingReports: number;
}

export default function Dashboard({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'Toplam Grup', value: stats.totalGroups, icon: LayoutGrid, color: 'bg-blue-500' },
    { label: 'Onay Bekleyen', value: stats.pendingGroups, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Onaylandı', value: stats.approvedGroups, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: Users, color: 'bg-purple-500' },
    { label: 'Toplam Rapor', value: stats.totalReports, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Bekleyen Rapor', value: stats.pendingReports, icon: TrendingUp, color: 'bg-[#ff6b35]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white dark:bg-[#16213e] rounded-2xl p-5 shadow-card">
          <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
            <card.icon size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value.toLocaleString('tr-TR')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
