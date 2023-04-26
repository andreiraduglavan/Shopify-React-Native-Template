import { NavigationContainer } from '@react-navigation/native'
import { theme } from '../constants/theme'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomTabParamList } from '../types/navigation';
import HomeStackNavigator from './StackNavigators/HomeStackNavigator';
import SearchStackNavigator from './StackNavigators/SearchStackNavigator';
import CartStackNavigator from './StackNavigators/CartStackNavigator';
import ProfileStackNavigator from './StackNavigators/ProfileStackNavigator';
import { BagIcon, HomeIcon, ProfileIcon, SearchIcon, StoreIcon } from '../components/shared/Icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../types/navigation'
import { useNavigationContext } from '../context/NavigationContext';
import { useEffect } from 'react';
import MenuStackNavigator from './StackNavigators/MenuStackNavigator';

const Tab = createBottomTabNavigator<BottomTabParamList>()

type Props = NativeStackScreenProps<StackParamList, 'TabNavigator'>

const TabNavigator = ({navigation}: Props) => {
  const { setRootNavigation } = useNavigationContext()
  
  useEffect(() => {
    setRootNavigation(navigation)
  }, [])
  
  return (
    <NavigationContainer theme={theme} independent={true} >
      <Tab.Navigator  
        id='TabNavigator'
        screenOptions={({ route }) => ({
          tabBarStyle: { height: 50 },
          headerShown:false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.infoText,
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: theme.dark == true ? theme.colors.background : theme.colors.card,
          tabBarInactiveBackgroundColor: theme.dark == true ? theme.colors.background : theme.colors.card, 
          tabBarIcon: ({focused, color, size }) => {
            var size = 20
            if ( route.name =='Home' ) {
              return <HomeIcon size={22} color={color} />

            } 
            if ( route.name =='Menu' ) {
              return <StoreIcon size={22.5} color={color} />
            } 
            if ( route.name =='Search' ) {
              return <SearchIcon size={18} color={color} />
            } 
            if ( route.name =='Cart' ) {
              return <BagIcon size={21} color={color} />
            } 
            if ( route.name =='Profile' ) {
              return <ProfileIcon size={22} color={color} />
            } 
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Menu" component={MenuStackNavigator} />
        <Tab.Screen name="Search" component={SearchStackNavigator} />
        <Tab.Screen name="Cart" component={CartStackNavigator} />
        <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default TabNavigator