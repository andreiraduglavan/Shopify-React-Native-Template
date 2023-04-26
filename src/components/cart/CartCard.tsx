import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { CartItem } from '../../types/dataTypes'
import { theme } from '../../constants/theme'
import { useCartContext } from '../../context/CartContext'

const screenWidth = Dimensions.get('screen').width

const CartCard = ({cartItem}: {cartItem: CartItem}) => {
  const { addQuantityOfItem, substractQuantityOfItem } = useCartContext()

  return (
    <View style={styles.container}>
      <Image source={{uri: cartItem.image.url}} style={[styles.image, {height: (screenWidth-28)*0.45*cartItem.image.height/cartItem.image.width}]} />
      <View style={styles.detailsContainer}>
        <View>
          <Text style={styles.title}>{cartItem.product.title.toUpperCase()}</Text>
          <Text style={styles.price}>{cartItem.price.amount} RON</Text>
          { cartItem.title != 'Default Title' &&
            <Text style={styles.options}>{cartItem.title.replaceAll('/', '|').toUpperCase()}</Text> 
          }
        </View>
        <View style={styles.quantitySelector}>
          <TouchableOpacity 
            onPress={() => substractQuantityOfItem(cartItem.id) } 
          >
            <Text style={{color: theme.colors.text, fontSize: 28, paddingHorizontal: 8, paddingVertical: 4}}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{cartItem.quantity}</Text>

          <TouchableOpacity 
            onPress={() => addQuantityOfItem(cartItem.id) } 
          >
            <Text style={{color: theme.colors.text, fontSize: Platform.OS == 'ios' ? 22 : 17, paddingHorizontal: 8, paddingVertical: 4}}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default CartCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: screenWidth-28,
    paddingTop: 16
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'space-between'
  },
  title: {
    color: theme.colors.text,
    fontWeight: '300',
    letterSpacing: 1.5
  },
  options: {
    color: theme.colors.text,
    fontSize: 13,
    letterSpacing: 1.5,
    paddingTop: 16
  },
  price: {
    color: theme.colors.text,
    letterSpacing: 1.5,
    paddingTop: 4
  },
  image: {
    width: (screenWidth-28)*0.45,
    maxHeight: (screenWidth-28)*0.45*1.5
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -8
  },
  quantity: {
    color: theme.colors.text,
    fontSize: 15,
    paddingHorizontal: Platform.OS == 'ios' ? 16 : 14,
    width: 38,
  }
})