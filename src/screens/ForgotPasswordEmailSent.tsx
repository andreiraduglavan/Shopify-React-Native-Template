import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { theme } from '../constants/theme'
import { LoginStackParamList } from '../types/navigation'
import logoDark from '../../assets/logo-dark.png'
import logo from '../../assets/logo.png'
import { config } from '../../config'

export type Props = NativeStackScreenProps<LoginStackParamList, 'ForgotPasswordEmailSent'>

const ForgotPasswordEmailSent = ({ navigation }: Props) => {
  return (
    <ScrollView scrollEnabled={false}>
      <View style={styles.container} >
        <Image source={theme.dark == true ? logoDark : logo} style={styles.image}/>
        
        <Text style={styles.text}>Check your email inbox to reset your password. Beware to check the spam or junk folder too, if you cannot found the email in inbox. </Text>

        <Text 
          style={{color:theme.colors.primary, fontWeight:'500', marginLeft:4, marginTop:64, fontSize:16}} 
          onPress={() => { navigation.navigate('Login')} }
        >
          Back to Login
        </Text>

      </View>
    </ScrollView>
  )
}

export default ForgotPasswordEmailSent

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    paddingTop: 32,
  },
  text: {
    color: theme.colors.text,
    paddingHorizontal:32,
    fontSize:16,
    textAlign: 'center'
  },
  image: {
    width: config.logoWidth,
    height: config.logoWidth * config.logoSizeRatio,
    marginBottom: 96,
  },
}
)