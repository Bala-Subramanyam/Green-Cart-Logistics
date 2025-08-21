import AppRoutes from "./routes/AppRoutes";
import useCheckAuth from './hooks/useCheckAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  useCheckAuth()
  return (
    <>
    <QueryClientProvider client={queryClient}>
    <AppRoutes/>
    </QueryClientProvider>
    </>
    
  )
}

export default App
