import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, Platform, Image, ActivityIndicator, Switch } from 'react-native'
import { useRef, useState } from 'react'
import { theme } from '../constants/theme'
import { useAuthContext } from '../context/AuthContext'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { LoginStackParamList } from '../types/navigation'
import logoDark from '../../assets/logo-dark.png'
import logo from '../../assets/logo.png'
import FillButton from '../components/shared/FillButton'
import { useNavigationContext } from '../context/NavigationContext'
import { config } from '../../config'

type Props = NativeStackScreenProps<LoginStackParamList, 'Register'>

const Register = ({ navigation }: Props) => {
  const { signUp } = useAuthContext()
  const { rootNavigation } = useNavigationContext()
  const scrollRef = useRef<ScrollView>()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [acceptsMarketing, setAcceptsMarketing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSignUp = async () => {
    setLoading(true)
    setErrorMessage(null)

    if (verifyPassword != password) {
      setErrorMessage('Please make sure that passwords match. Try again.')
      setLoading(false)
      return
    }

    try {
      await signUp(firstName, lastName, email, password, acceptsMarketing)
      rootNavigation.goBack()
    } catch (error: any) {
      error.code === 'CUSTOMER_DISABLED' && navigation.push('VerifyEmail', { message: error.message })
      typeof error.message === 'string' && setErrorMessage(error.message)
    }

    setLoading(false)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'position' : 'height'}>
      <ScrollView 
        scrollEnabled={Platform.OS == 'ios' ? false : true}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        <View style={styles.container} >
          <Image source={theme.dark == true ? logoDark : logo} style={styles.image}/>

          { errorMessage ?
            <View style={{height:32, justifyContent: 'flex-end'}}>
              <Text style={{color:'red'}}>{errorMessage}</Text>
            </View> :
            <View style={{height:32}}><Text style={{color:theme.colors.background}}>peco</Text></View>
          }

          <TextInput 
            placeholder='First Name'
            placeholderTextColor={theme.colors.disabledText}
            keyboardType='default'
            style={[styles.input, {marginTop: 0}]}
            onChangeText={(text: string) => setFirstName(text)}
            autoCapitalize='words'
            value={firstName}
            onFocus={() => Platform.OS == 'android' && scrollRef.current.scrollTo({y: 280, animated: true})}
          />
          <TextInput 
            placeholder='Last Name'
            placeholderTextColor={theme.colors.disabledText}
            keyboardType='default'
            style={styles.input}
            onChangeText={(text: string) => setLastName(text)}
            autoCapitalize='words'
            value={lastName}
            onFocus={() => Platform.OS == 'android' && scrollRef.current.scrollTo({y: 280, animated: true})}
          />
          <TextInput 
            placeholder='Email'
            placeholderTextColor={theme.colors.disabledText}
            keyboardType='email-address'
            style={styles.input}
            onChangeText={(text: string) => setEmail(text)}
            autoCapitalize='none'
            value={email}
            onFocus={() => Platform.OS == 'android' && scrollRef.current.scrollTo({y: 280, animated: true})}
          />
          <TextInput 
            placeholder='Password'
            placeholderTextColor={theme.colors.disabledText}
            keyboardType='default'
            style={styles.input}
            onChangeText={(text: string) => setPassword(text)}
            autoCapitalize='none'
            value={password}
            secureTextEntry={true}
            onFocus={() => Platform.OS == 'android' && scrollRef.current.scrollTo({y: 280, animated: true})}
          />
          <TextInput 
            placeholder='Confirm Password'
            placeholderTextColor={theme.colors.disabledText}
            keyboardType='default'
            style={[styles.input, {marginBottom: 16}]}
            onChangeText={(text: string) => setVerifyPassword(text)}
            autoCapitalize='none'
            value={verifyPassword}
            secureTextEntry={true}
            onFocus={() => Platform.OS == 'android' && scrollRef.current.scrollTo({y: 280, animated: true})}
          />
          <View style={styles.acceptsMarketingContainer}>
            <Switch 
              onValueChange={value => setAcceptsMarketing(value)}
              value={acceptsMarketing}
              
            />
            <Text style={styles.acceptsMarketingText}>Subscribe to our newsletter</Text>
          </View>

          { loading ? 
            <ActivityIndicator /> :
            <FillButton 
              title='REGISTER'
              onPress={onSignUp}
            />
          }

          <Text style={{marginVertical: 24, color:theme.colors.infoText}}>
            Already have an account?
            <Text 
              style={{color:theme.colors.primary, fontWeight:'500', marginLeft:4}} 
              onPress={() => { navigation.navigate('Login')} }
            >
              {' '}Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 52,
  },
  text: {
    color: theme.colors.text
  },
  acceptsMarketingText: {
    color: theme.colors.text,
    letterSpacing: 0.8,
    marginLeft: 8
  },
  image: {
    width: config.logoWidth,
    height: config.logoWidth * config.logoSizeRatio,
  },
  acceptsMarketingContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 24, 
    width: '75%'
  },
  input: {
    marginTop:16,
    fontSize:16,
    width: '75%',
    borderBottomWidth:0.5,
    borderColor: theme.colors.text, 
    padding:8,
    paddingHorizontal:4,
    color: theme.colors.text
  }
}
)