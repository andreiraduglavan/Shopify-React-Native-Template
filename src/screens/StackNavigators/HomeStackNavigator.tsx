import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { theme } from '../../constants/theme'
import { HomeStackParamList } from '../../types/navigation'
import { NavigationContainer } from '@react-navigation/native'

import Home from '../Home'
import Collection from '../Collection'

const HomeStack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackNavigator = () => {
  return (
    <NavigationContainer theme={theme} independent={true}>
      <HomeStack.Navigator>
        <HomeStack.Screen 
          name='Home' 
          component={Home}
          options={{
            headerLargeTitle: false,
            headerShown: false, 
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
          }} 
        />
        <HomeStack.Screen 
          name='Collection' 
          component={Collection}
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true
          }} 
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  )
}

export default HomeStackNavigator