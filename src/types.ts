/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SneakerStatus {
  NEW_ARRIVALS = 'NEW_ARRIVALS',
  PROCESSING = 'PROCESSING',
  SOLD = 'SOLD'
}

export interface Sneaker {
  id: string;
  name: string;
  brand: string;
  size: string; // e.g. "10 US"
  price: number;
  sku: string; // Stock Keeping Unit / Item Code
  condition: string; // "Deadstock", "Like New", "Very Good", "Used"
  status: SneakerStatus;
  imageUrl: string;
  notes?: string;
  createdAt: string;
  soldAt?: string; // Optional timestamp for when it moved to SOLD
}

export interface KanbanColumn {
  id: SneakerStatus;
  title: string;
  color: string; // tailwind class name
  bgLight: string;
}
