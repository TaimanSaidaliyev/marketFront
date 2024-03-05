import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MainPage } from "./pages/MainPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/shop/:id/" element={<ShopPage/>}/>
        <Route path="/product/:id/" element={<ProductPage/>}/>
      </Routes>
    </BrowserRouter>
    );
}
