import { useEffect } from 'react'
import AppRouter from './routes/AppRouter'
import { useAuthViewModel } from './viewmodels/AuthViewModel'

function App() {
  const { loadCurrentUser } =
    useAuthViewModel()

  useEffect(() => {
    void loadCurrentUser()
  }, [])

  return <AppRouter />
}

export default App