import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { StackParamList } from '../types/navigation'
import * as WebBrowser from 'expo-web-browser'
import { storefrontApiClient } from '../utils/storefrontApiClient'
import { Text } from 'react-native'
import FillButton from '../components/shared/FillButton'
import { theme } from '../constants/theme'
import { AntDesign } from '@expo/vector-icons';
import { BackArrowIcon } from '../components/shared/Icons'
import { useCartContext } from '../context/CartContext'

type Props = NativeStackScreenProps<StackParamList, 'Payment'>

const Payment = ({route, navigation}: Props) => {
  const { webUrl, checkoutId, selectedRateHandle } = route.params
  const { resetCart } = useCartContext()
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <>
          { isCompleted ?
            null :
            <BackArrowIcon 
                color={theme.colors.text}
                size={20}
                onPress={() => navigation.goBack()}
              />
          }
        </>
      )
    })
  }, [isCompleted])

  const completeCheckout = async () => {
    setIsLoading(true)
    setError(false)

    await WebBrowser.openBrowserAsync(webUrl)
    
    // use this mutation to check if the checkout is completed
    // if the checkout is completed "Checkout is already completed." error message will occur
    // otherwise the checkout is not completed
    const query = `mutation checkoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {
      checkoutShippingLineUpdate(checkoutId: $checkoutId, shippingRateHandle: $shippingRateHandle) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }`
    
    const variables = {
      checkoutId,
      shippingRateHandle: selectedRateHandle
    }

    try {
      const response: any = await storefrontApiClient(query, variables)
      
      // if the checkout is completed "Checkout is already completed." error message will occur
      if (response.errors && response.errors.length != 0 ) {
        if (response.errors[0].message == "Checkout is already completed.") {
          setIsCompleted(true)


        } else {
          throw response.errors[0].message
        }
      } else {
        navigation.goBack()
      }

    } catch (e) {
      console.log(e)
      setError(true)
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    completeCheckout()
  }, [])
  

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      { isLoading ? 
        <ActivityIndicator size='small' /> : 
        <>
          { error ?
            <View>
              <Text style={styles.error}>Something went wrong. Try again.</Text>
              <FillButton 
                title='TRY PAYMENT AGAIN'
                onPress={() => completeCheckout() }
              />
            </View> :
            <>
              { isCompleted &&
                <View style={styles.thankYouContainer}>
                  <View style={styles.subContainer}>
                    <AntDesign name="checkcircleo" size={42} color={theme.colors.text} />
                    <Text style={styles.text}>Thank you for your order!</Text>
                  </View>
                  <FillButton 
                    title='CONTINUE SHOPPING'
                    onPress={() => { resetCart(); navigation.push('TabNavigator') }}
                  />
                </View>
              }
            </>
          }
        </>
      }
    </View>
  )
}

export default Payment

const styles = StyleSheet.create({
  error: {
    color: 'red',
    letterSpacing: 0.8,
    marginBottom: 16
  },
  thankYouContainer: {
    
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    width: 260
  },
  text: {
    color: theme.colors.text,
    fontSize: 20,
    letterSpacing: 4,
    marginLeft: 12,
    textAlign: 'center'
  }
})