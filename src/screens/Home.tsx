import { View, Text, StyleSheet, Image, Dimensions, TouchableWithoutFeedback, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { hasHomeIndicator, theme } from '../constants/theme'
import { storefrontApiClient } from '../utils/storefrontApiClient'
import logoDark from '../../assets/logo-dark.png'
import logo from '../../assets/logo.png'
import SubscribeComponent from '../components/home/SubscribeComponent'
import { HomeStackParamList } from '../types/navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useAuthContext } from '../context/AuthContext'
import { config } from '../../config'

const windowHeight = Dimensions.get('window').height-50-(hasHomeIndicator ? 30 : 0)

type Props = NativeStackScreenProps<HomeStackParamList, 'Collection'>

const Home = ({navigation}: Props) => {
  const { userToken } = useAuthContext()
  const [collections, setCollections] = useState<any[]>([])

  const fetchCollections = async () => {
    try {
      const query = `query {
        collections(first: 7) {
          nodes {
            id
            title
            image {
              url
              width
            }
          }
        }
      }`
      
      const response: any = await storefrontApiClient(query)
      
      if (response.errors && response.errors.length !=0 ) {
        throw response.errors[0].message
      }

      const collections = response.data.collections.nodes
      setCollections(collections)

    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={collections}
        renderItem={({item}) => (
          <TouchableWithoutFeedback onPress={() => navigation.push('Collection', {collectionId: item.id})}>
            <View style={styles.container}>
              { item.image && <Image source={{uri: item.image.url}} style={styles.image} />} 
              <Text style={styles.collectionTitle}>{item.title.toUpperCase()}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        snapToInterval={windowHeight}
        decelerationRate='fast'
        showsVerticalScrollIndicator={false}
        keyboardDismissMode='on-drag'
        ListFooterComponent={() => (
          <>
            { userToken && userToken.customer.acceptsMarketing ?
              null :
              <SubscribeComponent />
            }
          </>
        )}
      />
      <Image source={theme.dark == true ? logoDark : logo} style={styles.logo} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    position:'relative',
    height: windowHeight
  },
  image: {
    width:'100%', 
    height:windowHeight 
  },
  text: {
    color: theme.colors.text
  },
  collectionTitle: {
    position:'absolute',
    bottom: 96,
    alignSelf: 'center',
    color: theme.colors.text,
    fontWeight: '600',
    letterSpacing: 7,
  },
  logo: {
    backgroundColor:'transparent',
    position: 'absolute',
    resizeMode:'contain',
    width: config.logoWidth,
    height: config.logoWidth * config.logoSizeRatio,
    top:72,
    left:24
  }
})

export default Home