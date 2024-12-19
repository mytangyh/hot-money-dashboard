import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { fetchHotMoneyData } from './utils/api';

jest.mock('./utils/api');

describe('App Component', () => {
  it('should render loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/加载中/i)).toBeInTheDocument();
  });

  it('should render data when API call succeeds', async () => {
    const mockData = {/* ... */};
    fetchHotMoneyData.mockResolvedValueOnce(mockData);
    
    render(<App />);
    await waitFor(() => {
      expect(screen.queryByText(/加载中/i)).not.toBeInTheDocument();
    });
  });
});
