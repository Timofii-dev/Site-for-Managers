import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Sneaker, SneakerStatus } from '../types';

interface SneakerCardProps {
  sneaker: Sneaker;
  onEdit: (sneaker: Sneaker) => void;
  onDelete: (id: string) => void;
  onMoveStatus: (id: string, newStatus: SneakerStatus) => void;
}

export const SneakerCard: React.FC<SneakerCardProps> = ({
  sneaker,
  onEdit,
  onDelete,
  onMoveStatus
}) => {
  const [imgError, setImgError] = useState(false);

  const canMoveLeft = sneaker.status !== SneakerStatus.NEW_ARRIVALS;
  const canMoveRight = sneaker.status !== SneakerStatus.SOLD;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(sneaker.price);

  const getPreviousStatus = (status: SneakerStatus): SneakerStatus => {
    if (status === SneakerStatus.SOLD) return SneakerStatus.PROCESSING;
    return SneakerStatus.NEW_ARRIVALS;
  };

  const getNextStatus = (status: SneakerStatus): SneakerStatus => {
    if (status === SneakerStatus.NEW_ARRIVALS) return SneakerStatus.PROCESSING;
    return SneakerStatus.SOLD;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', sneaker.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.div
      id={`sneaker-card-${sneaker.id}`}
      layoutId={sneaker.id}
      draggable
      onDragStart={handleDragStart}
      className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors cursor-grab active:cursor-grabbing"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-100 border-b border-gray-200">
        {!imgError ? (
          <img
            src={sneaker.imageUrl}
            alt={sneaker.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-gray-500">
            No photo
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">{sneaker.brand}</p>
            <h3 className="font-bold text-sm text-gray-900 line-clamp-2 min-h-[40px]">
              {sneaker.name}
            </h3>
          </div>
          <span className="shrink-0 text-sm font-bold text-gray-900">{formattedPrice}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="block text-gray-500">Size</span>
            <span className="font-medium text-gray-900">{sneaker.size}</span>
          </div>
          <div>
            <span className="block text-gray-500">Condition</span>
            <span className="font-medium text-gray-900">{sneaker.condition}</span>
          </div>
          <div>
            <span className="block text-gray-500">SKU</span>
            <span className="font-medium text-gray-900 truncate block" title={sneaker.sku}>{sneaker.sku || '-'}</span>
          </div>
        </div>

        {sneaker.notes && (
          <p className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-md p-2 border border-gray-200 line-clamp-2">
            {sneaker.notes}
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(sneaker)}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Edit"
              id={`edit-btn-${sneaker.id}`}
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => onDelete(sneaker.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
              id={`delete-btn-${sneaker.id}`}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {canMoveLeft && (
              <button
                onClick={() => onMoveStatus(sneaker.id, getPreviousStatus(sneaker.status))}
                className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Move back"
                id={`move-left-${sneaker.id}`}
              >
                <ArrowLeft size={14} />
              </button>
            )}
            {canMoveRight && (
              <button
                onClick={() => onMoveStatus(sneaker.id, getNextStatus(sneaker.status))}
                className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Move forward"
                id={`move-right-${sneaker.id}`}
              >
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
