export interface IBanner {
    mainImage?: string;
    subImage?: string;
    productId?: string;
}

export interface BannerData {
    mainImage: string;
    subImage: string;
    productId: string;
    name: string;
    price: number;
    discount: number;
}