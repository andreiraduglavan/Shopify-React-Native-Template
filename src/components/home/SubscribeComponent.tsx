import { useState } from 'react'
import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import { theme } from '../../constants/theme'
import { useAuthContext } from '../../context/AuthContext'
import { storefrontApiClient } from '../../utils/storefrontApiClient'
import * as SecureStore from 'expo-secure-store'
import FillButton from '../shared/FillButton'
import { useNavigationContext } from '../../context/NavigationContext'

const windowHeight = Dimensions.get('window').height-50

const SubscribeComponent = () => {
  const { userToken, dispatch } = useAuthContext()
  const { rootNavigation } = useNavigationContext() 
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  
  const subscribe = async () => {
    setIsLoading(true)
    setErrorMessage('')
    setIsSuccess(false)

    if ( userToken ) {
      try {
        const query = `mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
          customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
            customer {
              id
              firstName
              lastName
              acceptsMarketing
              email
              phone
            }
            customerUserErrors {
              code
              field
              message
            }
          }
        }`
  
        const variables = {
          customerAccessToken: userToken.accessToken,
          customer: {
            acceptsMarketing: true
          }
        }
  
        const response: any = await storefrontApiClient(query, variables)
  
        if (response.errors && response.errors.length != 0) {
          throw response.errors[0].message
        }
        
        if (response.data.customerUpdate.customerUserErrors.length != 0) {
          throw response.data.customerUpdate.customerUserErrors[0].message
        }
  
        var newToken = userToken
        newToken.customer = response.data.customerUpdate.customer
        
        SecureStore.setItemAsync('userToken', JSON.stringify(newToken) )
        dispatch({ type: 'RESTORE_TOKEN', token: newToken });
        
        setIsSuccess(true)
      } catch (error: any) {
        typeof error === 'string' && setErrorMessage(error)
        console.log(error)
      }
    } else {
      rootNavigation.push('LoginStackNavigator', { screen: 'Register'})
    }

    setIsLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join our Newsletter</Text>
      <View style={styles.buttonContainer}>
        { isLoading ?
          <ActivityIndicator size='small' /> :
          <>
            { isSuccess ?
              <View>
                <Text style={styles.isSuccessText}>Thank you for subscribing!</Text>
              </View> :
              <FillButton 
                onPress={subscribe} 
                title='JOIN' 
              />
            }
          </>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text,
    marginLeft:24,
    fontSize:16,
    fontWeight:'500',
    letterSpacing:1.5
  },
  container: {
    height: windowHeight,
    justifyContent:'center'
  },
  input: {
    marginHorizontal:24,
    marginTop:16,
    fontSize:16,
    borderBottomWidth:0.5,
    borderColor: theme.colors.text, 
    padding:8,
    paddingHorizontal:4,
    color: theme.colors.text,
  },
  buttonContainer: {
    marginTop: 24,
    marginHorizontal: 24,
  },
  isSuccessText: {
    color: theme.colors.text,
    letterSpacing: 0.8
  },
})

export default SubscribeComponent