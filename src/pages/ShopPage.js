import { useParams } from "react-router-dom";
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
    html: `<span className="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};

export const ShopPage = () => {
    const params = useParams();
    const [shop, setShop] = useState({});
    const [products, setProducts] = useState([]);
    const [productLoaded, setProductLoaded] = useState(false);

    const [shopsInfomation, isShopsInfomationLoading, isShopsInfomationError] = useFetching(async () => {
        const response = await Shop.getShopById(params.id);
        setShop(response.data.shop);
    });

    const [shopProducts, isShopProductsLoading, isShopProductsError] = useFetching(async () => {
        const response = await Products.getProductsByShop(params.id);
        setProducts(response.data.list);
        setProductLoaded(true);
    });

    useEffect(()=>{
        shopsInfomation();
        shopProducts();
    },[])

    useEffect(()=>{
        shopsInfomation();
        shopProducts();
    },[params]);

    return (
        <>
            <Header/>
            <div className="flex w-full justify-center">
                <div className="">
                    {/* <div className="container border px-10 py-4 m-4 rounded-xl w-full max-w-[960px] bg-white">
                        <div className="flex flex-row justify-between items-center">
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Введите запрос"/>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ms-5">Поиск</button>
                        </div>
                    </div> */}
                    <div className="container border p-10 m-4 rounded-xl max-w-[960px] bg-white w-screen">
                        <div className="flex flex-row justify-between">
                            <div>
                                <div>
                                    <span className="font-medium text-xl">{shop.title}</span>
                                </div>
                                <div className="py-1">
                                    <span className="font-sans text-base text-gray-500">Адрес: {shop.address}</span>
                                </div>
                                <div className="py-1">
                                    <span className="font-sans text-base text-gray-500">{shop.phoneNumber}</span>
                                </div>
                                <Rating
                                    style={{ maxWidth: 100 }}
                                    value={shop.rating}
                                    isDisabled={true}
                                />
                            </div>
                            {
                                shop.photo &&
                                <div className="w-[200px]">
                                    <img className="object-fit w-100 border-1 rounded-md" src={'http://127.0.0.1:8000' + shop.photo}/>
                                </div>
                            }
                        </div>
                        <div className="pt-5">
                            <p className="pb-2 font-semibold">Описание</p>
                            <span className="font-sans text-base text-gray-500">{shop.description}</span>
                        </div>
                        <div className="w-full h-[350px]">
                            <div className="pt-5">
                                <p className="pb-2 font-semibold">Местоположение</p>
                            </div>
                            {
                                productLoaded ?
                                <MapContainer center={[shop.coordinate_w ? shop.coordinate_w : 0, shop.coordinate_h ? shop.coordinate_h : 0]} zoom={13} style={{height: 300}} className="rounded-md">
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"        
                                    />
                                    <MarkerClusterGroup
                                        chunkedLoading
                                        iconCreateFunction={createClusterCustomIcon}
                                    >
                                        <Marker position={[shop.coordinate_w ? shop.coordinate_w : 0.0, shop.coordinate_h ? shop.coordinate_h : 0.0]} icon={customIcon} key={shop.id}/>
        
                                    </MarkerClusterGroup>
                                </MapContainer>
                                :
                                <></>
                            }
                        </div>
                    </div>
                    <div className="container border p-10 m-4 rounded-xl w-full max-w-[960px] bg-white">
                        <div className="w-full">
                            <div>
                                <span className="font-medium text-xl">Список товаров магазина</span>
                            </div>
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                {
                                    products.map((product)=>
                                        <ProductCard product={product} key={product.id}/>
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

const ProductCard = (product) => {
    return (
        <div className="flex flex-row pt-3">
            <div className="w-[120px]">
                <img className="object-cover border-1 rounded-md" style={{ height: 100, width: 100}} src={'http://127.0.0.1:8000' + `${product.product.product.photo}`}/>
            </div>

            <div className="w-full ps-3">
                <p className="font-sans text-md font-semibold">{product.product.product.title}</p>
                <p className="font-sans text-md text-gray-500">{product.product.product.category.title}</p>
                <p className="font-sans text-xl text-blue-700">{product.product.price}₸</p>
            </div>
        </div>
    );
}