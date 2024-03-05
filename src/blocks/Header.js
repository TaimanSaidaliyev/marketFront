import { Link } from "react-router-dom";

export const Header = () => {
    return(
        <div className="flex w-full bg-white h-[70px] p-5 border border-b-1 justify-center">
            <div className="flex flex-row max-w-[960px]">
                <div className="flex w-screen items-end">
                    <div className="px-2">
                        <Link to={'/'} className="text-xl text-gray-500 font-bold">MarketPlace</Link>
                    </div>
                    <div className="px-2 align-bottom">
                        <Link to={'/'} className="text-md text-gray-500">Главная</Link>
                    </div>
                    <div className="px-2 align-bottom">
                        <Link to={'/'} className="text-md text-gray-500">Магазины</Link>
                    </div>
                    <div className="px-2 align-bottom">
                        <Link to={'/'} className="text-md text-gray-500">Продукты</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}