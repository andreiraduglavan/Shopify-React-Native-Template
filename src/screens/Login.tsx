import { useRef, useState } from 'react'
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Image, ActivityIndicator, TextInput } from 'react-native'
import { useAuthContext } from '../context/AuthContext'
import logoDark from '../../assets/logo-dark.png'
import logo from '../../assets/logo.png'
import { theme } from '../constants/theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { LoginStackParamList } from '../types/navigation'
import FillButton from '../components/shared/FillButton'
import { useNavigationContext } from '../context/NavigationContext'
import { config } from '../../config'

type Props = NativeStackScreenProps<LoginStackParamList, 'Login'>

const Login = ({navigation}: Props) => {
  const { rootNavigation } = useNavigationContext()
  const scrollRef = useRef<ScrollView>()
  const { signIn } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>()

  const signInButton = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      await signIn(email, password)
      rootNavigation.goBack()
    } catch (error: any) {
      typeof error === 'string' && setErrorMessage(error)
    }

    setLoading(false)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'position' : 'height'} >
      <ScrollView 
        scrollEnabled={Platform.OS == 'ios' ? false : true}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        <View style={styles.container} >
          <Image source={theme.dark == true ? logoDark : logo} style={styles.image}/>

          { errorMessage ?
            <View style={{height:32}}>
              <Text style={{color:'red'}}>{errorMessage}</Text>
            </View> :
            <View style={{height:32}}><Text style={{color:theme.colors.background}}>peco</Text></View>
          }

          <TextInput 
            placeholder='Email'
            placeholderTextColor={theme.colors.disabledText}
            keyboardType='email-address'
            style={styles.input}
            onChangeText={(text: string) => setEmail(text)}
            autoCapitalize='none'
            value={email}
            onFocus={() => Platform.OS == 'android' && scrollRef.current.scrollTo({y: 100, animated: true})}
          />
          <TextInput 
            placeholder='Password'
            placeholderTextColor={theme.colors.disabledText}
            keyboardType='default'
            style={[styles.input, {marginBottom: 56}]}
            onChangeText={(text: string) => setPassword(text)}
            autoCapitalize='none'
            value={password}
            secureTextEntry={true}
            onFocus={() => Platform.OS == 'android' && scrollRef.current.scrollTo({y: 100, animated: true})}
          />

          { loading ? 
            <ActivityIndicator /> :
            <FillButton 
              title='LOGIN'
              onPress={signInButton}
            />
          }

          <Text style={{marginTop: 16, color:theme.colors.infoText}}>
            Don't have an account?
            <Text 
              style={{color:theme.colors.primary, fontWeight:'500', marginLeft:4}} 
              onPress={() => { navigation.push('Register')} }
            >
              {' '}Register
            </Text>
          </Text>

          <Text 
            style={{color:theme.colors.primary, fontWeight:'500', marginLeft:4, marginTop:6, paddingBottom:24}} 
            onPress={() => { navigation.push('ForgotPassword')} }
          >
            Forgot Password?
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 56
    
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
    color: theme.colors.text
  }
}
)