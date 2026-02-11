import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Electronics from'./pages/Electronics.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/electronics" element={<Electronics />}/>
      </Routes>
    </BrowserRouter>
  
  )
}

export default App
