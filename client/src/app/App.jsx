import { Outlet } from "react-router"
import ScrollToTop from '../components/common/ScrollToTop.jsx'
const App = () => {
  return <>
  <ScrollToTop/>
  <Outlet/>
  </>
}

export default App
