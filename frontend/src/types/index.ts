export interface Member {
  id: number;
  name: string;
  joinDate: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  memberId: number;
  memberName: string;
  categoryId: number;
  categoryName: string;
  itemName: string;
  amount: number;
  purchaseDate: string;
  notes?: string;
}

export interface ExpenseFormValues {
  memberId: string;
  categoryId: string;
  itemName: string;
  amount: string;
  purchaseDate: string;
  notes?: string;
}

export interface MemberTotal {
  memberId: number;
  memberName: string;
  total: number;
}

export interface CategoryTotal {
  categoryId: number;
  categoryName: string;
  total: number;
  count: number;
}

export interface ExpenseSummary {
  totalAmount: number;
  averagePerMember: number;
  perMember: MemberTotal[];
  perCategory: CategoryTotal[];
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  errors?: Record<string, string>;
}

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
