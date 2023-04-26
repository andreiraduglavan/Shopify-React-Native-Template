import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useContext, createContext, useState } from "react"
import { StackParamList } from "../types/navigation"

type NavigationContextType = {
  rootNavigation: NativeStackScreenProps<StackParamList, 'TabNavigator'>['navigation'],
  setRootNavigation: React.Dispatch<NativeStackScreenProps<StackParamList, 'TabNavigator'>['navigation']>
}

const Context = createContext<NavigationContextType | null>(null)

type Props = { children: React.ReactNode } 

export const NavigationContext = ({children}: Props) => { 
  const [rootNavigation, setRootNavigation] = useState<NativeStackScreenProps<StackParamList, 'TabNavigator'>['navigation']>()
  return(
    <Context.Provider value={{ rootNavigation, setRootNavigation }}>
      {children}
    </Context.Provider>
  )
}

export const useNavigationContext = () => {
  const navigationContext = useContext(Context)

  if (!navigationContext) throw new Error('You need to use this hook inside a context provider');

  return navigationContext;
}