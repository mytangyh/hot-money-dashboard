import create from 'zustand';
import { fetchHotMoneyData } from '../utils/api';

const useHotMoneyStore = create((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchData: async (date) => {
    set({ loading: true });
    try {
      const data = await fetchHotMoneyData(date);
      console.log("useHotMoneyStore Using today's data $date");

      set({ data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  }
}));

export default useHotMoneyStore;