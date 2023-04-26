import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native'
import { theme } from '../../constants/theme'

const OutlineButton = ({onPress, title}: 
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
    paddingVertical: 5.5,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background, 
    borderColor: theme.colors.text,
    borderWidth: 0.5,
    alignItems:'center'
  },
  text: {
    color: theme.colors.text, 
    fontSize:12, 
    letterSpacing:1,
    fontWeight: '500'
  }
})

export default OutlineButton