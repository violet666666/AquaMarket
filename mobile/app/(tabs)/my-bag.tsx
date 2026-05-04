import { CartScreen } from '@/modules/cart/screen'
import { Stack } from 'expo-router'

export default function CartPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Keranjang Saya',
          headerStyle: { backgroundColor: '#01696f' },
          headerTintColor: 'white',
        }}
      />
      <CartScreen />
    </>
  )
}
