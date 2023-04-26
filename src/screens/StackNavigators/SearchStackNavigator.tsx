import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { theme } from '../../constants/theme'
import { SearchStackParamList } from '../../types/navigation'
import { NavigationContainer } from '@react-navigation/native'

import Search from '../Search'

const SearchStack = createNativeStackNavigator<SearchStackParamList>()

const SearchStackNavigator = () => {
  return (
    <NavigationContainer theme={theme} independent={true}>
      <SearchStack.Navigator>
        <SearchStack.Screen 
          name='Search' 
          component={Search}
          options={{
            headerStyle:{backgroundColor: theme.colors.background}, 
            headerShadowVisible: false,
          }} 
        />
      </SearchStack.Navigator>
    </NavigationContainer>
  )
}

export default SearchStackNavigator