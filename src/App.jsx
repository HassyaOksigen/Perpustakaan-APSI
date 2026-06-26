import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/users/Catalog'; 
import BookDetail from './pages/users/BookDetail';
import BookAvailability from './pages/users/BookAvailability';
import LoanConfirmation from './pages/users/LoanConfirmation';
import MyLoans from './pages/users/MyLoans';
import RequestTracking from './pages/users/RequestTracking';
import InformationFine from './pages/users/InformationFine';
import LoanProcessing from './pages/admin/LoanProcessing';
import ReturnProcessing from './pages/admin/ReturnProcessing';
import FineManagement from './pages/admin/FineManagement';
import MemberManagement from './pages/admin/MemberManagement';
import EditMember from './pages/admin/EditMember';
import MemberDirectory from './pages/admin/MemberDirectory';
import CatalogAdmin from './pages/admin/CatalogAdmin';
import EditBook from './pages/admin/EditBook';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<Catalog />} /> 
        <Route path="/book-detail/:id" element={<BookDetail />} />
        <Route path="/book-availability" element={<BookAvailability />} />
        <Route path="/loan-confirmation" element={<LoanConfirmation />} />
        <Route path="/my-loans" element={<MyLoans />} />
        <Route path="/collections" element={<RequestTracking />} />
        <Route path="/information-fine" element={<InformationFine />} />
        <Route path="/admin" element={<LoanProcessing />} />
        <Route path="/return-processing" element={<ReturnProcessing />} />
        <Route path="/fine-management" element={<FineManagement />} />
        <Route path="/member-management" element={<MemberManagement />} />
        <Route path="/edit-member/:id" element={<EditMember />} />
        <Route path="/member-directory" element={<MemberDirectory />} />
        <Route path="/catalog-admin" element={<CatalogAdmin />} />
        <Route path="/edit-book/:id" element={<EditBook />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;