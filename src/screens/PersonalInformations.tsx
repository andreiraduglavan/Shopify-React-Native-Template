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

type Props = NativeStackScreenProps<ProfileStackParamList, 'PersonalInformations'>

const PersonalInformations = ({navigation}: Props) => { 
  const { userToken, dispatch } = useAuthContext()
  const [email, setEmail] = useState(userToken.customer?.email || '')
  const [firstName, setFirstName] = useState(userToken.customer?.firstName || '')
  const [lastName, setLastName] = useState(userToken.customer?.lastName || '')
  const [phone, setPhone] = useState(userToken.customer?.phone || '')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [succesMessage, setSuccesMessage] = useState<string | null>(null)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.screenTitle}>Personal Informations</Text>
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
  

  const changeInfo = async () => {
    setLoading(true)
    setErrorMessage(null)
    setSuccesMessage(null)

    if (firstName=='') {
      setErrorMessage("First Name field shouldn't be empty")
      setLoading(false)
      return
    }

    if (lastName=='') {
      setErrorMessage("Last Name field shouldn't be empty")
      setLoading(false)
      return
    }

    if (!email.includes('@') && !email.includes('.')) {
      console.log(email)
      setErrorMessage('Enter a valid email.')
      setLoading(false)
      return
    }

    try {
      // await updateEmail(user!, user!.email! )
      // await updateProfile(auth.currentUser!, {displayName: name})
      // await setDoc(doc(db, 'users', user?.uid! ), {email, name})

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

      const variables = phone != "" ? {
        customerAccessToken: userToken.accessToken,
        customer: {
          lastName,
          firstName,
          phone,
          email
        }
      } : 
      {
        customerAccessToken: userToken.accessToken,
        customer: {
          lastName,
          firstName,
          email
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

      var newToken = userToken
      newToken.customer = response.data.customerUpdate.customer
      
      SecureStore.setItemAsync('userToken', JSON.stringify(newToken) )
      dispatch({ type: 'RESTORE_TOKEN', token: newToken });


      setSuccesMessage('Your personal informations has been updated successfully.')
    } catch (error: any) {
      typeof error == 'string' && setErrorMessage(error)
    }

    setLoading(false)
  }
  

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>    
      <Text style={styles.subtitle}>First Name</Text>   
      <TextInput
        placeholder='First Name' 
        placeholderTextColor={theme.colors.disabledText} 
        style={styles.input} 
        onChangeText={text => setFirstName(text) } 
        autoCapitalize={'words'} 
        value={firstName}
      />

      <Text style={styles.subtitle}>Last Name</Text>   
      <TextInput
        placeholder='Last Name'
        placeholderTextColor={theme.colors.disabledText} 
        style={styles.input} 
        onChangeText={text => setLastName(text) } 
        autoCapitalize={'words'} 
        value={lastName}
      />

      <Text style={styles.subtitle}>Phone</Text>   
      <TextInput
        placeholder='Phone'
        textContentType='telephoneNumber'
        placeholderTextColor={theme.colors.disabledText} 
        style={styles.input} 
        onChangeText={text => setPhone(text) } 
        autoCapitalize={'words'} 
        value={phone}
      />

      <Text style={[styles.subtitle, {marginTop:12}]}>Email</Text>
      <TextInput
        placeholder='Email' 
        textContentType='emailAddress'
        placeholderTextColor={theme.colors.disabledText} 
        style={[styles.input, { marginBottom:8 }]} 
        onChangeText={text => setEmail(text) } 
        autoCapitalize={'none'} 
        value={email}
      />

      { errorMessage ?
        <View style={{height:32}}>
          <Text style={{color:'red'}}>{errorMessage}</Text>
        </View> :
        <View style={{height:32}}><Text style={{color:theme.colors.background}}>peco</Text></View>
      }
      
      <View style={{paddingBottom:156, width:'100%'}}>
        { loading ? 
          <ActivityIndicator /> :
          <>
            {
              succesMessage ?
              <Text style={styles.succesMessage}>{succesMessage}</Text> :
              <FillButton 
                title='CHANGE PERSONAL INFORMATIONS'
                onPress={changeInfo}
              />
            } 
          </>
        }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    //flex:1,
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
    marginTop: 24
  },
  settingTitle: {
    color: theme.colors.text,
    fontSize: 18,
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
  input: {
    fontSize:16,
    width: '100%',
    borderBottomWidth:0.5,
    borderColor: theme.colors.text, 
    padding:8,
    paddingHorizontal:4,
    color: theme.colors.text
  },
  succesMessage: {
    marginTop:6,
    color: theme.colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  screenTitle: {
    fontWeight: '600', 
    letterSpacing: 1, 
    color: theme.colors.text, 
    fontSize: 16
  }
})

export default PersonalInformations