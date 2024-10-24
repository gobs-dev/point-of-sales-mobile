export interface ProductDto {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  imageUrl?: string;
  sku: string;
}