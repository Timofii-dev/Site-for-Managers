import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Sneaker, SneakerStatus } from '../types';

interface SneakerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sneakerData: Omit<Sneaker, 'id' | 'createdAt'>) => void;
  sneaker?: Sneaker | null;
}

const BRAND_PRESETS = ['Nike', 'Jordan', 'Adidas', 'Yeezy', 'New Balance', 'Asics', 'Puma', 'Converse', 'Reebok', 'Other'];
const CONDITION_PRESETS = ['Deadstock', 'Like New', 'Very Good', 'Used'];
const SIZE_PRESETS = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];

const DEFAULT_PHOTO_URL = 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_20547cf0-313d-492e-841b-19bc12ed1281_3840x.jpg?=75&v=1717156718';

export const SneakerFormModal: React.FC<SneakerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  sneaker
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Nike');
  const [customBrand, setCustomBrand] = useState('');
  const [size, setSize] = useState('42');
  const [customSize, setCustomSize] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [condition, setCondition] = useState('Deadstock');
  const [status, setStatus] = useState<SneakerStatus>(SneakerStatus.NEW_ARRIVALS);
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sneaker) {
      setName(sneaker.name);
      setBrand(BRAND_PRESETS.includes(sneaker.brand) ? sneaker.brand : 'Other');
      setCustomBrand(BRAND_PRESETS.includes(sneaker.brand) ? '' : sneaker.brand);
      setSize(SIZE_PRESETS.includes(sneaker.size) ? sneaker.size : 'Other');
      setCustomSize(SIZE_PRESETS.includes(sneaker.size) ? '' : sneaker.size);
      setPrice(sneaker.price.toString());
      setSku(sneaker.sku);
      setCondition(sneaker.condition);
      setStatus(sneaker.status);
      setImageUrl(sneaker.imageUrl);
      setNotes(sneaker.notes || '');
    } else {
      setName('');
      setBrand('Nike');
      setCustomBrand('');
      setSize('42');
      setCustomSize('');
      setPrice('');
      setSku('');
      setCondition('Deadstock');
      setStatus(SneakerStatus.NEW_ARRIVALS);
      setImageUrl('');
      setNotes('');
    }
    setError('');
  }, [sneaker, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Enter the model name');
      return;
    }

    const finalBrand = brand === 'Other' ? customBrand.trim() : brand;
    if (!finalBrand) {
      setError('Enter the brand');
      return;
    }

    const finalSize = size === 'Other' ? customSize.trim() : size;
    if (!finalSize) {
      setError('Enter the size');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    onSubmit({
      name: name.trim(),
      brand: finalBrand,
      size: finalSize,
      price: parsedPrice,
      sku: sku.trim().toUpperCase(),
      condition,
      status,
      imageUrl: imageUrl.trim() || DEFAULT_PHOTO_URL,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 overflow-y-auto">
      <div
        id="sneaker-modal-body"
        className="relative bg-white border border-gray-300 rounded-lg w-full max-w-2xl my-8 overflow-hidden shadow-xl text-gray-900"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">
            {sneaker ? 'Edit pair' : 'Add pair'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Model *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Example: Air Jordan 1 Retro High OG "Chicago"'
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Brand *</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
              >
                {BRAND_PRESETS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              {brand === 'Other' && (
                <input
                  type="text"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="Custom brand"
                  className="mt-2 w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              )}
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="DZ5485-612"
                className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Size *</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
              >
                {SIZE_PRESETS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="Other">Other</option>
              </select>

              {size === 'Other' && (
                <input
                  type="text"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="42.5"
                  className="mt-2 w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              )}
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Price, $ *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="350"
                min="1"
                className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
              >
                {CONDITION_PRESETS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: SneakerStatus.NEW_ARRIVALS, label: 'New' },
                { id: SneakerStatus.PROCESSING, label: 'In Progress' },
                { id: SneakerStatus.SOLD, label: 'Sold' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                    status === s.id
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Photo</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Photo URL"
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Box, condition, shipping, or checks to make"
              className="w-full min-h-[80px] bg-gray-50 border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>

          <div className="border-t border-gray-200 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              id="submit-sneaker-form"
            >
              {sneaker ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
