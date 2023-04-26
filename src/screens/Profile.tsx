import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { theme } from '../constants/theme'
import { ProfileStackParamList } from '../types/navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Entypo } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigationContext } from '../context/NavigationContext'
import { useAuthContext } from '../context/AuthContext'
import * as WebBrowser from 'expo-web-browser'
import { config } from '../../config'

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>

const Profile = ({ navigation }: Props) => {
  const { userToken, signOut } = useAuthContext()
  const { rootNavigation } = useNavigationContext()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          { userToken ?
            <TouchableOpacity onPress={() => signOut() }>
              <Text style={styles.textButton}>LOG OUT</Text>
            </TouchableOpacity> :
            <TouchableOpacity onPress={() => rootNavigation.push('LoginStackNavigator', { screen: 'Login' })}>
              <Text style={styles.textButton}>LOG IN</Text>
            </TouchableOpacity>
          }
        </>
      )
    })
  }, [userToken])

  const deleteAccount = () => {
    Alert.alert(
      'Delete Account', 
      'Are you sure that you want to delete your account? Please note that there is no option to restore your account or its data. You would still be able to check your order status using its order number.',
      [
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => signOut()
        },
        { 
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    )
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Welcome back{userToken && `, ${userToken.customer.firstName}`}!</Text>

      <View style={{marginBottom: 16}}>
        <TouchableOpacity 
          style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          onPress={() => navigation.push('Wishlist') }
        >
          <Text style={styles.settingTitle}>Wishlist</Text>
          <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          onPress={() => {
            if (userToken) {
              navigation.push('Orders')
            } else {
              rootNavigation.push('LoginStackNavigator', { screen: 'Login'})
            }
          }}
        >
          <Text style={styles.settingTitle}>My orders</Text>
          <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
        </TouchableOpacity>

      </View>

      <Text style={styles.subTitle}>Social Media</Text>
      <View style={{marginBottom: 16}}>
        <TouchableOpacity 
          style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          onPress={() => Linking.openURL(`instagram://user?username=${config.instagramUsername}`) } 
        >
          <Text style={styles.settingTitle}>Instagram</Text>
          <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
        </TouchableOpacity>
        {/* <TouchableOpacity 
          style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          onPress={() => {}}
        >
          <Text style={styles.settingTitle}>Facebook</Text>
          <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
        </TouchableOpacity> */}
      </View>
      
      { userToken &&
        <>
          <Text style={styles.subTitle}>Account Settings</Text>
          <View style={{marginBottom: 16}}>
            <TouchableOpacity 
              style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
              onPress={() => navigation.push('PersonalInformations')}
            >
              <Text style={styles.settingTitle}>Personal Informations</Text>
              <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
              onPress={() => navigation.push('ResetPassword') }
            >
              <Text style={styles.settingTitle}>Change Password</Text>
              <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
            </TouchableOpacity>
          </View>
        </>        
      }

      <Text style={styles.subTitle}>Customer Support</Text>
      <View style={{marginBottom: 16}}>
        <TouchableOpacity 
          style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          onPress={() => WebBrowser.openBrowserAsync('https://juet.ro/pages/contact') }
        >
          <Text style={styles.settingTitle}>Contact</Text>
          <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          onPress={() => WebBrowser.openBrowserAsync('https://juet.ro/policies/terms-of-service') }
        >
          <Text style={styles.settingTitle}>Terms of Service</Text>
          <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          onPress={() => WebBrowser.openBrowserAsync('https://juet.ro/policies/refund-policy') }
        >
          <Text style={styles.settingTitle}>Refund Policy</Text>
          <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
          onPress={() => WebBrowser.openBrowserAsync('https://juet.ro/policies/privacy-policy') }
        >
          <Text style={styles.settingTitle}>Privacy Policy</Text> 
          <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
        </TouchableOpacity>
      </View>

      { userToken && 
        <>
          <Text style={styles.subTitle}>Delete Account</Text>
          <TouchableOpacity 
            style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
            onPress={deleteAccount}
          >
            <Text style={styles.settingTitle}>Delete Account</Text>
            <Entypo name={`chevron-small-right`} size={24} color={theme.colors.infoText} />
          </TouchableOpacity>
        </>
      }

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal: 14,
    paddingTop: 16
  },
  greeting: {
    color: theme.colors.text,
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 32
  },
  text: {
    color: theme.colors.text
  },
  textButton: {
    color: theme.colors.text,
    letterSpacing: 0.5,
    fontSize: 15,
    fontWeight: '500'
  },
  subTitle: {
    color: theme.colors.infoText,
    letterSpacing: 1,
  },
  settingTitle: {
    color: theme.colors.text,
    letterSpacing: 1.8,
    fontSize: 16,
    paddingVertical: 8
  }
})

export default Profile