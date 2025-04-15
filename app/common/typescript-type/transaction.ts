export type Category = 'Expense' | 'Savings' | 'Investment';
export interface Transaction {
    id: number;
    type: string;
    category: Category;
    amount: number;
};

