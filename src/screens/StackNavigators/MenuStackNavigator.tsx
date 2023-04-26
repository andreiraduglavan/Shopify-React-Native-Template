import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { theme } from '../../constants/theme'
import { MenuStackParamList } from '../../types/navigation'
import { NavigationContainer } from '@react-navigation/native'
import Menu from '../Menu'
import Collection from '../Collection'
import Wishlist from '../Wishlist'

const MenuStack = createNativeStackNavigator<MenuStackParamList>()

const MenuStackNavigator = () => {
  return (
    <NavigationContainer theme={theme} independent={true}>
      <MenuStack.Navigator>
        <MenuStack.Screen 
          name='Menu' 
          component={Menu}
          options={{
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
          }} 
        />
        <MenuStack.Screen 
          name='Collection' 
          component={Collection}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true
          }} 
        />
        <MenuStack.Screen 
          name='Wishlist' 
          component={Wishlist}
          options={{ 
            headerStyle:{backgroundColor: theme.colors.background},
            headerShadowVisible: false,
          }} 
        />
      </MenuStack.Navigator>
    </NavigationContainer>
  )
}

export default MenuStackNavigator