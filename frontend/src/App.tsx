import AppRoutes from "./routes/AppRoutes";
import useCheckAuth from './hooks/useCheckAuth'

function App() {
  useCheckAuth()
  return (
    <>
    <AppRoutes/>
    </>
    
  )
}

export default App
