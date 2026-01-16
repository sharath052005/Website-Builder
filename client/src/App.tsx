
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import MyProjects from './pages/MyProjects'
import Projects from './pages/Projects'
import Preview from './pages/Preview'
import Community from './pages/Community'
import View from './pages/View'
import Navbar from './components/Navbar'

const App = () => {

  const { pathname } = useLocation()

  const hideNavbar = pathname.startsWith('/projects/') && pathname !== '/projects'
                     || pathname.startsWith('/view/')
                     || pathname.startsWith('/preview/')
  return (
    <div>
      {!(hideNavbar && <Navbar/>) }
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/pricing' element={<Pricing />}></Route>
        <Route path='/projects/:projectId' element={<Projects />}></Route>
        <Route path='/projects' element={<MyProjects />}></Route>
        <Route path='/preview/:projectId/:versionId' element={<Preview />}></Route>
        <Route path='/preview/:projectId' element={<Preview />}></Route>
        <Route path='/community' element={<Community />}></Route>
        <Route path='/view/:projectId' element={<View />}></Route>
      </Routes>
    </div>
  )
}

export default App