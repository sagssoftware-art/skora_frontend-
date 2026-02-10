import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Verifier from './pages/Verifier/Verifier'
import NotFound from './pages/Errors/404';
import Dashboard from './pages/Dashboard/Dashboard';
import Interface from './pages/SnapQuiz/Interface';
import SKOPRO from './pages/SKOPRO/SKOPRO';
import MyClass from './pages/MyClass/MyClass';
import ClassTeacher from './pages/ClassTeacher/ClassTeacher';
import Classroom from './pages/Dashboard/component/TeacherComponent/Classsroom';
import StudyBox from './pages/StudyBox/StudyBox';
import UpdateReports from './pages/Update Reports/UpdateReports';
import ReportView from './pages/ReportView/ReportView';
import AddAssignment from './pages/addAssignment/addAssignment';
import ViewAssignment from './pages/viewAssignment/viewAssignment';

const App = () => {
  return (
    <>
    <Routes>
      {['/', '/login', '/register', '/verify', '/dashboard'].map(path => (
        <Route key={path} path={path} element={<Home />} />
      ))}
      <Route path='/login/:type' element={<Login />} />
      <Route path='/register/:type' element={<Register />} />
      <Route path='/verify/:type' element={<Verifier />} />
      <Route path='/dashboard/:type' element={<Dashboard />} />
      <Route path="/classroom/:classId" element={<Classroom />} />
      <Route path="/updateReports/:classId" element={<UpdateReports />} />
      <Route path="/addAssignment/:classId" element={<AddAssignment />} />
      <Route path='/skopro' element={<SKOPRO />} />
      <Route path='/studybox' element={<StudyBox />} />
      <Route path='/myclass' element={<MyClass />} />
      <Route path="/classTeacher/:classId" element={<ClassTeacher />} />
      <Route path='/snapquiz' element={<Interface />} />
      <Route path='/reportcard' element={<ReportView />} />
      <Route path='/assignments' element={<ViewAssignment />} />
      <Route path='/*' element={<NotFound />} />
    </Routes>
    </>
  )
}

export default App;