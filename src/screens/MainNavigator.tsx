import { NavigationContainer } from '@react-navigation/native'
import { StackParamList } from '../types/navigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Platform, StyleSheet } from 'react-native'
import TabNavigator from './TabNavigator'
import ProductScreen from './ProductScreen'
import { theme } from '../constants/theme'
import { AntDesign } from '@expo/vector-icons'
import { useNavigationContext } from '../context/NavigationContext'
import ShippingAddress from './ShippingAdress'
import ShippingOptions from './ShippingOptions'
import { BackArrowIcon } from '../components/shared/Icons'
import Payment from './Payment'
import LoginStackNavigator from './LoginStackNavigator'
import DiscountCode from './DiscountCode'
import { Text, TouchableOpacity } from 'react-native'
import Cart from './Cart'

const Stack = createNativeStackNavigator<StackParamList>()

const MainNavigator = () => {
  const { rootNavigation } = useNavigationContext()

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen name='TabNavigator' component={TabNavigator} options={{headerShown: false}} />
        <Stack.Screen 
          name='ProductScreen' 
          component={ProductScreen}
          options={{
            headerShadowVisible: false,
            headerTransparent: true,
            title: '', 
            presentation: 'fullScreenModal',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => rootNavigation.goBack() } 
                hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}
              >
                <AntDesign
                  name='close' 
                  size={22}
                  color='black'
                />
              </TouchableOpacity>
            )
          }} 
        />
        <Stack.Screen 
          name='LoginStackNavigator' 
          component={LoginStackNavigator}
          options={{
            headerStyle: {backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
            title: '', 
            presentation: 'fullScreenModal',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => rootNavigation.goBack() } 
              >
                <AntDesign
                  name='close' 
                  size={22} 
                  color={theme.colors.text} 
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name='ShippingAddress' 
          component={ShippingAddress}
          options={{
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
            headerTitle: () => (
              <Text style={styles.screenTitle}>Shipping Address</Text>
            ),
            headerLeft: () => (
              <>
                { Platform.OS == 'ios' ?
                  <BackArrowIcon
                    color={theme.colors.text}
                    size={20}
                    onPress={() => rootNavigation.goBack()}
                  /> :
                  null
                }
              </>
            ),
          }} 
        />
        <Stack.Screen 
          name='ShippingOptions' 
          component={ShippingOptions}
          options={{
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
            headerTitle: () => (
              <Text style={styles.screenTitle}>Shipping Options</Text>
            ),
            headerLeft: () => (
              <>
                { Platform.OS == 'ios' ?
                  <BackArrowIcon
                    color={theme.colors.text}
                    size={20}
                    onPress={() => rootNavigation.goBack()}
                  /> :
                  null
                }
              </>
            ),
          }} 
        />
        <Stack.Screen 
          name='DiscountCode' 
          component={DiscountCode}
          options={{
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
            headerTitle: () => (
              <Text style={styles.screenTitle}>Use Promo Code</Text>
            ),
            headerLeft: () => (
              <BackArrowIcon 
                color={theme.colors.text}
                size={20}
                onPress={() => rootNavigation.goBack()}
              />
            ),
          }} 
        />
        <Stack.Screen 
          name='Payment' 
          component={Payment}
          options={{
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
            title: '',
            headerLeft: () => (
              <>
                { Platform.OS == 'ios' ?
                  <BackArrowIcon
                    color={theme.colors.text}
                    size={20}
                    onPress={() => rootNavigation.goBack()}
                  /> :
                  null
                }
              </>
            ),
          }} 
        />
        <Stack.Screen 
          name='Cart' 
          component={Cart}
          options={{
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
            headerLeft: () => (
              <>
                { Platform.OS == 'ios' ?
                  <BackArrowIcon
                    color={theme.colors.text}
                    size={20}
                    onPress={() => rootNavigation.goBack()}
                  /> :
                  null
                }
              </>
            ),
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator

const styles = StyleSheet.create({
  screenTitle: {
    fontWeight: '600', 
    letterSpacing: 1, 
    color: theme.colors.text, 
    fontSize: 16
  }
})