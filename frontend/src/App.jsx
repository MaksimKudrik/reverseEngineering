import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Electronics from'./pages/Electronics.jsx'
import ElectronicsDetail from './pages/ElectronicsDetail.jsx';
import Device from './pages/device.jsx'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/electronics" element={<Electronics />}/>
        <Route path="/electronics/:id" element={<ElectronicsDetail />}/>
        <Route path="/electronics/:type/:id" element={<Device />}/>
      </Routes>
    </BrowserRouter>
  
  )
}

export default App
