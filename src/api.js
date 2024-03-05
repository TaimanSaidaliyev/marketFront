import axios from 'axios';


export class Products {
    static async getProductAllList() {
        const response = await axios.get(`http://127.0.0.1:8000/shops/list/all/`);
        return response;
    }
    static async getProductsByShop(shopId) {
        const response = await axios.get(`http://127.0.0.1:8000/shop/${shopId}/products/`);;
        return response;
    }
    static async getProductsByCategory(categoryId=1) {
        const response = await axios.get(`http://127.0.0.1:8000/category/${categoryId}/products/`);;
        return response;
    }
    static async getProductsBySearch(search_text='') {
        const response = await axios.put(`http://127.0.0.1:8000/products/search/`, {search_text: search_text});
        return response;
    }
    static async getProductDetail(product_id = 1) {
        const response = await axios.get(`http://127.0.0.1:8000/products/detail/${product_id}/`);
        return response;
    }
}

export class Shop {
    static async getShopsAll() {
        const response = await axios.post(`http://127.0.0.1:8000/shops/list/`);;
        return response;
    }
    static async getShopsBySearch(fieldText) {
        const response = await axios.post(`http://127.0.0.1:8000/shops/list/${fieldText}`);;
        return response;
    }
    static async getShopById(id) {
        const response = await axios.get(`http://127.0.0.1:8000/shop/${id}`);;
        return response;
    }
    static async getShopByProductId(id=1) {
        const response = await axios.get(`http://127.0.0.1:8000/shops/${id}/products/`);;
        return response;
    }
}

export class Category {
    static async getCategoriesList() {
        const response = await axios.get(`http://127.0.0.1:8000/category/list/`);
        return response;
    }
}