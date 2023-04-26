import { useContext, createContext, useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'

type WishlistContextType = {
  wishlist: string[]
  addItemToWishlist: (itemId: string) => Promise<void>
  removeItemFromWishlist: (selectedItemId: string) => Promise<void>
}

const Context = createContext<WishlistContextType | null>(null)

type Props = { children: React.ReactNode } 

export const WishlistContext = ({children}: Props) => { 
  const [wishlist, setWishlist] = useState<string[]>([])

  const getWishlist = async () => {
    try {
      const wishlistStringified = await AsyncStorage.getItem('wishlist')
      if(wishlistStringified !== null) {
        setWishlist(JSON.parse(wishlistStringified))
      }
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getWishlist()
  }, [])
  

  const addItemToWishlist = async (itemId: string) => {
    const updatedWishlist = [...wishlist, itemId]
    setWishlist(updatedWishlist)
    try {
      await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    } catch (e) {
      console.log(e)
    }
  }

  const removeItemFromWishlist = async (selectedItemId: string) => {
    const updatedWishlist = wishlist.filter( itemId => itemId != selectedItemId )
    setWishlist(updatedWishlist)
    try {
      await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    } catch(e) {
      console.log(e)
    }
  }

  return(
    <Context.Provider value={{ wishlist, addItemToWishlist, removeItemFromWishlist }}>
      {children}
    </Context.Provider>
  )
}

export const useWishlistContext = () => {
  const wishlistContext = useContext(Context)

  if (!wishlistContext) throw new Error('You need to use this hook inside a context provider')

  return wishlistContext;
}