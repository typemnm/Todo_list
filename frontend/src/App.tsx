import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './pages/Dashboard';
import { List } from './pages/List';
import { Settings } from './pages/Settings';
import { AddTodo } from './pages/AddTodo';

const ONE_MINUTE_MS = 1000 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE_MS,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/list" element={<List />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add" element={<AddTodo />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
