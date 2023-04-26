import { View, Text, ScrollView, TextInput, StyleSheet, ActivityIndicator, Image } from 'react-native'
import { useState } from 'react'
import logoDark from '../../assets/logo-dark.png'
import logo from '../../assets/logo.png'
import { theme } from '../constants/theme'
import { LoginStackParamList } from '../types/navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { storefrontApiClient } from '../utils/storefrontApiClient'
import FillButton from '../components/shared/FillButton'
import { config } from '../../config'

export type Props = NativeStackScreenProps<LoginStackParamList, 'ForgotPassword'>

const ForgotPassword = ({navigation}: Props) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>()

  const resetPasswordButton = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      // await sendPasswordResetEmail(auth, email)
      const query = `mutation recoverCustomerAccount($email: String!) {
        customerRecover(email: $email) {
          customerUserErrors {
            code
            field
            message
          }
        }
      }`

      const variables = { email }

      const response: any = await storefrontApiClient(query, variables)
      
      if (response.errors && response.errors.length != 0) {
        throw response.errors[0].message
      }
      
      if (response.data.customerRecover.customerUserErrors.length != 0) {
        console.log(response.data.customerRecover.customerUserErrors)
        throw response.data.customerRecover.customerUserErrors[0].message
      }

      navigation.push('ForgotPasswordEmailSent')
    } catch (error: any) {
      typeof error === 'string' && setErrorMessage(error)
    }

    setLoading(false)
  }

  return (
    <ScrollView scrollEnabled={false}>
      <View style={styles.container} >
        <Image source={theme.dark == true ? logoDark : logo} style={styles.image}/>

        {/* { errorMessageStatus ?
          <View style={{height:32}}>
            <Text style={{color:'red'}}>{errorMessage}</Text>
          </View> :
          <View style={{height:32}}><Text style={{color:COLORS.background}}>peco</Text></View> */
        }

        { errorMessage ?
          <View style={{height:32}}>
            <Text style={{color:'red'}}>{errorMessage}</Text>
          </View> :
          <View style={{height:32}}><Text style={{color:theme.colors.background}}>peco</Text></View>
        }

        <TextInput 
          placeholder='Email' 
          placeholderTextColor={theme.colors.disabledText} 
          style={styles.input} 
          onChangeText={(text: string) => setEmail(text) } 
          autoCapitalize={'none'} 
          value={email}
        />

        { loading ? 
          <ActivityIndicator /> :
          <FillButton 
            title='RESET PASSWORD'
            onPress={resetPasswordButton}
          />
        }

      <Text 
        style={{color:theme.colors.primary, fontWeight:'500', marginLeft:4, marginTop:64, fontSize:16}} 
        onPress={() => { navigation.navigate('Login')} }
      >
        Go Back
      </Text>

      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container: {
      flex:1,
      alignItems: 'center',
      paddingTop: 32,
    },
    text: {
      color: theme.colors.text
    },
    image: {
      width: config.logoWidth,
      height: config.logoWidth * config.logoSizeRatio,
      marginBottom: 48,
    },
    input: {
      marginTop:16,
      fontSize:16,
      width: '75%',
      borderBottomWidth:0.5,
      borderColor: theme.colors.text, 
      padding:8,
      paddingHorizontal:4,
      marginBottom: 32,
      color: theme.colors.text
    }
  }
)

export default ForgotPassword