import { Tabs, usePathname } from 'expo-router'
import {
  ShoppingBagIcon,
  HomeIcon,
  UserCircleIcon,
} from 'react-native-heroicons/solid'
import {
  ShoppingBagIcon as ShoppingBagIconOutline,
  HomeIcon as HomeIconOutline,
  UserCircleIcon as UserCircleIconOutline,
} from 'react-native-heroicons/outline'
import { View, Text } from '@/design'
import { LogBox } from 'react-native'

// AquaMarket brand colors
const BRAND_TEAL = '#01696f'
const BRAND_TEAL_LIGHT = '#019fa7'
const BRAND_INACTIVE = '#9ca3af'

if (__DEV__) {
  LogBox.ignoreLogs([
    'Constants.platform.ios',
    'is in a background',
    'to suppress',
    'Request failed with status code 401',
    "The 'navigation' object",
    'No native splash',
    'Unable to find',
    'Unsupported dashed',
    '[Reanimated]',
    'cannot be given ref',
    'Each child in a list',
    'uncontrolled',
    'redirect'
  ])
} else {
  LogBox.ignoreAllLogs()
}

const ShoppingBagIconWithBadge = ({ focused, color }: { focused: boolean; color: string }) => {
  return (
    <View className={'relative'}>
      {focused ? (
        <ShoppingBagIcon color={color} size={27} />
      ) : (
        <ShoppingBagIconOutline color={color} size={27} />
      )}
    </View>
  )
}

const TabBar = () => {
  const pathname = usePathname()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND_TEAL,
        tabBarInactiveTintColor: BRAND_INACTIVE,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#f3f4f6',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Beranda',
          headerShown: false,
          tabBarIcon: ({ color, focused }) =>
            ['products', 'store'].some((option) => pathname.includes(option)) ||
            pathname === '/' ? (
              <HomeIcon color={color} size={27} />
            ) : (
              <HomeIconOutline color={color} size={27} />
            ),
        }}
      />
      <Tabs.Screen
        name="my-bag"
        options={{
          headerShown: true,
          headerTitle: 'Keranjang',
          headerStyle: { backgroundColor: BRAND_TEAL },
          headerTintColor: 'white',
          tabBarLabel: 'Keranjang',
          tabBarIcon: (props) => <ShoppingBagIconWithBadge {...props} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Akun',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <UserCircleIcon color={color} size={27} />
            ) : (
              <UserCircleIconOutline color={color} size={27} />
            ),
        }}
      />
      <Tabs.Screen
        name={'cart'}
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}

export default function TabsLayout() {
  return <TabBar />
}
