import { View, Text, ScrollView, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import { CartStackParamList } from '../types/navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { storefrontApiClient } from '../utils/storefrontApiClient'
import { theme } from '../constants/theme'
import FillButton from '../components/shared/FillButton'
import DiscountCodeCard from '../components/cart/DiscountCodeCard'

const screenWidth = Dimensions.get('screen').width

type Props = NativeStackScreenProps<CartStackParamList, 'DiscountCode'>

const DiscountCode = ({ route, navigation }: Props) => {
  const { checkoutId } = route.params
  const [discountCode, setDiscountCode] = useState('')
  const [discountCodesApplied, setDiscountCodesApplied] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const applyDiscountCode = async () => {
    setIsLoading(true)
    setErrorMessage('')

    if (discountCode.length == 0) {
      setIsLoading(false)
      return
    }

    try {
      const query = `mutation checkoutDiscountCodeApplyV2($checkoutId: ID!, $discountCode: String!) {
        checkoutDiscountCodeApplyV2(checkoutId: $checkoutId, discountCode: $discountCode) {
          checkout {
            id
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
        discountCode
      }
      
      const response: any = await storefrontApiClient(query, variables)
  
      if (response.errors && response.errors.length != 0 ) {
        throw response.errors[0].message
      }
  
      if (response.data.checkoutDiscountCodeApplyV2.checkoutUserErrors && response.data.checkoutDiscountCodeApplyV2.checkoutUserErrors.length != 0 ) {
        throw response.data.checkoutDiscountCodeApplyV2.checkoutUserErrors[0].message
      }

      !discountCodesApplied.includes(discountCode) && setDiscountCodesApplied(discountCodesApplied => [...discountCodesApplied, discountCode])

    } catch (e) {
      if (typeof e == 'string') {
        setErrorMessage(e)
      } else {
        setErrorMessage('Something went wrong. Try again.')
      }
    }

    setDiscountCode('')  
    setIsLoading(false)
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView 
        scrollEnabled={false}
        keyboardDismissMode='on-drag'
        contentContainerStyle={styles.container}
      >
        <TextInput 
          placeholder='Discount Code'
          keyboardType='default'
          style={styles.input}
          onChangeText={(text) => setDiscountCode(text)}
          autoCapitalize='none'
          value={discountCode}
        />
        
        <View style={{height: 32, alignItems: 'center', justifyContent: 'center'}}>
          { errorMessage.length != 0 &&
            <Text style={styles.error}>{errorMessage}</Text>
          }
        </View>

        { isLoading ? 
          <View style={{height: 27}}>
            <ActivityIndicator />
          </View> : 
          <FillButton 
            title='APPLY DISCOUNT CODE'
            onPress={applyDiscountCode}
          />
        }
        
        <View style={{flexDirection: 'row', height: 56, marginHorizontal: -14, alignItems: 'center', justifyContent: 'flex-start', width: '100%'}}>
          { discountCodesApplied.map((item, index) => (
            <DiscountCodeCard title={item} key={index} />
          ))}
        </View>
      </ScrollView>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={64}
      >
        <View style={[styles.checkoutContainer, {height: 50}]}>
          <FillButton
            title='CONTINUE TO SHIPPING ADRESS'
            onPress={() => navigation.push('ShippingAddress', { checkoutId }) }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default DiscountCode

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
  },
  input: {
    fontSize:16,
    borderBottomWidth:0.5,
    borderColor: theme.colors.text, 
    padding:8,
    width: screenWidth - 28,
    paddingHorizontal:4,
    color: theme.colors.text
  },
})