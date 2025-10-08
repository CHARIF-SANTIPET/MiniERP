import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import StockListPage from "./pages/StockListPage";
import AddProductPage from "./pages/AddProductPage";
import UpdateProductPage from "./pages/UpdateProductPage"
import StockLogPage from "./pages/StockLogPage";

// import DashboardPage from "./pages/DashboardPage"; // สมมติมีหน้า Dashboard
import './App.css'

function App() {
  return (
    // <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                 <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stocklist"
            element={
              <ProtectedRoute>
                 <MainLayout>
                  <StockListPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/addproduct"
            element={
              <ProtectedRoute>
                 <MainLayout>
                  <AddProductPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/edit/:id"
            element={
              <ProtectedRoute>
                 <MainLayout>
                  <UpdateProductPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stocklog"
            element={
              <ProtectedRoute>
                 <MainLayout>
                  <StockLogPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          

          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    // </UserProvider>
  );
}

export default App;
