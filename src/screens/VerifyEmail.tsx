import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { LoginStackParamList } from '../types/navigation'
import logoDark from '../../assets/logo-juet-dark.png'
import logo from '../../assets/logo-juet.png'
import { theme } from '../constants/theme'
import { StyleSheet } from 'react-native'

export type Props = NativeStackScreenProps<LoginStackParamList, 'VerifyEmail'>;

const VerifyEmail = ({navigation, route}: Props) => {
  const { message } = route.params
  return (
    <ScrollView scrollEnabled={false}>
      <View style={styles.container} >
        <Image source={theme.dark == true ? logoDark : logo} style={styles.image}/>
        
        <Text style={styles.text}>{message} Then login to your account.</Text>

        <Text 
          style={{color:theme.colors.primary, fontWeight:'500', marginLeft:4, marginTop:64, fontSize:16}} 
          onPress={() => { navigation.navigate('Login')} }
        >
          Go back to login 
        </Text>

      </View>
    </ScrollView>
  )
}

export default VerifyEmail

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
    width:90,
    height: 90,
    marginBottom: 48,
  },
}
)