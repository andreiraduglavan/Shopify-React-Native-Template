import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import { theme } from '../constants/theme'
import { LoginStackParamList, StackParamList } from '../types/navigation'
import { NavigationContainer } from '@react-navigation/native'

import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import VerifyEmail from './VerifyEmail'
import ForgotPasswordEmailSent from './ForgotPasswordEmailSent'
import { useEffect, useState } from 'react'

type Props = NativeStackScreenProps<StackParamList, 'LoginStackNavigator'>

const LoginStack = createNativeStackNavigator<LoginStackParamList>()

const LoginStackNavigator = ({route}: Props) => {
  const { screen } = route.params
  const [initialRouteName, setInitialRouteName] = useState<'Login' | 'Register'>(screen)
  
  useEffect(() => {
    setInitialRouteName(screen)
  }, [screen])

  return (
    <NavigationContainer theme={theme} independent={true}>
      <LoginStack.Navigator initialRouteName={initialRouteName}>
        <LoginStack.Screen 
          name='Login' 
          component={Login}
          options={{ 
            headerShown: false
          }} 
        />
        <LoginStack.Screen 
          name='Register' 
          component={Register}
          options={{ 
            headerShown: false
          }} 
        />
        <LoginStack.Screen 
          name='ForgotPassword' 
          component={ForgotPassword}
          options={{ 
            headerShown: false
          }} 
        />
        <LoginStack.Screen 
          name='ForgotPasswordEmailSent' 
          component={ForgotPasswordEmailSent}
          options={{ 
            headerShown: false
          }} 
        />
        <LoginStack.Screen 
          name='VerifyEmail' 
          component={VerifyEmail}
          options={{ 
            headerShown: false
          }} 
          initialParams={{message: ''}}
        />
      </LoginStack.Navigator>
    </NavigationContainer>
  )
}

export default LoginStackNavigator