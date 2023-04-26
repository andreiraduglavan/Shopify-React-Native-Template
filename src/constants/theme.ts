import { DarkTheme, DefaultTheme } from "@react-navigation/native"
import { modelName } from "expo-device"
import { Appearance, Platform } from "react-native"
import { config } from "../../config"

export const colorScheme = Appearance.getColorScheme()

export const theme = colorScheme == 'light' ? {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    infoText: 'rgba(0,0,0,0.67)',
    disabledText: 'rgba(0,0,0,0.33)',
    background: 'rgb(245,247,245)', 
    primary: config.primaryColor,
  }
} : {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    infoText: 'rgba(255,255,255,0.67)',
    disabledText: 'rgba(255,255,255,0.33)',
    primary: config.primaryColorDark
  }
}

export const hasHomeIndicator = !['iPhone 5', 'iPhone 5s', 'iPhone 5c', 'iPhone 6 Plus', 'iPhone 6', 'iPhone 6s', 'iPhone 6s Plus', 'iPhone 6s', 'iPhone SE (1st generation)', 'iPhone 7 Plus', 'iPhone 7', 'iPhone 8 Plus', 'iPhone 8', 'iPhone SE (2nd generation)', 'iPad Pro 11-inch', 'iPad Pro 12.9-inch (3rd generation)', 'iPad Pro 11-inch (2nd generation)', 'iPad Pro 12.9-inch (4th generation)', 'iPad Pro 11-inch (3rd generation)', 'iPad Pro 12.9-inch (5th generation)', 'iPad Pro 11-inch (4th generation)', 'iPad Pro 12.9-inch (6th generation)', 'iPad Pro 12.9-inch (6th generation)']
  .map((model) => model == modelName )
  .includes(true) && Platform.OS == 'ios'
