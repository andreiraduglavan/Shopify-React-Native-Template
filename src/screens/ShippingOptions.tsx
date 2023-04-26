import { View, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CartStackParamList } from '../types/navigation'
import { theme } from '../constants/theme'
import FillButton from '../components/shared/FillButton'
import { storefrontApiClient } from '../utils/storefrontApiClient'

const screenWidth = Dimensions.get('screen').width

type Props = NativeStackScreenProps<CartStackParamList, 'ShippingOptions'>

const ShippingOptions = ({route, navigation}: Props) => {
  const { checkoutId, availableShippingRates } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRateHandle, setSelectedRateHandle] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const updateShippingOption = async () => {
    setIsLoading(true) 
    setErrorMessage('')

    
    try {
      if ( selectedRateHandle == null ) {
        throw 'Please select a shipping option.'
      }

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

      const response: any = await storefrontApiClient(query, variables)

      if (response.errors && response.errors.length != 0 ) {
        throw response.errors[0].message
      }

      if (response.data.checkoutShippingLineUpdate.checkoutUserErrors && response.data.checkoutShippingLineUpdate.checkoutUserErrors.length != 0 ) {
        throw response.data.checkoutShippingLineUpdate.checkoutUserErrors[0].message
      }

      const webUrl = response.data.checkoutShippingLineUpdate.checkout.webUrl
      
      navigation.push('Payment', { webUrl, checkoutId, selectedRateHandle })

    } catch (e) {
      console.log(e)
    }
    
    setIsLoading(false)
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        {
          availableShippingRates.shippingRates.map(( shippingRate ) => (
            <TouchableOpacity 
              onPress={() => setSelectedRateHandle(shippingRate.handle)}
              key={shippingRate.handle}
            >
              <View style={[styles.rateContainer, {borderColor: selectedRateHandle == shippingRate.handle ? theme.colors.text : theme.colors.disabledText}]}>
                <Text 
                  style={[
                    styles.text, 
                    { color: selectedRateHandle == shippingRate.handle ? theme.colors.text : theme.colors.infoText }
                  ]}
                >
                  {shippingRate.title}
                </Text>
                <Text 
                  style={[
                    styles.text, 
                    { color: selectedRateHandle == shippingRate.handle ? theme.colors.text : theme.colors.infoText }
                  ]}
                >
                  {shippingRate.price.amount} RON
                </Text>
              </View>
            </TouchableOpacity>
          ))
        }
      </View>


      <View style={[styles.checkoutContainer, {height: errorMessage.length != 0 ? 68 : 50 }]}>
        { isLoading ?
          <View style={{width: 100, alignItems:'center'}}>
            <ActivityIndicator size='small' /> 
          </View> :
          <View>
              { errorMessage.length != 0 &&
                <Text style={styles.error}>{errorMessage}</Text>
              }
              <FillButton
                title='CONTINUE TO PAYMENT'
                onPress={updateShippingOption}
              />
            </View>
        }
      </View>
    </View>
  )
}

export default ShippingOptions

const styles = StyleSheet.create({
  rateContainer: {
    marginTop: 12,
    borderWidth: 0.5,
    borderRadius: 4,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: screenWidth - 28,
    justifyContent: 'space-between'
  },
  container: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 14
  },
  text: {
    color: theme.colors.text
  },
  checkoutContainer: { 
    height: 50,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.infoText,
    borderTopWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14
  },
  error: {
    alignSelf: 'center',
    color: 'red',
    letterSpacing: 1.8,
    marginBottom: 4
  },
})