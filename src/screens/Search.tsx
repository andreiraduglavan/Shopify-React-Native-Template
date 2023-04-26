import { View, Text, StyleSheet, TextInput, Dimensions, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { theme } from '../constants/theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../types/navigation';
import { storefrontApiClient } from '../utils/storefrontApiClient';
import { Product } from '../types/dataTypes';
import ProductCard from '../components/shared/ProductCard';

type Props = NativeStackScreenProps<SearchStackParamList, 'Search'>

const Search = ({navigation}: Props) => {
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [initialProducts, setInitialProducts] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const fetchInitialProducts = async () => {
    setIsLoading(true)
    setErrorMessage('')

    const query = `{
      products(first: 64) {
        nodes {
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
      }
    }`

    const response: any = await storefrontApiClient(query)

    if (response.errors && response.errors.length != 0 ) {
      setIsLoading(false)
      throw response.errors[0].message
    }

    setInitialProducts(response.data.products.nodes as Product[])
    setProducts(response.data.products.nodes as Product[]) //

    setIsLoading(false)
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TextInput 
          placeholder='Search our store'
          placeholderTextColor={theme.colors.disabledText}
          style={styles.input}
          onChangeText={(text) => setSearchInput(text)}
          autoCapitalize='none'
        />
      )
    })

    try {
      fetchInitialProducts()
    } catch (e) {
      if (typeof e == 'string') {
        setErrorMessage(e)
      } else {
        setErrorMessage('Something went wrong. Try again.')
      }
    }  
  }, [])

  const search = async () => {
    setIsLoading(true)
    setErrorMessage('')

    const query = `{
      products(first: 64, query: "title:${searchInput}*") {
        nodes {
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
      }
    }`

    const response: any = await storefrontApiClient(query)

    if (response.errors && response.errors.length != 0 ) {
      setIsLoading(false)
      throw response.errors[0].message
    }

    setProducts(response.data.products.nodes as Product[])

    setIsLoading(false)
  }

  useEffect(() => {
    if ( searchInput.length >= 1 ) {
      try {
        search()
      } catch (e) {
        if (typeof e == 'string') {
          setErrorMessage(e)
        } else {
          setErrorMessage('Something went wrong. Try again.')
        }
      }     
    } else {
      fetchInitialProducts()
    }
  }, [searchInput])
  
  return (
    <View style={{marginTop:8, flex:1}}>
      <View style={{height:0.5, backgroundColor: theme.colors.text, marginHorizontal:14}}></View>
      { isLoading ?
        <View style={styles.activityContainer}>
          <ActivityIndicator size={'small'}/>
        </View> :
        <>
          { errorMessage != '' ?
            <Text style={styles.error}>{errorMessage}</Text> :
            <>
              { products.length != 0 ?
                <FlatList 
                  data={products}
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
                  <Text style={styles.text}>No results matching your search.</Text>
                </ScrollView>
              }
            </>
          }
        </>
      }
    </View>
  )
}

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingLeft:14,
  },
  text: {
    color: theme.colors.text,
    letterSpacing: 1.8
  },
  input: {
    marginTop:16,
    width: windowWidth-28,
    fontSize:16,
    zIndex: 10,
    padding:8,
    paddingHorizontal:4,
    color: theme.colors.text,
  },
  activityContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    color: 'red', 
    alignSelf: 'center', 
    marginTop:12
  }
})

export default Search