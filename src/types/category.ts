export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  image?: string | null;
  children?: Category[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
