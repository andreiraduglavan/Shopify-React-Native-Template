import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthContext } from './src/context/AuthContext'
import { CartContext } from './src/context/CartContext'
import { NavigationContext } from './src/context/NavigationContext'
import { WishlistContext } from './src/context/WishlistContext'
import MainNavigator from './src/screens/MainNavigator'
import NetInfo from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import noNetworkCloud from './assets/storm-cloud.png'
import { colorScheme, hasHomeIndicator, theme } from './src/constants/theme'
import { StatusBar } from 'expo-status-bar'

export default function App() {
  const [isConnected, setIsConnected] = useState(true)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setIsConnected(state.isConnected)
      }
    })
    
    return () => unsubscribe()
  }, [])

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <AuthContext>
        <WishlistContext>
          <CartContext>
            <NavigationContext>
              <View style={{backgroundColor: theme.colors.background,flex: 1, paddingBottom: hasHomeIndicator ? 30 : 0 }}>
                { isConnected ?
                  <MainNavigator /> :
                  <View style={styles.container}>
                    <Image source={noNetworkCloud} style={styles.image} />
                    <Text style={styles.title}>Oops!</Text>
                    <Text style={styles.text}>No internet connection found. Check your internet connection and try again.</Text>
                  </View>
                } 
              </View> 
              <StatusBar style={colorScheme == 'light' ? 'dark' : 'light'} />            
            </NavigationContext>
          </CartContext>
        </WishlistContext>
      </AuthContext>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 14
  },
  text: {
    letterSpacing: 1.5,
    color: theme.colors.text,
    marginTop: 16,
    fontSize: 15,
    textAlign: 'center'
  },
  title: {
    fontSize: 32,
    letterSpacing: 2,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 48
  },
  image: {
    width: 120,
    height: 120*0.974
  }
})
