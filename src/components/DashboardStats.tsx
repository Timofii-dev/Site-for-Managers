import React from 'react';
import { BarChart3, DollarSign, PackageCheck, ShoppingBag } from 'lucide-react';
import { Sneaker, SneakerStatus } from '../types';

interface DashboardStatsProps {
  sneakers: Sneaker[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ sneakers }) => {
  const totalCount = sneakers.length;
  const inStockSneakers = sneakers.filter((s) => s.status !== SneakerStatus.SOLD);
  const totalStockValue = inStockSneakers.reduce((sum, s) => sum + s.price, 0);
  const soldSneakers = sneakers.filter((s) => s.status === SneakerStatus.SOLD);
  const totalSalesRevenue = soldSneakers.reduce((sum, s) => sum + s.price, 0);
  const averagePrice = totalCount > 0
    ? Math.round(sneakers.reduce((sum, s) => sum + s.price, 0) / totalCount)
    : 0;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);

  const stats = [
    {
      label: 'Total pairs',
      value: totalCount,
      note: 'including sold pairs',
      icon: ShoppingBag
    },
    {
      label: 'In stock',
      value: formatCurrency(totalStockValue),
      note: `${inStockSneakers.length} active`,
      icon: PackageCheck
    },
    {
      label: 'Sales',
      value: formatCurrency(totalSalesRevenue),
      note: `${soldSneakers.length} sold`,
      icon: DollarSign
    },
    {
      label: 'Average price',
      value: formatCurrency(averagePrice),
      note: 'across all pairs',
      icon: BarChart3,
      wide: true
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4" id="dashboard-statistics">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={`bg-white border border-gray-300 rounded-lg p-4 ${stat.wide ? 'col-span-2 lg:col-span-2' : ''}`}
          >
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <span>{stat.label}</span>
              <Icon size={17} />
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-[11px] text-gray-500 mt-1">{stat.note}</p>
          </div>
        );
      })}
    </div>
  );
};
