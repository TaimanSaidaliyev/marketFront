import { Link, useParams } from "react-router-dom";
import { Header } from "../blocks/Header";
import { Shop, Products } from "../api";
import { useFetching } from "../hooks/useFetching";
import { useEffect, useState } from "react";
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";

const customIcon = new Icon({
    iconUrl: require("../icons/placeholder.png"),
    iconSize: [38, 38] // size of the icon
  });
  
  // custom cluster icon
const createClusterCustomIcon = function (cluster) {
    return new divIcon({
        html: `<button class="bg-blue-500 hover:bg-blue-800 text-white text-base p-2 rounded-lg content-center w-[70px]">${cluster.getChildCount()}</button>`,
    });
};


const customIconPrice = (price) => divIcon({
    html: `<button class="bg-blue-500 hover:bg-blue-800 text-white text-base p-2 rounded-lg content-center w-[70px]">${price}т</button>`,
  });
  
  const customIconSelectedPrice = (price) => divIcon({
    html: `<button class="bg-white hover:bg-white text-black text-xl p-2 rounded-lg content-center w-[70px] border-2 border-blue-500">${price}т</button>`,
  });


export const ProductPage = () => {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [shopListPrice, setShopListPrice] = useState([]);

    const [productInfomation, isProductInfomationLoading, isProductInfomationError] = useFetching(async () => {
        const response = await Products.getProductDetail(params.id);
        setProduct(response.data.product);
    });

  
    const [shopsByProduct, isShopsByProductLoading, shopsByProductError] = useFetching(async () => {
        const response = await Shop.getShopByProductId(params.id);
        if (response.data.shops.length > 0){
          setShopListPrice(response.data.shops);
        }
        else {
          setShopListPrice([]);
        }
      });

    useEffect(()=>{
        productInfomation();
        shopsByProduct();
    },[])

    useEffect(()=>{
        productInfomation();
    },[params]);

    return (
        <>
            <Header/>
            <div className="flex w-full justify-center">
                <div className="">
                    <div className="container border p-10 m-4 rounded-xl max-w-[960px] bg-white w-screen">
                        <div className="grid md:grid-cols-[500px,1fr] gap-3">
                            {
                                product.photo &&
                                <img className="object-cover h-[300px] w-[500px]  border-1 rounded-md" src={'http://127.0.0.1:8000' + product.photo}/>
                            }
                            <div>
                                <div>
                                    <span className="font-medium text-xl">{product.title}</span>
                                </div>
                                <div className="py-1">
                                    <span className="font-sans text-base text-gray-500">{product.phoneNumber}</span>
                                </div>
                                <Rating
                                    style={{ maxWidth: 100 }}
                                    value={4}
                                    isDisabled={true}
                                />
                            </div>
                        </div>
                        <div className="pt-5">
                            <p className="pb-2 font-semibold">Описание</p>
                            <span className="font-sans text-base text-gray-500">{product.description}</span>
                        </div>
                        <div className="w-full h-[350px]">
                            <div className="pt-5">
                                <p className="pb-2 font-semibold">Местоположение</p>
                            </div>
                            <MapContainer center={[51.131186, 71.420188]} zoom={12} style={{height: 300}} className="rounded-md">
                                <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"        
                                />
                                <MarkerClusterGroup
                                    chunkedLoading
                                    spiderfyDistanceMultiplier={2}
                                    iconCreateFunction={createClusterCustomIcon}
                                    >
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
                                            </div>
                                            </Popup>
                                        </Marker>
                                        ))
                                    }
                                </MarkerClusterGroup>
                            </MapContainer>
                        </div>
                    </div>
                    <div className="container border p-10 m-4 rounded-xl w-full max-w-[960px] bg-white">
                        <div className="w-full">
                            <div>
                                <span className="font-medium text-xl">Список товаров магазина</span>
                            </div>
                            <div className="w-full">
                                {
                                    shopListPrice.map((shop)=>
                                        <ShopCard shop={shop} key={product.id}/>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const ShopCard = ({shop}) => {
    return (
        <div className="flex flex-row justify-center items-center py-3 border border-b-1 border-l-0 border-r-0 border-t-0">
            <div className="basis-4/6 flex flex-row items-center">
                <div className="w-[80px]">
                    <img className="object-cover border-1 rounded-md" style={{ height: 70, width: 70}} src={'http://127.0.0.1:8000' + `${shop.shop.photo}`}/>
                </div>
                <div>
                    <p className="font-sans text-md">{shop.shop.title}</p>
                    <Rating
                        style={{ maxWidth: 100 }}
                        value={shop.shop.rating}
                        isDisabled={true}
                    />
                </div>
                
            </div>
            <div className="basis-1/6 flex justify-center items-center">
                <div>
                    {shop.new_price > 0 && <span className="line-through text-gray-400 me-2">{shop.new_price}₸</span>}
                    <p className="font-sans text-xl text-gray-500 font-semibold">{shop.price}₸</p>
                </div>
                
            </div>
            <div className="basis-1/6 flex justify-center items-center">
                <Link to={"/shop/"+shop.shop.id}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                        Перейти
                    </button>
                </Link>
            </div>
        </div>
    );
}