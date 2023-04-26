import { StyleSheet, Dimensions, Image, FlatList, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../types/navigation'
import { hasHomeIndicator, theme } from '../constants/theme'
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet"
import FillButton from '../components/shared/FillButton'
import OutlineButton from '../components/shared/OutlineButton'
import { storefrontApiClient } from '../utils/storefrontApiClient'
import { CartItem, Product } from '../types/dataTypes'
import ProductCard from '../components/shared/ProductCard'
import { useCartContext } from '../context/CartContext'
import { FontAwesome } from '@expo/vector-icons'
import { useWishlistContext } from '../context/WishlistContext'

const screenWidth = Dimensions.get('screen').width
const windowHeight = Dimensions.get('window').height

type Props = NativeStackScreenProps<StackParamList, 'ProductScreen'>

const ProductScreen = ({route, navigation}: Props) => {
  const { wishlist, addItemToWishlist, removeItemFromWishlist } = useWishlistContext()
  const { data } = route.params
  const { addItemToCart } = useCartContext()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          { wishlist.includes(data.id) ?
            <TouchableOpacity
              style={{padding: 6}}
              onPress={() => removeItemFromWishlist(data.id) }
            >
              <FontAwesome name="heart" size={22} color='black' />
            </TouchableOpacity> :
            <TouchableOpacity
            style={{padding: 6}}
            onPress={() => addItemToWishlist(data.id) }
          >
            <FontAwesome name="heart-o" size={22} color='black' />
          </TouchableOpacity>
          }
        </>
      )
    })
  }, [wishlist])

  useEffect(() => {
    try {
      getProductRecommendations()
    } catch (e) {
      setTimeout(() => {
        getProductRecommendations()
      }, 5000)
      console.log(e)
    }

  }, [])

  const [selectedOptions, setSelectedOptions] = useState<{name: string; value: string | null}[]>(
    data.options.map((option) => (
      {
        name: option.name, 
        value: option.values.length == 1 ? option.values[0] : null 
      }
    ) 
  ))
  
  const selectedItem = useMemo(() => data.variants.nodes.find((item) => {
    return item.selectedOptions.every((option, index) => {
      if (option.value != selectedOptions[index].value) {
        return false
      }
      return true
    })
  }) || null, [selectedOptions])
  const noVariants = useMemo(() => data.variants.nodes.length <= 1 && data.variants.nodes[0].selectedOptions.length <= 1 && data.variants.nodes[0].selectedOptions[0].value == 'Default Title', [data])

  var bottomSheetMode: 'add' | 'buy' = 'add'
  const [bottomSheetModeState, setBottomSheetModeState] = useState<'add' | 'buy'>('add')
  const snapPoints = useMemo(() => [124, "90%"], [])
  const snapPoints2 = useMemo(() => [220], [])
  const snapPoints3 = useMemo(() => [240], [])
  const sheetRef2 = useRef<BottomSheet>(null)
  const sheetRef3 = useRef<BottomSheet>(null)
  const showBuyBottomSheet = useCallback(() => {
    sheetRef2.current?.snapToIndex(0)
  }, [])
  
  const [productRecommendations, setProductRecommendations] = useState<Product[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getProductRecommendations = async () => {
    
    const query = `query getProductRecommendations {
      productRecommendations(productId: "${data.id}") {
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
      throw response.errors[0].message
    }

    setProductRecommendations(response.data.productRecommendations.slice(0,4) as Product[])
  }

  const addToCart = async () => {
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      const query = `query getProductById($id: ID!) {
        product(id: $id) {
          variantBySelectedOptions(selectedOptions: ${JSON.stringify(selectedOptions).replaceAll(`"name"`, `name`).replaceAll(`"value"`, `value`)}) {
            id
            title
            image {
              url
              width
              height
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            product {
              title
            }
            availableForSale
            quantityAvailable
            selectedOptions {
              value
            }
          }
        }
      }`
  
      const variables = { id: data.id}
  
      const response: any = await storefrontApiClient(query, variables)
  
      if (response.errors && response.errors.length != 0 ) {
        throw response.errors[0].message
      }
  
      addItemToCart(response.data.product.variantBySelectedOptions as CartItem)
      //console.log(bottomSheetMode)
      if (bottomSheetMode == 'buy') {
        navigation.goBack()
        navigation.push('Cart')
      } else {
        sheetRef3.current.snapToIndex(0)
        sheetRef2.current.close()
      }

    } catch (e) {
      if (typeof e == 'string') {
        setErrorMessage(e)
      } else {
        setErrorMessage('Something went wrong. Try again.')
      }
    }

    setIsLoading(false)
  }
  
  return (
    <View style={{marginBottom: hasHomeIndicator ? 14 : 0}}>
      <FlatList 
        data={data.images.nodes || []}
        renderItem={({item}) => <Image source={{uri: item.url}} style={styles.image} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:120}}
      />

      <BottomSheet
        snapPoints={snapPoints}
        style={{backgroundColor: theme.colors.background}}
        handleIndicatorStyle={{backgroundColor: theme.colors.text, borderRadius: 0, height: 2}}
        backgroundComponent={() => <View style={{backgroundColor: theme.colors.background}}></View>}
      >
        <BottomSheetScrollView 
          style={styles.container} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{backgroundColor: theme.colors.background}}
        >
          <View style={{marginRight: 14}}>
            <Text style={styles.title}>{data.title.toUpperCase()}</Text>
            <Text style={styles.price}>{data.priceRange.minVariantPrice.amount} RON</Text>
            { data.availableForSale ?
              <>
                { isLoading ? 
                  <ActivityIndicator size='small' style={{alignSelf: 'center', marginTop: 30.5}} /> :
                  <> 
                    { noVariants && errorMessage != '' ?
                      <Text style={{color: 'red', alignSelf: 'center', marginTop: 24}}>{errorMessage}</Text> :
                      <View style={styles.buttonsContainer}>
                        <OutlineButton 
                          onPress={() => { 
                            bottomSheetMode = 'add'
                            setBottomSheetModeState('add')
                            if (!noVariants) {
                              setTimeout(() => showBuyBottomSheet(), 1)
                            } else {
                              addToCart()
                            }
                          }} 
                          title='ADD TO CART' 
                        />
                        <View style={{marginLeft:16}}></View>
                        <FillButton 
                          onPress={() => { 
                            bottomSheetMode = 'buy'
                            setBottomSheetModeState('buy')
                            if (!noVariants) {
                              setTimeout(() => showBuyBottomSheet(), 1)
                            } else {
                              addToCart()
                            }
                          }} 
                          title='BUY IT NOW' 
                        />
                      </View>
                    }
                  </>
                }
              </> :
              <Text style={[styles.text, {marginTop: 32}]}>Out of stock.</Text>
            }
            
            { data.description.length != 0 && <Text style={styles.subTitle}>DESCRIPTION</Text> }
            { data.description.length != 0 && <Text style={styles.subTitle}>{data.description}</Text> }
            {/* <Text style={styles.subTitle}>VENDOR: {data.vendor.toUpperCase()}</Text> */}
            <Text style={styles.subTitle}>DISCOVER MORE</Text>
          </View>

          <FlatList 
            data={productRecommendations}
            scrollEnabled={false}
            renderItem={({item}) => <ProductCard data={item} /> }
            keyboardDismissMode='on-drag'
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{paddingTop: 16}}
          />
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet 
        snapPoints={snapPoints2}
        index={-1}
        enablePanDownToClose={true}
        ref={sheetRef2}
        style={{backgroundColor: theme.colors.background}}
        handleIndicatorStyle={{backgroundColor: theme.colors.text, borderRadius: 0, height: 2}}
        backgroundComponent={() => <View style={{backgroundColor: theme.colors.background}}></View>}
      >
        <BottomSheetView style={{flex:1, marginHorizontal: 14, paddingBottom: 14, justifyContent: 'space-between'}}>
          
          <View>
          { data.options.map((option, index) => (
            <View 
              style={{marginTop: 4}} 
              key={option.id}
            >
              <Text style={styles.optionTitle}>{option.name}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginHorizontal:-14}}
              >
                {
                  option.values.map((item) => (
                    <TouchableOpacity 
                      onPress={() => setSelectedOptions(selectedOptions => selectedOptions.map( selectedOption => 
                        selectedOption.name == option.name ? 
                        {name: selectedOption.name, value: item} : 
                        {name: selectedOption.name, value: selectedOption.value}
                      ))}
                      key={item} 
                    >
                      <Text 
                        style={[
                          styles.optionValue, 
                          selectedOptions[index].value == item ? {backgroundColor: theme.colors.text, color: theme.colors.background } : null 
                        ]} 
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))
                }
              </ScrollView>
            </View>
          ))}
          </View>
          
          <View style={{marginBottom: 16}}></View>
          { bottomSheetModeState == 'buy' ? 
            <>
              { selectedItem ?
                <>
                  { selectedItem.availableForSale ?
                    <>
                      { isLoading ? 
                        <ActivityIndicator size='small' style={{alignSelf: 'center'}} /> :
                        <>
                          { errorMessage != '' ?
                            <Text style={{color: 'red', alignSelf: 'center'}}>{errorMessage}</Text> :
                            <FillButton 
                              onPress={() => {
                                bottomSheetMode = 'buy'
                                addToCart()
                              }}  
                              title='BUY IT NOW' 
                            />
                          }
                        </>
                      }
                    </> :
                    <Text style={styles.text}>Out of stock.</Text>
                  }
                </> :
                <Text style={styles.text}>Make a selection.</Text>
              }
            </> :
            <>
              { selectedItem ?
                <>
                  { selectedItem.availableForSale ?
                    <>
                      { isLoading ? 
                        <ActivityIndicator size='small' style={{alignSelf: 'center'}} /> :
                        <>
                          { errorMessage != '' ?
                            <Text style={{color: 'red', alignSelf: 'center'}}>{errorMessage}</Text> :
                            <OutlineButton 
                              onPress={() => {
                                bottomSheetMode = 'add'
                                addToCart()
                              }}  
                              title='ADD TO CART' 
                            />
                          }
                        </>
                      }
                    </> :
                    <Text style={styles.text}>Out of stock.</Text>
                  }
                </> :
                <Text style={styles.text}>Make a selection.</Text>
              }
            </>
          }
        </BottomSheetView>
      </BottomSheet>

      {/* Succesfully added to the cart message bottom sheet. */}
      <BottomSheet 
        snapPoints={snapPoints3}
        index={-1}
        enablePanDownToClose={true}
        ref={sheetRef3}
        style={{backgroundColor: theme.colors.background}}
        handleIndicatorStyle={{backgroundColor: theme.colors.text, borderRadius: 0, height: 2}}
        backgroundComponent={() => <View style={{backgroundColor: theme.colors.background}}></View>}
      >
        <BottomSheetView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.text}>Item was added succesfully to the cart.</Text>
          <TouchableOpacity onPress={() => {
            navigation.goBack()
            navigation.push('Cart')
          }}>
            <Text style={[styles.text, {marginTop:8, fontWeight: '600', paddingBottom: 24}]}>Visualize</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.text,
    letterSpacing: 1.5,
    alignSelf: 'center'
  },
  image: {
    width: screenWidth,
    height: windowHeight-100,
  },
  container: {
    flex:1,
    marginHorizontal:14,
    backgroundColor: theme.colors.background
  },
  title: {
    color: theme.colors.text,
    fontWeight: '300',
    letterSpacing: 1.5,
    fontSize: 12
  },
  subTitle: {
    color: theme.colors.text,
    fontWeight: '300',
    letterSpacing: 1.5,
    fontSize: 12,
    marginTop: 16,
  },
  optionTitle: {
    color: theme.colors.text,
    letterSpacing: 1.5,
    marginTop: 4
  },
  optionValue: {
    color: theme.colors.text,
    letterSpacing: 1.5,
    marginLeft:6,
    marginTop: 8,
    marginBottom: 5.5,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  price: {
    color: theme.colors.text,
    fontWeight: '400',
    letterSpacing: 1.5,
    fontSize: 12,
    marginTop: 4
  },
  buttonsContainer: {
    flexDirection:'row',
    marginTop: 24
  }
})

export default ProductScreen