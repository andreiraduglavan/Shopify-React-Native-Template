import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { theme } from '../constants/theme'
import { MenuStackParamList } from '../types/navigation'
import { storefrontApiClient } from '../utils/storefrontApiClient'
import { FontAwesome } from '@expo/vector-icons'

type Props = NativeStackScreenProps<MenuStackParamList, 'Menu'>

const Menu = ({navigation}: Props) => {
  const [collections, setCollections] = useState<any[]>([])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.screenTitle}>Catalog</Text>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{padding: 6}}
          onPress={() => navigation.push('Wishlist') }
        >
          <FontAwesome name="heart-o" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      )
    })
  }, [])

  const fetchCollections = async () => {
    try {
      const query = `query {
        collections(first: 200) {
          nodes {
            id
            title
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
    <View style={{flex:1}}>
      <FlatList
        data={collections}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.push('Collection', { collectionId: item.id }) }>
            <Text style={styles.text}>{item.title.toUpperCase()}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.container}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center'
  },
  text: {
    letterSpacing: 1.5,
    fontWeight: '300',
    color: theme.colors.text,
    marginTop:8
  },
  screenTitle: {
    fontWeight: '600', 
    letterSpacing: 1, 
    color: theme.colors.text, 
    fontSize: 16
  }
})

export default Menu