import React, { useEffect, useState } from 'react';
import { Boxes, Plus, RefreshCcw, Search, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DashboardStats } from './components/DashboardStats';
import { SneakerCard } from './components/SneakerCard';
import { SneakerFormModal } from './components/SneakerFormModal';
import { KanbanColumn, Sneaker, SneakerStatus } from './types';

const STORAGE_KEY = 'sneaker_lanes_inventory_v3';

const START_SNEAKERS: Sneaker[] = [
  {
    id: 'sneaker-1',
    name: 'Air Jordan 1 High OG "Lost & Found"',
    brand: 'Jordan',
    size: '44',
    price: 450,
    sku: 'DZ5485-612',
    condition: 'Deadstock',
    status: SneakerStatus.NEW_ARRIVALS,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_20547cf0-313d-492e-841b-19bc12ed1281_3840x.jpg?=75&v=1717156718',
    notes: 'Real 2022 release, Chicago colorway.',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'sneaker-2',
    name: 'adidas Yeezy Boost 350 V2 "Zebra"',
    brand: 'adidas',
    size: '43',
    price: 340,
    sku: 'CP9654',
    condition: 'Like New',
    status: SneakerStatus.PROCESSING,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_4eec2627-0772-4ac4-9387-c7f3d688dc7b_1920x.png?=75&v=1706615044',
    notes: 'Real Yeezy 350 V2 Zebra.',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'sneaker-3',
    name: 'New Balance 990v5 "Grey Castlerock"',
    brand: 'New Balance',
    size: '45',
    price: 210,
    sku: 'M990GL5',
    condition: 'Deadstock',
    status: SneakerStatus.NEW_ARRIVALS,
    imageUrl: 'https://nb.scene7.com/is/image/NB/m990gl5_nb_02_i?wid=700&hei=500&fmt=webp',
    notes: 'Real Made in USA 990v5.',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'sneaker-4',
    name: 'Nike Dunk Low "Panda Black White"',
    brand: 'Nike',
    size: '44',
    price: 140,
    sku: 'DD1391-100',
    condition: 'Very Good',
    status: SneakerStatus.PROCESSING,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_192c7990-55c2-4b16-880f-7935c8eb1ef6_3840x.jpg?=75&v=1772245888',
    notes: 'Real Dunk Low Panda.',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'sneaker-5',
    name: 'Air Jordan 1 Low OG x Travis Scott "Reverse Mocha"',
    brand: 'Jordan',
    size: '44',
    price: 1150,
    sku: 'DM7866-162',
    condition: 'Deadstock',
    status: SneakerStatus.SOLD,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_96eedf7f-248d-418b-bd74-167c8e25681c_3840x.jpg?=75&v=1708354662',
    notes: 'Real Travis Scott AJ1 Low.',
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    soldAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  }
];

const COLUMNS: KanbanColumn[] = [
  {
    id: SneakerStatus.NEW_ARRIVALS,
    title: 'New',
    color: 'border-blue-300 text-blue-700',
    bgLight: 'bg-blue-50'
  },
  {
    id: SneakerStatus.PROCESSING,
    title: 'In Progress',
    color: 'border-yellow-300 text-yellow-700',
    bgLight: 'bg-yellow-50'
  },
  {
    id: SneakerStatus.SOLD,
    title: 'Sold',
    color: 'border-green-300 text-green-700',
    bgLight: 'bg-green-50'
  }
];

export default function App() {
  const [sneakers, setSneakers] = useState<Sneaker[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return START_SNEAKERS;

    try {
      return JSON.parse(saved);
    } catch {
      return START_SNEAKERS;
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-desc' | 'price-asc'>('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSneaker, setEditingSneaker] = useState<Sneaker | null>(null);
  const [activeMobileColumn, setActiveMobileColumn] = useState<SneakerStatus>(SneakerStatus.NEW_ARRIVALS);
  const [dragHoveredColumn, setDragHoveredColumn] = useState<SneakerStatus | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sneakers));
  }, [sneakers]);

  const allBrands = Array.from(new Set<string>(sneakers.map((s) => s.brand))).sort();
  const allSizes = Array.from(new Set<string>(sneakers.map((s) => s.size))).sort((a, b) => {
    const numA = parseFloat(a.replace(/[^\d.]/g, '')) || 0;
    const numB = parseFloat(b.replace(/[^\d.]/g, '')) || 0;
    return numA - numB;
  });

  const handleResetToDefaults = () => {
    if (!window.confirm('Reset the board to the starter list? All changes will be lost.')) return;

    setSneakers(START_SNEAKERS);
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedSize('All');
    setSortBy('newest');
  };

  const handleAddNew = (sneakerData: Omit<Sneaker, 'id' | 'createdAt'>) => {
    const newSneaker: Sneaker = {
      ...sneakerData,
      id: `sneaker-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...(sneakerData.status === SneakerStatus.SOLD ? { soldAt: new Date().toISOString() } : {})
    };

    setSneakers((prev) => [newSneaker, ...prev]);
  };

  const handleEditSave = (sneakerData: Omit<Sneaker, 'id' | 'createdAt'>) => {
    if (!editingSneaker) return;

    setSneakers((prev) => prev.map((item) => {
      if (item.id !== editingSneaker.id) return item;

      return {
        ...item,
        ...sneakerData,
        soldAt: sneakerData.status === SneakerStatus.SOLD
          ? item.soldAt || new Date().toISOString()
          : undefined
      };
    }));
    setEditingSneaker(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this pair?')) {
      setSneakers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleMoveStatus = (id: string, newStatus: SneakerStatus) => {
    setSneakers((prev) => prev.map((s) => {
      if (s.id !== id) return s;

      return {
        ...s,
        status: newStatus,
        soldAt: newStatus === SneakerStatus.SOLD ? new Date().toISOString() : undefined
      };
    }));
  };

  const handleDragOver = (e: React.DragEvent, columnId: SneakerStatus) => {
    e.preventDefault();
    setDragHoveredColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent, columnId: SneakerStatus) => {
    e.preventDefault();
    setDragHoveredColumn(null);

    const sneakerId = e.dataTransfer.getData('text/plain');
    if (sneakerId) handleMoveStatus(sneakerId, columnId);
  };

  const filteredSneakers = sneakers.filter((s) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(query) ||
      s.brand.toLowerCase().includes(query) ||
      s.sku.toLowerCase().includes(query);

    return matchesSearch &&
      (selectedBrand === 'All' || s.brand === selectedBrand) &&
      (selectedSize === 'All' || s.size === selectedSize);
  });

  const sortedSneakers = [...filteredSneakers].sort((a, b) => {
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'price-asc') return a.price - b.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getColTotals = (status: SneakerStatus) => {
    const colItems = sortedSneakers.filter((s) => s.status === status);
    return {
      count: colItems.length,
      value: colItems.reduce((sum, item) => sum + item.price, 0)
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <header className="border-b border-gray-300 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-800 rounded-md flex items-center justify-center text-white font-bold text-sm">
              KC
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Kanban</h1>
              <p className="text-gray-500 text-xs">Sneaker resale inventory</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleResetToDefaults}
              className="px-3.5 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              title="Reset list"
              id="reset-catalog-btn"
            >
              <RefreshCcw size={13} />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              onClick={() => {
                setEditingSneaker(null);
                setIsModalOpen(true);
              }}
              className="flex-grow sm:flex-grow-0 px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-1.5"
              id="create-sneaker-btn"
            >
              <Plus size={15} />
              <span>Add pair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        <DashboardStats sneakers={sneakers} />

        <div className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <SlidersHorizontal size={14} className="text-blue-600" />
              <span>Filters</span>
            </div>
            {sneakers.length !== filteredSneakers.length && (
              <span className="text-[10px] text-blue-700 bg-blue-50 px-2.5 py-0.5 border border-blue-100 rounded">
                Found: {filteredSneakers.length} of {sneakers.length}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Model, brand, or SKU"
                className="w-full bg-gray-50 border border-gray-300 rounded-md pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
                id="search-input"
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-600 transition-colors"
              id="brand-filter-select"
            >
              <option value="All">All brands</option>
              {allBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-600 transition-colors"
              id="size-filter-select"
            >
              <option value="All">All sizes</option>
              {allSizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-600 transition-colors"
              id="sort-select"
            >
              <option value="newest">Newest first</option>
              <option value="price-desc">Price high to low</option>
              <option value="price-asc">Price low to high</option>
            </select>
          </div>
        </div>

        <div className="flex md:hidden bg-gray-200 p-1 rounded-lg border border-gray-300">
          {COLUMNS.map((col) => {
            const { count } = getColTotals(col.id);
            const isActive = activeMobileColumn === col.id;

            return (
              <button
                key={col.id}
                onClick={() => setActiveMobileColumn(col.id)}
                className={`flex-1 py-2.5 text-center rounded-md text-xs font-medium transition-all relative ${
                  isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileTabGlow"
                    className="absolute inset-0 bg-white border border-gray-300 rounded-md"
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <span>{col.title}</span>
                  <span className={`text-[10px] px-1 rounded ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="kanban-workspace-board">
          {COLUMNS.map((column) => {
            const columnSneakers = sortedSneakers.filter((s) => s.status === column.id);
            const { count, value } = getColTotals(column.id);
            const isHovered = dragHoveredColumn === column.id;
            const isVisibleOnMobile = activeMobileColumn === column.id;
            const formattedTotalValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(value);

            return (
              <div
                key={column.id}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragEnter={(e) => handleDragOver(e, column.id)}
                onDragLeave={() => setDragHoveredColumn(null)}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`flex flex-col bg-gray-50 border rounded-lg p-4 min-h-[500px] transition-colors ${
                  isHovered ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } ${isVisibleOnMobile ? 'flex' : 'hidden md:flex'}`}
                id={`kanban-column-${column.id}`}
              >
                <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-3" id={`column-header-${column.id}`}>
                  <div>
                    <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        column.id === SneakerStatus.NEW_ARRIVALS ? 'bg-blue-500' :
                        column.id === SneakerStatus.PROCESSING ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span>{column.title}</span>
                    </h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">{count} pairs</p>
                  </div>

                  <span className="bg-white text-[10px] text-gray-700 px-2 py-0.5 rounded border border-gray-300">
                    {formattedTotalValue}
                  </span>
                </div>

                {isHovered && (
                  <div className="mb-4 border-2 border-dashed border-blue-300 rounded-md py-4 text-center text-xs text-blue-700 bg-blue-50">
                    Drop here
                  </div>
                )}

                <div className="flex-grow space-y-4 overflow-y-auto max-h-[800px] pr-1 pb-4">
                  <AnimatePresence mode="popLayout">
                    {columnSneakers.length > 0 ? (
                      columnSneakers.map((sneaker) => (
                        <SneakerCard
                          key={sneaker.id}
                          sneaker={sneaker}
                          onEdit={(s) => {
                            setEditingSneaker(s);
                            setIsModalOpen(true);
                          }}
                          onDelete={handleDelete}
                          onMoveStatus={handleMoveStatus}
                        />
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-300 bg-white rounded-lg"
                      >
                        <Boxes size={24} className="mb-1.5 opacity-50 text-gray-400" />
                        <span className="text-xs font-medium">Empty</span>
                        <span className="text-[10px] opacity-70 mt-1">Add a pair or drag one here</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-gray-300 bg-white text-xs py-5 text-gray-500 text-center mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px]">Kanban, 2026</p>
          <div className="flex items-center gap-4 text-[10px]">
            <span>Data is saved in this browser</span>
            <span className="text-gray-300">|</span>
            <span>Local board</span>
          </div>
        </div>
      </footer>

      <SneakerFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSneaker(null);
        }}
        onSubmit={editingSneaker ? handleEditSave : handleAddNew}
        sneaker={editingSneaker}
      />
    </div>
  );
}
