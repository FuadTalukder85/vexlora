export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  isHot?: boolean;
}

export interface CategoryQuickLink {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  itemCount?: number;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
}
