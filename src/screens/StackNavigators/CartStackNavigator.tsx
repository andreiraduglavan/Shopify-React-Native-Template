import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { theme } from '../../constants/theme'
import { CartStackParamList } from '../../types/navigation'
import { NavigationContainer } from '@react-navigation/native'

import Cart from '../Cart'
import ShippingAddress from '../ShippingAdress'

const CartStack = createNativeStackNavigator<CartStackParamList>()

const CartStackNavigator = () => {
  return (
    <NavigationContainer theme={theme} independent={true}>
      <CartStack.Navigator>
        <CartStack.Screen 
          name='Cart' 
          component={Cart}
          options={{
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false
          }} 
        />
        <CartStack.Screen 
          name='ShippingAddress' 
          component={ShippingAddress}
          options={{
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
            title: 'Shipping Address'
          }} 
        />
      </CartStack.Navigator>
    </NavigationContainer>
  )
}

export default CartStackNavigator