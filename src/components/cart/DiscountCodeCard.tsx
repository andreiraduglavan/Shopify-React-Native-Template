import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { theme } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons';

const DiscountCodeCard = ({title}: {title: string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Ionicons name="pricetag-outline" size={12} color={theme.colors.text} />
    </View>
  )
}

export default DiscountCodeCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 4,
    paddingHorizontal: 6,
    marginRight: 8,
    borderColor: theme.colors.text,
    borderWidth: 0.5,
    borderRadius: 4
  },
  text: {
    letterSpacing: 1,
    color: theme.colors.text,
    paddingLeft: 6
  }
})