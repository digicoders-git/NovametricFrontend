import React from 'react'
import { BrowserRouter as Router,Routes,Route, } from 'react-router-dom'
import Registration from './Registration'
import MainPage from './Components/MainPage'
import PublicSurveyGuard from './PublicSurveyGuard'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path="/survey/:id" element={<PublicSurveyGuard />} />

      </Routes>
    </Router>
  )
}

export default App