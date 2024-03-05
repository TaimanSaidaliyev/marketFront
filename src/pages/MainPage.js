
import { Icon, divIcon, point, L } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup  } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "../styles.css";
import "leaflet/dist/leaflet.css";
import { useFetching } from "../hooks/useFetching";
import { Products, Shop, Category } from "../api";
import { Rating } from "@smastrom/react-rating";
import { FaChevronLeft, FaCheckCircle } from "react-icons/fa";


const customIcon = new Icon({
    iconUrl: require("../icons/placeholder.png"),
    iconSize: [38, 38]
});

const customSelectedIcon = new Icon({
  iconUrl: require("../icons/placeholder.png"),
  iconSize: [50, 50],
});

const customPremiumIcon = new Icon({
    iconUrl: require("../icons/star.png"),
    iconSize: [42, 42]
});

const customSelectedPremiumIcon = new Icon({
  iconUrl: require("../icons/star.png"),
  iconSize: [55, 55],
});

const customIconPrice = (price) => divIcon({
  html: `<button class="bg-blue-500 hover:bg-blue-800 text-white text-base p-2 rounded-lg content-center w-[70px]">${price}т</button>`,
});

const customIconSelectedPrice = (price) => divIcon({
  html: `<button class="bg-white hover:bg-white text-black text-xl p-2 rounded-lg content-center w-[70px] border-2 border-blue-500">${price}т</button>`,
});


  // custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<button class="bg-blue-500 hover:bg-blue-800 text-white text-base p-2 rounded-lg content-center w-[70px]">${cluster.getChildCount()}</button>`,
  });
};


export const MainPage = () => {
    const [searchField, setSearchField] = useState('');
    const [shops, setShops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [selectedProduct, setSelectedProduct] = useState({});
    const [searchProducts, setSearchProducts] = useState([]);
    const [shopListPrice, setShopListPrice] = useState([]);
    const [searchEntered, setSearchEntered] = useState(false);
    const [shopsByProduct, isShopsByProductLoading, shopsByProductError] = useFetching(async () => {
      const response = await Shop.getShopByProductId(selectedProduct.id);
      if (response.data.shops.length > 0){
        setShopListPrice(response.data.shops);
      }
      else {
        setShopListPrice([]);
      }
    });
    
    const [shopsList, isLoading, error] = useFetching(async () => {
      const response = await Shop.getShopsAll();
      setShops(response.data.shops);
    });

    const [categoryList, isCategoryListLoading, CategoryListError] = useFetching(async () => {
      const response = await Category.getCategoriesList(searchField);
      setCategories(response.data.categories);
    });

    const [productsByCategory, isProductsByCategoryLoading, productsByCategoryError] = useFetching(async () => {
      const response = await Products.getProductsByCategory(selectedCategory.id);
      setProducts(response.data.list);
    });

    const [productsBySearch, isProductsBySearchLoading, productsBySearchError] = useFetching(async () => {
      const response = await Products.getProductsBySearch(searchField);
      setSearchProducts(response.data.list);
    });

    //0 - Главные категории, 1 - Список продуктов, 2 - Карточка продукта, 3 - Список Магазинов, 4 - Результаты поиска 
    const [cardState, setCardState] = useState(0);

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        productsBySearch();
        setCardState(4);
        setSearchEntered(true);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const handleMouseEnter = (index) => {
      const updatedShops = [...shops];
      updatedShops[index].focus = true;
      setShops(updatedShops);
    };

    const handleMouseLeave = (index) => {
      const updatedShops = [...shops];
      updatedShops[index].focus = false;
      setShops(updatedShops);
    };

    const handleMousePriceEnter = (index) => {
      const updatedShops = [...shopListPrice];
      updatedShops[index].focus = true;
      setShopListPrice(updatedShops);
    };

    const handleMousePriceLeave = (index) => {
      const updatedShops = [...shopListPrice];
      updatedShops[index].focus = false;
      setShopListPrice(updatedShops);
    };

    const backButton = () => {
      if(searchEntered){
        setCardState(0);
        setSearchEntered(false);
        setSearchField('');
      }
      else if(cardState == 2){
        setCardState(1);  
        setShopListPrice([]);
      }
      else if(cardState == 5){
        setCardState(0);  
        setShopListPrice([]);
      }
      else{
        setCardState(0);
        setShops([]);
        setSelectedProduct({});
        setProducts([]);
        setSelectedCategory(0);
      }
    }

    useEffect(()=>{
      categoryList();
    },[]);

    useEffect(()=>{
      if(selectedCategory != {}){
        productsByCategory();
      };
    },[selectedCategory]);

    useEffect(()=>{
      shopsByProduct();
    },[selectedProduct]);
    
    return (
      <div className="lg:grid grid-cols-[450px,1fr]">
        <div className="bg-white shadow-lg overflow-auto p-5">
          <div className="w-full h-[90vh]">
            {
              cardState == 0 &&
              <div className="justify-center mb-3">
                <p className="text-xl text-gray-500 font-bold">MarketPlace</p>
                <span className="text-md text-gray-500">Сервис поиска товаров</span>
              </div>
            }
            <form className="mx-auto" onSubmit={handleSubmit}>
              <div className={cardState != 0 ? "grid grid-cols-[40px,1fr] items-center" : "items-center"}>
                {
                  cardState != 0 &&
                  <div>
                    <p onClick={()=>backButton()}><FaChevronLeft size={24} className="text-gray-600 cursor-pointer"/></p>
                  </div>
                }
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                    </div>
                    <input 
                      type="search" 
                      id="default-search" 
                      className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      placeholder="Поиск" 
                      value={searchField}
                      onChange={(e)=>setSearchField(e.target.value)} 
                      onSubmit={handleSubmit}
                    />
                </div>
              </div>
              
            </form>
            <div className="grid gap-4 grid-cols-4 items-start mt-5 xl:grid-cols-4">
            {
              cardState == 0 &&
              <>
                {
                  categories.map((category) => (
                    <MainCategories category={category} setSelectedCategory={setSelectedCategory} setCardState={setCardState} key={category.id}/>
                  ))
                }
              </>
            }
            </div>
            {
              cardState == 0 &&
              <div className="bg-blue-500 hover:bg-blue-800 text-white text-base p-2 rounded-lg flex justify-center mt-5 cursor-pointer" onClick={()=>{setCardState(3); shopsList()}}>
                Показать все магазины
              </div>
            }
            {
              cardState == 1 &&
              <>
                <p className="text-lg font-semibold">Категория: {selectedCategory.title}</p>
                {
                  products.map((product, index) => (
                    <ProductCard product={product} setSelectedProduct={setSelectedProduct} setCardState={setCardState} key={product.id} shopsByProduct={shopsByProduct}/>
                  ))
                }
                {
                  products.length == 0 && 
                  <div className="w-full flex flex-col justify-center mt-10 items-center">
                      <img className="object-cover w-[150px] h-[150px]" src={'http://127.0.0.1:8000' + '/media/src/search.jpg'}/>
                      <p className="text-base"> По вашему запросу ничего не найдено</p>
                      <p className="text-base text-blue-500 cursor-pointer" onClick={backButton}>Вернуться на главную</p>
                  </div>
                }
              </>
              
            }
            {
              cardState == 2 &&
              <ProductSingleCard product={selectedProduct} shopListPrice={shopListPrice} handleMousePriceEnter={handleMousePriceEnter} handleMousePriceLeave={handleMousePriceLeave}/>
            }
            {
              cardState == 3 && shops.map((shop, index) => (
                <div 
                  className="w-full border border-b-1 border-l-0 border-r-0 border-t-0 py-5 hover:bg-gray-50" 
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  key={shop.id}
                >
                  <a className="text-lg font-semibold cursor-pointer" style={{color: '#0078A8'}} href={`/shop/${shop.id}`} target="_blank">{shop.title}</a>
                  <Rating
                      style={{ maxWidth: 80 }}
                      value={shop.rating}
                      isDisabled={true}
                      className="mt-1"
                  />
                  <p className="text-base mt-2">{shop.address}</p>
                  <p className="text-base text-gray-400 mt-2 line-clamp-2">{shop.description}</p>
                  <p className="text-base mt-2">{shop.phoneNumber}</p>
                  <a href={"/shop/" + shop.id} target="_blank">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                      Перейти в магазин
                    </button>
                  </a>
                </div>
              ))
            }
            {
              cardState == 4 && searchProducts.map((product)=>
              <ProductCard product={product} setSelectedProduct={setSelectedProduct} setCardState={setCardState} key={product.id} shopsByProduct={shopsByProduct}/>
              )
            }
          </div>
        </div>
        <div className="h-[100vh] w-full hidden lg:block lg:h-min">
          <MapContainer center={[51.131195, 71.420199]} zoom={12}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"        
            />
            {/* <MarkerClusterGroup
              chunkedLoading
              spiderfyDistanceMultiplier={2}
              iconCreateFunction={createClusterCustomIcon}
            > */}
              {
                shops.map((shop) => (
                  <Marker position={[shop.coordinate_w, shop.coordinate_h]} icon={shop.focus && shop.premium_status == 1 ? customSelectedPremiumIcon : !shop.focus && shop.premium_status == 1 ? customPremiumIcon : shop.focus ? customSelectedIcon : customIcon} key={shop.id} style={{color: '#ffffff'}}>
                    <Popup>
                      <div className="flex flex-col">
                        <div className="flex flex-row items-center">
                          <a className="text-lg font-semibold cursor-pointer" href={`/shop/${shop.id}`} target="_blank">{shop.title}</a>
                          {shop.premium_status == 1 && <FaCheckCircle color="green" className="ms-1 color-green-300" fontSize={16}/> }
                        </div>
                        
                        <span className="text-base font-medium text-blue-600">{shop.address}</span>
                        <hr className="my-3"/>
                        <span className="text-base font-medium">Режим работы: {shop.workTime}</span>
                        <span className="text-base font-medium">Телефон: {shop.phoneNumber}</span>                        
                        <a href={"/shop/" + shop.id} target="_blank">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                            Перейти в магазин
                          </button>
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))
              }
              {
                shopListPrice.map((shopPriceItem) => (
                  <Marker position={[shopPriceItem.shop.coordinate_w, shopPriceItem.shop.coordinate_h]} icon={shopPriceItem.focus ? customIconSelectedPrice(shopPriceItem.price) : customIconPrice(shopPriceItem.price)} key={shopPriceItem.id}>
                    <Popup>
                      <div className="flex flex-col">
                        <a className="text-lg font-semibold cursor-pointer" href={`/shop/${shopPriceItem.shop.id}`} target="_blank">{shopPriceItem.shop.title}</a>
                        <span className="text-base font-medium text-blue-600">{shopPriceItem.shop.address}</span>
                        <hr className="my-3"/>
                        <span className="text-base font-medium">Режим работы: {shopPriceItem.shop.workTime}</span>
                        <span className="text-base font-medium">Телефон: {shopPriceItem.shop.phoneNumber}</span>
                        <a href={"/shop/" + shopPriceItem.shop.id} target="_blank">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                            Перейти в магазин
                          </button>
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))
              }
            {/* </MarkerClusterGroup> */}
          </MapContainer>
        </div>
      </div>
    );
}

const ProductSingleCard = ({product, shopListPrice, handleMousePriceEnter, handleMousePriceLeave}) => {
  return (
    <>
      {product.photo && <img className="object-cover w-full h-[250px] border-1 rounded-md mb-3" src={'http://127.0.0.1:8000' + product.photo}/>}
      
      <a className="text-lg font-semibold cursor-pointer" style={{color: '#0078A8'}} href={`/product/${product.id}`} target="_blank">{product.title}</a>
      <p className="text-base mt-2">{product.category.title}</p>
      <p className="text-base text-gray-400 mt-1 line-clamp-5 mb-3">{product.description}</p>
      
      <a className="text-base font-semibold mt-2 text-gray-700" href={`/product/${product.id}`} target="_blank">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Перейти к товару
        </button>
      </a>
      <hr className="mt-3 mb-3"/>
      <span className="font-medium text-xl">Магазины с этим товаром</span>
      {
        shopListPrice.map((shop, index) => (
          <div 
            className="w-full border border-b-1 border-l-0 border-r-0 border-t-0 py-5 hover:bg-gray-50" 
            onMouseEnter={() => handleMousePriceEnter(index)}
            onMouseLeave={() => handleMousePriceLeave(index)}
            key={shop.id}
          >
            <div className="flex flex-row justify-between items-start">
              <div>
                <a className="text-lg font-semibold cursor-pointer" style={{color: '#0078A8'}} href={`/shop/${shop.shop.id}`} target="_blank">{shop.shop.title}</a>
                <Rating
                    style={{ maxWidth: 80 }}
                    value={shop.shop.rating}
                    isDisabled={true}
                    className="mt-1"
                />
              </div>
              <div className="flex flex-row items-center">
                
                  {shop.new_price > 0 && <span className="line-through text-gray-400 me-2">{shop.new_price}₸</span>}
                
                
                <div className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-min">
                  {shop.price}₸
                </div>
              </div>
              
            </div>
            
            <p className="text-base mt-2">{shop.shop.address}</p>
            <p className="text-base text-gray-400 mt-2 line-clamp-2">{shop.shop.description}</p>
            <p className="text-base mt-2">{shop.shop.phoneNumber}</p>
          </div>
        ))
      }
    </>
  );
}

const ProductCard = ({product, setSelectedProduct, setCardState, shopsByProduct}) => {
  return (
    <div 
      className="w-full border border-b-1 border-l-0 border-r-0 border-t-0 py-5 hover:bg-gray-50 cursor-pointer" 
      onClick={()=>{setSelectedProduct(product); setCardState(2); shopsByProduct();}}
      key={product.id}
    >
      <p className="text-lg font-semibold" style={{color: '#0078A8'}} >{product.title}</p>
      <p className="text-base mt-2">{product.category.title}</p>
      <p className="text-base text-gray-400 mt-2 line-clamp-2 mb-2">{product.description}</p>
      <div className="flex flex-row justify-end">
      {
        product.min_price 
        ?
        <button className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
          от {product.min_price}₸
        </button>
        :
        <button className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
          Нет в наличии
        </button>
      }
      </div>
    </div>
  )
};

const MainCategories = ({category, setSelectedCategory, setCardState}) => {
  return (
    <div className="flex flex-col justify-center items-center hover:cursor-pointer" onClick={()=>{setSelectedCategory(category); setCardState(1);}}>
      <div className="border w-[70px] h-[70px] rounded-full flex justify-center items-center text-center hover:bg-gray-100">
        <img src={'http://127.0.0.1:8000' + category.photo} className="w-[40px] h-[40px]"/>
      </div>
      <div className="flex justify-center items-center text-center">
        <span className="text-sm mt-2">{category.title}</span>
      </div>
    </div>
  );
};