import { AvailableShippingRatesType, Product } from "./dataTypes";

export type StackParamList = {
  TabNavigator: undefined
  ProductScreen: { data: Product }
  ShippingAddress: { checkoutId: string }
  ShippingOptions: { checkoutId: string }
  Payment: { webUrl: string, checkoutId: string, selectedRateHandle: string }
  DiscountCode: { checkoutId: string }
  LoginStackNavigator: { screen: 'Login' | 'Register' }
  Cart: undefined
}

export type BottomTabParamList = {
  Search: undefined
  Cart: undefined
  Profile: undefined
  Home: undefined
  Menu: undefined
}

export type HomeStackParamList = {
  Home: undefined;
  Collection: { collectionId: string }
}

export type MenuStackParamList = {
  Menu: undefined
  Collection: { collectionId: string }
  Wishlist: undefined
}

export type SearchStackParamList = {
  Search: undefined;
  ProductScreen: { data: Product }
}

export type CartStackParamList = {
  Cart: undefined;
  ShippingAddress: { checkoutId: string }
  ShippingOptions: { checkoutId: string, availableShippingRates: AvailableShippingRatesType }
  Payment: { webUrl: string, checkoutId: string, selectedRateHandle: string }
  DiscountCode: { checkoutId: string }
}

export type ProfileStackParamList = {
  Profile: undefined
  PersonalInformations: undefined
  ResetPassword: undefined
  Wishlist: undefined
  Orders: undefined
}

export type LoginStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  VerifyEmail: { message: string } 
  ForgotPasswordEmailSent: undefined
}