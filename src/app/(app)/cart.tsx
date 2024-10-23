/* eslint-disable max-lines-per-function */
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native"

import { client } from "@/api";
import CartCard from "@/components/card/cart-card"
import { useAuth } from "@/core";
import { Text } from "@/ui"

const cartItems = [
  { id: '1', title: "Product 1", description: "Description 1", price: 100000, imageUrl: "https://dummyimage.com/300" },
  { id: '2', title: "Product 2", description: "Description 2", price: 200000, imageUrl: "https://dummyimage.com/300" },
  // Add more items as needed
];
const limit = 100;

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  imageUrl?: string;
  sku: string;
}

export interface ProductListResponseDto {
  data: ProductDto[];
  type: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


const renderItem = ({ item }) => (
  <CartCard
    description={item.description}
    imageUrl={item.imageUrl}
    onPress={() => {/* Handle press */}}
    price={item.price}
    title={item.title}
  />
);


const Cart = () => {
  const { width } = useWindowDimensions();
  const numColumns = useMemo(() => {
      if (width < 640) return 2; // Mobile: 2 columns
      if (width < 1024) return 3; // Tablet: 3 columns
      return 4; // Desktop: 4 columns
  },[width])
  const { user } = useAuth();
  console.log('user',user?.activeStoreId)
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: number;
  }>({});
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);

  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery<ProductListResponseDto>({
      queryKey: ['products-list'],
      getNextPageParam: (lastPage, pages) => {
        if (lastPage?.meta?.total < limit) return undefined;
        return pages.length + 1;
      },
      queryFn: ({ pageParam = 1 }) => {
        return client.get(`/stores/${user?.activeStoreId}/products`, {
          params: { limit, page: pageParam },
        }).then(res => res.data);
      },
      initialPageParam: 1,
    });
    console.log(
      'data',data)

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.data);
  }, [data]);

  const idProductMaps = useMemo(() => {
    const productIdMap: { [key: string]: ProductDto } = {};
    products?.forEach((product) => {
      productIdMap[product.id] = product;
    });
    return productIdMap;
  }, [products]);

  const totalPrice = useMemo(() => {
    if (
      Object.keys(selectedProducts).length === 0 ||
      Object.keys(idProductMaps).length === 0
    )
      return 0;

    return Object.entries(selectedProducts).reduce(
      (acc, [productId, quantity]) => {
        return acc + idProductMaps[productId].price * quantity;
      },
      0
    );
  }, [selectedProducts, idProductMaps]);

  if (isLoading) return <ActivityIndicator />;
  
  if (isError) return <Text>Error</Text>;

  if (!products?.length) return <Text>produk masih kosong</Text>;

  const handleAddToCart = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = {
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      };
      window.localStorage.setItem(
        CART_PRODUCTS_KEY,
        JSON.stringify(newSelectedProducts)
      );
      return newSelectedProducts;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setSelectedProducts((prev) => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = currentQuantity - 1;

      const newSelectedProducts = {
        ...prev,
        [productId]: newQuantity,
      };

      if (newQuantity === 0) {
        delete newSelectedProducts[productId];
      }

      window.localStorage.setItem(
        CART_PRODUCTS_KEY,
        JSON.stringify(newSelectedProducts)
      );
      return newSelectedProducts;
    });
  };

  const handleChangeQuantity = (productId: string, quantity: number) => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = {
        ...prev,
        ...(quantity > 0 ? { [productId]: quantity } : {}),
      };

      window.localStorage.setItem(
        CART_PRODUCTS_KEY,
        JSON.stringify(newSelectedProducts)
      );
      return newSelectedProducts;
    });
  };
  return (
    <View className="flex-1">
      <Text>Cart Content</Text>
      <FlashList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        estimatedItemSize={200}
        className="flex-1"
      />
    </View>
  )
}

export default Cart