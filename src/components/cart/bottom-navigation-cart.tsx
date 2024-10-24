import React from 'react';

import { formatPriceToRupiah } from '@/core/lib/price';
import { type ProductDto } from '@/types/product';
import { Button, colors, Modal, Text, useModal, View } from '@/ui';

import ProductQuantityCard from '../card/product-quantity-card';

const BottomNavigationCart = ({
  selectedProducts,
  idProductMaps,
  onRemoveFromCart,
  onAddToCart,
  onChangeQuantity,
  onPayment,
  totalPrice,
}: {
  selectedProducts: { [key: string]: number };
  idProductMaps: { [key: string]: ProductDto };
  totalPrice: number;
  onRemoveFromCart: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onChangeQuantity: (productId: string, quantity: number) => void;
  onPayment: () => void;
}) => {
  const modal = useModal()
  const formattedTotalPrice = formatPriceToRupiah(totalPrice);
  const hasSelectProduct = Object.keys(selectedProducts)?.length > 0;

  return (
    <>
    <View className="fixed bottom-0 right-0 flex w-full flex-row justify-between bg-slate-100 px-4 py-3 lg:hidden">
      <View className='flex flex-col gap-2'>
      <Text>Total Pembayaran</Text>
      <Text>{formattedTotalPrice}</Text>
        </View>
        <Button className='min-w-[100px]' disabled={!hasSelectProduct} onPress={modal.present} label={
          hasSelectProduct
          ? 'Bayar'
          : 'Silahkan Pilih Produk'
        }/>
        </View>
    <Modal
    ref={modal.ref}
        backgroundStyle={{
          backgroundColor:  colors.white,
        }}
        >
      <View className="block px-4 lg:hidden">
        <View>
          <Text>Ringkasan Pesanan</Text>
        </View>

        <View>
          {Object.keys(selectedProducts).map((productId) => (
            <View 
            key={productId}
            >
              <ProductQuantityCard
                product={idProductMaps[productId]}
                productId={productId}
                quantity={selectedProducts[productId]}
                onAddToCart={onAddToCart}
                onChangeQuantity={onChangeQuantity}
                onRemoveFromCart={onRemoveFromCart}
                />
            </View>
          ))}
        </View>
        <View className="mb-6 mt-4 p-0">
          <View className="my-3 flex justify-between border-t border-slate-400 py-3">
            <Text className="text-sm font-medium text-slate-600">Total Harga</Text>
            <Text className="text-sm font-semibold text-slate-800">
              {formattedTotalPrice}
            </Text>
          </View>
          <Button className="w-full" onPress={onPayment} label='Bayar'/>
            <Button className="w-full" variant="outline" label='Tutup' onPress={modal.dismiss}/>
        </View>
      </View>
    </Modal>
          </>
  );
};

export default BottomNavigationCart;
