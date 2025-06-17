import "tailwindcss";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Blog from "./components/Blog";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Getstarted from "./components/Getstarted";
import WriteBlog from "./components/WriteBlog";
import Yourblog from "./components/Yourblog";
import ClickedBlog from "./components/ClickedBlog";

function App() {
  const PrivateRoutes = () => {
    const auth = localStorage.getItem("token");
    return auth ? <Outlet /> : <Navigate to="/signin" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Getstarted />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/blog" element={<Blog />} />
          <Route path="/write-blog" element={<WriteBlog />} />
          <Route path="/your-blog/:id" element={<Yourblog />} />
          <Route path="/clickedBlog/:id" element={<ClickedBlog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
