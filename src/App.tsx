import User from "./User";
import { Toaster } from "react-hot-toast";
import Admin from "./Admin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Vendor from "./Vendor";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/user/*" index element={<User/>} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/vendor/*" element={<Vendor/>}/>

        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
