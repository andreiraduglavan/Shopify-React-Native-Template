import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Platform } from 'react-native'
import { useEffect, useState } from 'react'
import { theme } from '../constants/theme'
import * as SecureStore from 'expo-secure-store'
import { useAuthContext } from '../context/AuthContext'
import { storefrontApiClient } from '../utils/storefrontApiClient'
import FillButton from '../components/shared/FillButton'
import { ProfileStackParamList } from '../types/navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BackArrowIcon } from '../components/shared/Icons'

type Props = NativeStackScreenProps<ProfileStackParamList, 'ResetPassword'>

const ResetPassword = ({navigation}: Props) => { 
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [succesMessage, setSuccesMessage] = useState<string | null>(null)
  const { userToken, dispatch } = useAuthContext()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.screenTitle}>Change Password</Text>
      ),
      headerLeft: () => (
        <>
          { Platform.OS == 'ios' ?
            <BackArrowIcon
              color={theme.colors.text}
              size={20}
              onPress={() => navigation.goBack()}
            /> :
            null
          }
        </>
      ),
    })
  }, [])

  const resetPassword = async () => {
    setLoading(true)
    setErrorMessage(null)
    setSuccesMessage(null)

    if (verifyPassword != password) {
      setErrorMessage('Please make sure that passwords match. Try again.')
      setLoading(false)
      return
    }

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
          customerAccessToken {
            accessToken
            expiresAt
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
          password
        }
      }

      const response: any = await storefrontApiClient(query, variables)

      if (response.errors && response.errors.length != 0) {
        throw response.errors[0].message
      }
      
      if (response.data.customerUpdate.customerUserErrors.length != 0) {
        console.log(response.data.customerUpdate.customerUserErrors)
        throw response.data.customerUpdate.customerUserErrors[0].message
      }

      var newToken = response.data.customerUpdate.customerAccessToken
      newToken.customer = response.data.customerUpdate.customer
      
      SecureStore.setItemAsync('userToken', JSON.stringify(newToken) )
      dispatch({ type: 'RESTORE_TOKEN', token: newToken });


      setSuccesMessage('Your personal informations has been updated successfully.')
      setPassword('')
      setVerifyPassword('')
      
    } catch (error: any) {
      typeof error === 'string' && setErrorMessage(error)
    }

    setLoading(false)
  }
  

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      <Text style={styles.subtitle}>Change Password</Text>
      
        {/* <TextInput
          placeholder={text[language].oldPassword}  
          placeholderTextColor={theme.colors.infoText} 
          secureTextEntry={true} 
          style={[styles.textInput, { marginBottom:8 }]} 
          onChangeText={text => setOldPassword(text) } 
          autoCapitalize={'none'} 
          value={oldPassword}
        /> */}
        <TextInput
          placeholder='New Password'
          placeholderTextColor={theme.colors.disabledText} 
          secureTextEntry={true} 
          style={[styles.input, { marginBottom:8 }]} 
          onChangeText={text => setPassword(text) } 
          autoCapitalize={'none'} 
          value={password}
        />
        <TextInput 
          placeholder='Confirm New Password'
          placeholderTextColor={theme.colors.disabledText} 
          secureTextEntry={true} 
          style={[styles.input, { marginBottom:24 }]} 
          onChangeText={text => setVerifyPassword(text) } 
          autoCapitalize={'none'} 
          value={verifyPassword}
        />

        { errorMessage ?
          <View style={{height:32}}>
            <Text style={{color:'red'}}>{errorMessage}</Text>
          </View> :
          <View style={{height:32}}><Text style={{color:theme.colors.background}}>peco</Text></View>
        }

        { loading ? 
          <ActivityIndicator /> :
          <>
            {
              succesMessage ?
              <Text style={styles.succesMessage}>{succesMessage}</Text> :
              <FillButton 
                title='CHANGE PASSWORD'
                onPress={resetPassword}
              />
            } 
          </>
        }

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal:14,
    paddingBottom:24,
    alignItems: 'center'
  },
  card : {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    width: '100%',
    shadowColor: 'black',
    shadowRadius: 2.5,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 0},
  },
  name: {
    color: theme.colors.infoText,
    fontSize: 18
  },
  subtitle: {
    color: theme.colors.infoText,
    alignSelf: 'flex-start',
    fontSize: 14,
    marginTop:32,
    marginBottom:12 
  },
  settingTitle: {
    color: theme.colors.text,
    fontSize:18,
    paddingLeft:12
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16
  },
  border: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  succesMessage: {
    marginTop:6,
    color: theme.colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    fontSize:16,
    width: '100%',
    borderBottomWidth:0.5,
    borderColor: theme.colors.text, 
    padding:8,
    paddingHorizontal:4,
    color: theme.colors.text
  },
  screenTitle: {
    fontWeight: '600', 
    letterSpacing: 1, 
    color: theme.colors.text, 
    fontSize: 16
  }
})

export default ResetPassword