import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { Outlet } from 'react-router-dom'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />
        <Outlet />
      <Footer />
    </>
  )
}

export default App
