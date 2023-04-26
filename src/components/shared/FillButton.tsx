import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native'
import { theme } from '../../constants/theme'

const FillButton = ({onPress, title}: 
  {
    onPress: (event: GestureResponderEvent) => void
    title: string
  }) => {
  
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.text, 
    alignItems:'center'
  },
  text: {
    color: theme.colors.background, 
    fontSize:12, 
    letterSpacing:1,
    fontWeight: '500'
  }
})

export default FillButton