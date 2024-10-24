/* eslint-disable max-lines-per-function */
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, useWindowDimensions } from "react-native"
import { undefined } from "zod";

import { client } from "@/api";
import CartCard from "@/components/card/cart-card"
import BottomNavigationCart from "@/components/cart/bottom-navigation-cart";
import { useAuth } from "@/core";
import { CART_PRODUCTS_KEY } from "@/core/constants/storage";
import * as storage from "@/core/storage";
import { Text } from "@/ui"


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


const renderItem = ({ item ,onAddToCart}: {item:ProductDto;onAddToCart: (id:string) => void}) => (
  <CartCard
    description={item.description}
    imageUrl={item.imageUrl||''}
    onPress={() => onAddToCart(item.id)}
    price={item.price}
    title={item.name}
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
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: number;
  }>({});

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
      storage.setItem(
        CART_PRODUCTS_KEY,
        newSelectedProducts
      );
      return newSelectedProducts;
    });
  };
  const handleRemoveFromCart = (productId: string) => {
    setSelectedProducts((prev) => {
      // Create a new object to avoid mutating previous state
      const newSelectedProducts = { ...prev };
      
      // Remove the product
      delete newSelectedProducts[productId];

      // Update storage and return new state
      storage.setItem(
        CART_PRODUCTS_KEY,
        newSelectedProducts
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

      storage.setItem(
        CART_PRODUCTS_KEY,
        newSelectedProducts
      );
      return newSelectedProducts;
    });
  };

  return (
    <>
      <FlashList
        data={products}
        renderItem={({item}) => renderItem({item, onAddToCart:handleAddToCart})}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        estimatedItemSize={100}
        className="flex-1"
      />
      <BottomNavigationCart
          selectedProducts={selectedProducts}
          idProductMaps={idProductMaps}
          onRemoveFromCart={handleRemoveFromCart}
          onAddToCart={handleAddToCart}
          onChangeQuantity={handleChangeQuantity}
          totalPrice={totalPrice}
          onPayment={() =>{}}
      />
    </>
  )
}

export default Cart