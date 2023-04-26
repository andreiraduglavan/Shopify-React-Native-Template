import { View, Text, StyleSheet, ActivityIndicator, Platform, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ProfileStackParamList } from '../types/navigation'
import { theme } from '../constants/theme'
import { BackArrowIcon } from '../components/shared/Icons'
import { useWishlistContext } from '../context/WishlistContext'
import { Product } from '../types/dataTypes'
import { storefrontApiClient } from '../utils/storefrontApiClient'
import ProductCard from '../components/shared/ProductCard'
import { FlatList } from 'react-native'

type Props = NativeStackScreenProps<ProfileStackParamList, 'Wishlist'>

const Wishlist = ({ navigation }: Props) => {
  const { wishlist } = useWishlistContext()
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.screenTitle}>Wishlist</Text>
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

  const getProduct = async (productId: string) => {
    var p = new Promise(async (resolve: any, reject: any) => {
      const query = `query getProductById {
        product(id: "${productId}") {
          id
          title
          description
          vendor
          availableForSale
          options {
            id
            name
            values
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first:200) {
            nodes {
              availableForSale
              selectedOptions {
                value
              }
            }
          }
          images(first: 10) {
            nodes {
              url
              width
              height
            }
          }
        }
      }`
       
      const response: any = await storefrontApiClient(query)
      if (response.errors && response.errors.length != 0 ) {
        reject(response.errors[0].message)
        return
      }

      resolve(response.data.product)
    })
    
    return p
  }

  const getProducts = async () => {
    setIsLoading(true)
    var updatedWishlishProducts: Product[] = []
    
    for await (const productId of wishlist) {
      try {
        const product = await getProduct(productId) as Product
        updatedWishlishProducts.push(product)
      } catch (e) {
        console.log(e)
      }  
    }

    setWishlistProducts(updatedWishlishProducts)
    setIsLoading(false)
  }

  useEffect(() => {
    getProducts()
  }, [wishlist])

  return (
    <>
      { isLoading ?
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='small' />
        </View> :
        <>
          { wishlistProducts.length != 0 ?
            <FlatList 
              data={wishlistProducts}
              renderItem={({item}) => <ProductCard data={item} /> }
              keyboardDismissMode='on-drag'
              showsVerticalScrollIndicator={false}
              numColumns={2}
              contentContainerStyle={styles.container}
            /> :
            <ScrollView 
              contentContainerStyle={{flex:1, justifyContent: 'center', alignItems: 'center'}}
              scrollEnabled={false}
              keyboardDismissMode='on-drag'
            >
              <Text style={styles.text}>No items added yet.</Text>
            </ScrollView>
          }
        </>
      }
    </>
  )
}

export default Wishlist

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingLeft:14,
  },
  screenTitle: {
    fontWeight: '600', 
    letterSpacing: 1, 
    color: theme.colors.text, 
    fontSize: 16
  },
  text: {
    color: theme.colors.text,
    letterSpacing: 1.8
  },
})