export const PRODUCT_CREATED = 'product.created';
export const PRODUCT_DELETED = 'product.deleted';
export const NOTIFICATIONS_QUEUE = 'notifications';

export interface ProductCreatedEvent {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface ProductDeletedEvent {
  id: string;
  name: string;
}
