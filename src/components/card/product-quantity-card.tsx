import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

import { type ProductDto } from '@/app/(app)/cart';
import { formatPriceToRupiah } from '@/core/lib/price';
import { Button, Input, View } from '@/ui';
import { CircleMinus } from '@/ui/icons/circle-minus';
import { CirclePlus } from '@/ui/icons/circle-plus';
import { Trash } from '@/ui/icons/trash';

const ProductQuantityCard = ({
  product,
  productId,
  quantity,
  onRemoveFromCart,
  onAddToCart,
  onChangeQuantity,
}: {
  product: ProductDto;
  productId: string;
  quantity: number;
  onRemoveFromCart: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onChangeQuantity: (productId: string, quantity: number) => void;
}) => {
  const [quantityProduct, setQuantityProduct] = useState(quantity);

  useEffect(() => {
    if (quantityProduct !== quantity) {
      setQuantityProduct(quantity);
    }
  }, [quantity]);

  if (!product) return null;

  return (
    <View className="flex flex-row items-center gap-3">
      <View className="my-auto flex h-20 w-20 overflow-hidden rounded-md border border-slate-200">
        {product.imageUrl ? (
            <Image
              alt={product.name}
              source={{uri: product.imageUrl}}
              className="h-full w-full object-cover"
            />
        ) : (
          <View className="flex-1 items-center justify-center bg-gray-100">
          <Text className="text-sm text-gray-500">No image available</Text>
        </View>
        )}
      </View>
      <View className="w-full">
        <Text className="break-all  text-sm text-slate-800">{product.name}</Text>
        <Text className="mb-1.5 mt-0.5 text-sm font-medium text-slate-500">
          <Text className="text-slate-900">
            {formatPriceToRupiah(product.price)}
          </Text>
          {` x ${quantityProduct}`}
        </Text>
        <View className="flex flex-row items-center justify-end gap-3">
          <Button variant="ghost" className="ml-auto h-7 p-0" onPress={() =>onRemoveFromCart(productId)}>
            <Trash className="size-4 text-red-500" />
          </Button>
          <View className="flex w-3/5 flex-row items-center gap-2">
            <Button
              variant="ghost"
              className="h-7 p-0"
              onPress={() => {
                if(quantity ===1) onRemoveFromCart(productId);
                setQuantityProduct(quantityProduct - 1);
              }}
            >
              <CircleMinus className="size-4 text-slate-400" />
            </Button>
            <Input
              className="h-7 text-center"
              value={String(quantityProduct)}
              onChangeText={(val) => setQuantityProduct(Number(val))}
              onBlur={(val) => {
                const quantity = Number(val);

                onChangeQuantity(productId, quantity > 0 ? quantity : 1);
              }}
            />
            <Button
              variant="ghost"
              className="h-7 p-0"
              onPress={() => {
                setQuantityProduct(quantityProduct + 1);
                onAddToCart(productId);
              }}
            >
              <CirclePlus className="size-4 text-slate-600" />
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductQuantityCard;
