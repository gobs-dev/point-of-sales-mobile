import { Image } from 'expo-image';
import React from 'react';
import { Pressable, View } from 'react-native';

import { formatPriceToRupiah } from '@/core/lib/price';
import { Text } from '@/ui';

const CartCard = ({
  imageUrl,
  title,
  description,
  price,
  onPress,
}: {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} className="m-1 flex-1">
      <View className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <View className="aspect-square w-full">
          {imageUrl ? (
            <Image  
              className="flex-1"
              contentFit="cover"
              source={{ uri: imageUrl }}
              alt={title}  
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-gray-100">
              <Text className="text-sm text-gray-500">No image available</Text>
            </View>
          )}
        </View>
        <View className="p-2">
          <Text className="mb-1 text-sm font-medium tracking-tight text-slate-700" numberOfLines={1}>
            {title}
          </Text>
          <Text className="mb-1 text-xs text-slate-600" numberOfLines={2}>
            {description}
          </Text>
          <Text className="text-sm font-medium text-slate-800">
            {formatPriceToRupiah(price)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default CartCard;