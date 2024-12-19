export interface HotMoneyData {
  date: string;
  items: Array<{
    code: string;
    name: string;
    amount: number;
    percentage: number;
  }>;
}
