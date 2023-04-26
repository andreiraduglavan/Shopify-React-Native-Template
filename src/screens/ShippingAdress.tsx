import { View, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions, NativeModules, StatusBar } from 'react-native'
import {  useEffect, useRef, useState } from 'react'
import { CartStackParamList } from '../types/navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { theme } from '../constants/theme'
import { storefrontApiClient } from '../utils/storefrontApiClient'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import FillButton from '../components/shared/FillButton'
import { Entypo } from '@expo/vector-icons'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import { provinces } from '../constants/provinces'
import { AvailableShippingRatesType } from '../types/dataTypes'
import { useAuthContext } from '../context/AuthContext'

const screenHeight = Dimensions.get('screen').height

type Props = NativeStackScreenProps<CartStackParamList, 'ShippingAddress'>

const ShippingAddress = ({ route, navigation }: Props) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const { userToken } = useAuthContext()
  const [isCountyPickerOpen, setisCountyPickerOpen] = useState(false)

  const { StatusBarManager } = NativeModules
  const [sbHeight, setsbHeight] = useState<any>(StatusBar.currentHeight)

  useEffect(() => {
    if(Platform.OS === "ios") {
      StatusBarManager.getHeight((statusBarHeight: any) => {
        setsbHeight(Number(statusBarHeight.height))
      })
    }
  }, [])

  const { checkoutId } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState(userToken ? userToken.customer.email : '')
  const [firstName, setFirstName] = useState(userToken ? userToken.customer.firstName : '')
  const [lastName, setLastName] = useState(userToken ? userToken.customer.lastName : '')
  const [phone, setPhone] = useState(userToken && userToken.customer.phone ? userToken.customer.phone : '')
  const [province, setProvince] = useState<{code: string, province: string} | null>(null)
  const [zip, setZip] = useState('')
  

  const updateShippingAdress = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const query = `mutation checkoutEmailUpdateV2($checkoutId: ID!, $email: String!) {
        checkoutEmailUpdateV2(checkoutId: $checkoutId, email: $email) {
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
        email
      }

      const updateEmailResponse: any = await storefrontApiClient(query, variables)
      
      if (updateEmailResponse.errors && updateEmailResponse.errors.length != 0 ) {
        throw updateEmailResponse.errors[0].message
      }

      if (updateEmailResponse.data.checkoutEmailUpdateV2.checkoutUserErrors && updateEmailResponse.data.checkoutEmailUpdateV2.checkoutUserErrors.length != 0 ) {
        throw updateEmailResponse.data.checkoutEmailUpdateV2.checkoutUserErrors[0].message
      }
      
      const query2 = `mutation checkoutShippingAddressUpdateV2($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
        checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
          checkout {
            id
            availableShippingRates {
              ready
              shippingRates {
                handle
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }`
      
      if (province == null) {
        throw 'Please select a county.'
      }

      const variables2 = {
        checkoutId,
        allowPartialAddresses: true,
        shippingAddress: {
          address1: address1,
          address2: address2,
          city: city,
          company: "",
          country: "RO",
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          province: province.code,
          zip: zip
        }
      }

      const response: any = await storefrontApiClient(query2, variables2)
      
      if (response.errors && response.errors.length != 0 ) {
        throw response.errors[0].message
      }

      if (response.data.checkoutShippingAddressUpdateV2.checkoutUserErrors && response.data.checkoutShippingAddressUpdateV2.checkoutUserErrors.length != 0 ) {
        throw response.data.checkoutShippingAddressUpdateV2.checkoutUserErrors[0].message
      }

      const availableShippingRates: AvailableShippingRatesType = response.data.checkoutShippingAddressUpdateV2.checkout.availableShippingRates as AvailableShippingRatesType

      navigation.push('ShippingOptions', { checkoutId, availableShippingRates })

    } catch (e) {
      console.log(e)
      if (typeof e == 'string') {
        setErrorMessage(e)
      } else {
        setErrorMessage('Something went wrong. Try again.')
      }
    }

    setIsLoading(false)
  }

  return (
    <View style={{flex: 1 }} >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ref={scrollViewRef}
      >
        <TextInput 
          placeholder='Email'
          placeholderTextColor={theme.colors.disabledText}
          keyboardType='email-address'
          style={styles.input}
          editable={userToken ? false : true}
          onChangeText={(text) => !userToken && setEmail(text)}
          autoCapitalize='none'
          value={userToken ? userToken.customer.email : email}
          onFocus={() => setisCountyPickerOpen(false)}
        />
        <TextInput 
          placeholder='First Name'
          placeholderTextColor={theme.colors.disabledText}
          style={styles.input}
          onChangeText={(text) => setFirstName(text)}
          autoCapitalize='words'
          value={firstName}
          onFocus={() => setisCountyPickerOpen(false)}
        />
        <TextInput 
          placeholder='Last Name'
          placeholderTextColor={theme.colors.disabledText}
          style={styles.input}
          onChangeText={(text) => setLastName(text)}
          autoCapitalize='words'
          value={lastName}
          onFocus={() => setisCountyPickerOpen(false)}
        />
        <TextInput 
          placeholder='Phone'
          placeholderTextColor={theme.colors.disabledText}
          keyboardType='phone-pad'
          style={styles.input}
          onChangeText={(text) => setPhone(text)}
          autoCapitalize='none'
          value={phone}
          onFocus={() => setisCountyPickerOpen(false)}
        />
        <TextInput 
          placeholder='Address'
          placeholderTextColor={theme.colors.disabledText}
          style={styles.input}
          onChangeText={(text) => setAddress1(text)}
          autoCapitalize='none'
          value={address1}
          onFocus={() => setisCountyPickerOpen(false)}
        />
        <TextInput 
          placeholder='Apartament, suite, etc. (optional)'
          placeholderTextColor={theme.colors.disabledText}
          style={styles.input}
          onChangeText={(text) => setAddress2(text)}
          autoCapitalize='none'
          value={address2}
          onFocus={() => {
            setisCountyPickerOpen(false)
            scrollViewRef.current.scrollToEnd({animated: true})
          }}
        />
        <TextInput 
          placeholder='City'
          placeholderTextColor={theme.colors.disabledText}
          style={styles.input}
          onChangeText={(text) => setCity(text)}
          autoCapitalize='words'
          value={city}
          onFocus={() => {
            setisCountyPickerOpen(false)
            scrollViewRef.current.scrollToEnd({animated: true})
          }}
        />
        {/* Province Input */}
        <View style={{position: 'relative'}}>
          <TouchableOpacity onPress={() => setisCountyPickerOpen(!isCountyPickerOpen) } >
            <View style={styles.countyPickerView}>
              <Text style={[styles.county, {color: province ? theme.colors.text : theme.colors.disabledText}]}>
                { province ? province.province : 'County (Județ)' }
              </Text>
              <Entypo name={`chevron-small-${isCountyPickerOpen ? 'up' : 'down'}`} size={24} color={theme.colors.disabledText} />
            </View>
          </TouchableOpacity>
          { isCountyPickerOpen &&
            <ScrollView style={{height: 100}} showsVerticalScrollIndicator={false}>
              <View style={styles.provinceOptionsContainer}>
                { provinces.map((item) => (
                  <TouchableOpacity 
                    key={item.code} 
                    onPress={() => {
                      setProvince(item)
                      setisCountyPickerOpen(false)
                    }}
                  >
                    <Text 
                      style={[styles.provinceOptionTitle, {color: province && item.code == province.code ? theme.colors.text : theme.colors.disabledText }]}
                    >
                      {item.province}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          }
        </View>
        <TextInput 
          placeholder='Postal Code'
          placeholderTextColor={theme.colors.disabledText}
          style={styles.input}
          onChangeText={(text) => setZip(text)}
          autoCapitalize='none'
          value={zip}
          onFocus={() => {
            setisCountyPickerOpen(false)
            scrollViewRef.current.scrollToEnd({animated: true})
          }}
        />
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={44+sbHeight}
      >
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
                title='CONTINUE TO SHIPPING OPTIONS'
                onPress={updateShippingAdress}
              />
            </View>
          }
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ShippingAddress

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    paddingBottom: Platform.OS == 'ios' ? 280 : 20,
  },
  input: {
    marginTop:16,
    fontSize:16,
    borderBottomWidth:0.5,
    borderColor: theme.colors.text, 
    padding:8,
    paddingHorizontal:4,
    color: theme.colors.text
  },
  countyPickerView: {
    marginTop:16,
    borderBottomWidth:0.5,
    borderColor: theme.colors.text, 
    padding:8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:4,
  },
  county: {
    fontSize:16
  },
  text: {
    color: theme.colors.text
  }, 
  provinceOptionTitle: {
    color: theme.colors.infoText,
    letterSpacing: 0.6,
    paddingVertical: 3
  },
  checkoutContainer: { 
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.infoText,
    borderTopWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14
  },
  provinceOptionsContainer: {
    alignItems: 'center',
    paddingTop: 16
  },
  error: {
    alignSelf: 'center',
    color: 'red',
    marginBottom: 4,
    letterSpacing: 1.8
  },
})