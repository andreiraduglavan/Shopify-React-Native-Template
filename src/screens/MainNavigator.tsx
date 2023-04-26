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
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Text, TouchableOpacity } from 'react-native'
import Cart from './Cart'
import * as Application from 'expo-application';
import { useEffect } from 'react'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

async function registerForPushNotificationsAsync() {
  let token: string | null = null

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus


    if (existingStatus === 'granted') {
      return null
    } else {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return null
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data

  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token
}

const Stack = createNativeStackNavigator<StackParamList>()

const MainNavigator = () => {
  const { rootNavigation } = useNavigationContext()
  
  useEffect(() => {
    (async () => {
      try {       
        const token = await registerForPushNotificationsAsync()

        if (token) {
          var deviceId: string | null = null
          if (Platform.OS == 'android') {
            deviceId = Application.androidId
          } else {
            deviceId = await Application.getIosIdForVendorAsync()
          }

          // send notification token to the database
          try {
            fetch('https://eu-central-1.aws.data.mongodb-api.com/app/data-aacid/endpoint/data/v1/action/insertOne', {
              method: 'POST',
              headers: {
                'api-key': 'x0t7icrVWcdnfsD6jW4IRIW9H3GxPFDOhsKLcyKL9OIBejheiDsaEdkmPEhhFxt8',
                'Content-Type': 'application/ejson'
              },
              body: JSON.stringify({
                dataSource: "Cluster0",
                database: "JUET",
                collection: "notifications_receivers",
                document: {
                  deviceId: deviceId,
                  token: token
                }
              })
            }) 
          } catch (e) {
            console.log(e)
          }
            
        }
      } catch (e) {
        console.log(e)
      }
    })()
    
  }, [])

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