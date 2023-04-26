import { useContext, createContext, useState, useEffect } from "react"
import { CartItem } from "../types/dataTypes"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { storefrontApiClient } from "../utils/storefrontApiClient"

type CartContextType = {
  resetCart: () => void
  getItemsCount: () => number
  getTotalPrice: () => number
  cartItems: CartItem[]
  addItemToCart: (item: CartItem) => void
  removeItemFromCart: (itemId: string) => void
  addQuantityOfItem: (itemId: string) => void
  substractQuantityOfItem: (itemId: string) => void
}

const Context = createContext<CartContextType | null>(null)

type Props = { children: React.ReactNode } 

export const CartContext = ({children}: Props) => { 
  const [cartItems, setcartItems] = useState<CartItem[]>([])

  const restoreCartItems = async () => {
    try {
      const restoredCartItems: { id: string, quantity: number }[] = JSON.parse(await AsyncStorage.getItem('cart'))
      var cartItems: CartItem[] = []
      
      for await (const restoredCartItem of restoredCartItems) {
        try {
          const query = `query {
            node(id: "${restoredCartItem.id}") {
              ... on ProductVariant {
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
          
          const variables = { id: restoredCartItem.id}
      
          const response: any = await storefrontApiClient(query, variables)

          if (response.errors && response.errors.length != 0 ) {
            throw response.errors[0].message
          }

          const cartItem = response.data.node as CartItem

          const notTrackingStock = cartItem.quantityAvailable <= 0 && cartItem.availableForSale

          if (!cartItem.availableForSale) {
            throw 'Variant out of stock.'
          }
          
          if (notTrackingStock) {
            cartItem.quantity = restoredCartItem.quantity
          } else {
            if ( restoredCartItem.quantity <= cartItem.quantityAvailable ) {
              cartItem.quantity = restoredCartItem.quantity
            } else {
              cartItem.quantity = cartItem.quantityAvailable
            }
          }
          
          cartItems.push(cartItem)

        } catch (e) {
          console.log(e)
        }
      }

      setcartItems(cartItems)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    restoreCartItems()
  }, [])

  useEffect(() => {
    const cartItemsToBeStored = cartItems.map((cartItem) => ({ id: cartItem.id, quantity: cartItem.quantity}) )
    AsyncStorage.setItem('cart', JSON.stringify(cartItemsToBeStored))
  }, [cartItems])

  const resetCart = () => {
    setcartItems([])
  }
  
  const getItemsCount = () => {
    var count = 0
    cartItems.forEach(item => count = count + item.quantity)
    
    return count
  }

  const getTotalPrice = () => {
    var totalPrice = 0
    cartItems.forEach(item => totalPrice = totalPrice + item.price.amount*item.quantity )
    
    return totalPrice
  }

  const addItemToCart = (item: CartItem) => {
    const index = cartItems.findIndex((arrayItem) => arrayItem.id == item.id)

    if (index == -1) {
      item.quantity = 1
      setcartItems(cartItems => [item, ...cartItems])
    }
    else {
      addQuantityOfItem(item.id)
    }
  }

  const removeItemFromCart = (itemId: string) => {
    setcartItems(cartItems => (
      cartItems.filter((item) => item.id != itemId)
    ))
  }

  const addQuantityOfItem = (itemId: string) => {
    setcartItems(cartItems => (
      cartItems.map((item) => {
        const notTrackingStock = item.quantityAvailable <= 0 && item.availableForSale
        var newQuantity: number

        if (notTrackingStock) {
          newQuantity = item.quantity+1
        } else {
          newQuantity = item.quantityAvailable <= item.quantity ? item.quantityAvailable : item.quantity+1
        }
        
        return ( 
          item.id==itemId ? {...item, quantity: newQuantity } as CartItem : item 
        )
      })
    ))
  }

  const substractQuantityOfItem = (itemId: string) => {
    const item = cartItems.find((item) => item.id == itemId)
    
    if(item.quantity == 1) {
      removeItemFromCart(itemId)
      return
    }

    setcartItems(cartItems => (
      cartItems.map((item) => {
        const newQuantity: number = item.quantity-1
        return ( 
          item.id==itemId ? {...item, quantity: newQuantity } as CartItem : item 
        )
      })
    ))
  }

  return(
    <Context.Provider value={{ resetCart, getItemsCount, getTotalPrice, cartItems, addItemToCart, addQuantityOfItem, removeItemFromCart, substractQuantityOfItem }}>
      {children}       
    </Context.Provider>
  )
}

export const useCartContext = () => {
  const cartContext = useContext(Context)

  if (!cartContext) throw new Error('You need to use this hook inside a context provider')

  return cartContext;
}