import { createContext, useContext, useEffect, useMemo, useReducer } from "react"
import * as SecureStore from 'expo-secure-store'
import { storefrontApiClient } from "../utils/storefrontApiClient"
import { convertDateToTimestamp } from "../utils/convertDateToTimestamp"

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<unknown>
  signOut: () => Promise<void>
  signUp: (firstName: string, lastName: string, email: string, password: string, acceptsMarketing: boolean) => Promise<unknown>
  userToken: any
  dispatch: React.Dispatch<any>
}

const Context = createContext<AuthContextType | null>(null)

type Props = { children: React.ReactNode } 

export const AuthContext = ({children}: Props) => {
  
  const [authState, dispatch] = useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      var token: any

      try {
        token = await SecureStore.getItemAsync('userToken');
        token = JSON.parse(token)
        
        if (!token) return

        // renew token
        try {
          const query = `mutation customerAccessTokenRenew($customerAccessToken: String!) {
            customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
              customerAccessToken {
                accessToken
                expiresAt
              }
              userErrors {
                field
                message
              }
            }
          }`
          const variables = { customerAccessToken: token.accessToken }

          const response: any = await storefrontApiClient(query, variables)

          if (response.errors && response.errors.length != 0) {
            throw response.errors[0].message
          }
          
          if (response.data.customerAccessTokenRenew.userErrors.length != 0) {
            throw response.data.customerAccessTokenRenew.userErrors[0].message
          }
          
          const newAccessToken = response.data.customerAccessTokenRenew.customerAccessToken
          token.accessToken = newAccessToken.accessToken
          token.expiresAt = convertDateToTimestamp(newAccessToken.expiresAt)

        } catch (e) {
          console.log(e)
        }
      
        if (Date.now() < token.expiresAt) {
          dispatch({ type: 'RESTORE_TOKEN', token: token });
        }
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (email: string, password: string) => {
        
        var p = new Promise(async (resolve, reject) => {
          // try {
          //   const userCredential = await signInWithEmailAndPassword(auth, email, password)
          //   const token = await userCredential.user.getIdToken()
          //   SecureStore.setItemAsync('userToken', token )
          //   dispatch({ type: 'SIGN_IN', token: token })
          //   resolve(token)
          // } catch (error: any) {
          //   const errorMessage = error.message.replace('Firebase: ')
          //   reject(errorMessage)
          // }

          try {
            const variables = {
              input: {
                email,
                password      
              }
            }
      
            const query = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
              customerAccessTokenCreate(input: $input) {
                customerAccessToken {
                  accessToken
                  expiresAt
                }
                customerUserErrors {
                  code
                  field
                  message
                }
              }
            }`

            const response: any = await storefrontApiClient(query, variables)

            if (response.errors && response.errors.length != 0) {
              throw response.errors[0].message
            }
            
            if (response.data.customerAccessTokenCreate.customerUserErrors.length != 0) {
              throw 'Wrong email or password. Try again.'
            }

            var customerAccessToken = response.data.customerAccessTokenCreate.customerAccessToken
            const customerDataQuery = `query {
              customer(customerAccessToken: "${customerAccessToken.accessToken}") {
                id
                firstName
                lastName
                acceptsMarketing
                email
                phone
              }
            }`

            const customerDataResponse: any = await storefrontApiClient(customerDataQuery)

            if (response.errors && response.errors.length != 0) {
              throw response.errors[0].message
            }

            customerAccessToken.customer = customerDataResponse.data.customer 
            customerAccessToken.expiresAt = convertDateToTimestamp(customerAccessToken.expiresAt)
            
            SecureStore.setItemAsync('userToken', JSON.stringify(customerAccessToken) )
            dispatch({ type: 'SIGN_IN', token: customerAccessToken })
            
            resolve(customerAccessToken)
          } catch (e) {
            console.log(e)
            reject(e)
          }
        })

          

        return p
      },
      signOut: async () => {  
        try {
          await SecureStore.deleteItemAsync('userToken')
          dispatch({ type: 'SIGN_OUT' })
        } catch (error) {
          console.log(error)
        }       
      },

      signUp: async (firstName: string, lastName: string, email: string, password: string, acceptsMarketing: boolean) => {  
        var p = new Promise(async (resolve, reject) => {

          try {
            const variables = {
              input: {
                email,
                firstName,
                lastName,
                password,
                acceptsMarketing
              }
            }
      
            const query = `mutation createCustomerAccount($input: CustomerCreateInput!) {
              customerCreate(input: $input) {
                customer {
                  id
                  email
                  firstName
                  lastName
                }
                customerUserErrors {
                  code
                  field
                  message
                }
              }
            }`

            const response: any = await storefrontApiClient(query, variables)

            if (response.errors && response.errors.length != 0) {
              throw response.errors[0]
            }

            if (response.data.customerCreate.customerUserErrors.length != 0) {
              throw response.data.customerCreate.customerUserErrors[0]
            }

            var customer = response.data.customerCreate.customer[0]

            await authContext.signIn(email, password)
            
            resolve(customer)
          } catch (e) {
            console.log(e)
            reject(e)
          }
        })             

        return p
      },
    }),
    []
  );

  return (
    <Context.Provider 
      value={{...authContext, userToken: authState.userToken, dispatch }}
    >
      { children }
    </Context.Provider>
  )
}

export const useAuthContext = () => {
  const authContext = useContext(Context)

  if (!authContext) throw new Error('You need to use this hook inside a context provider');

  return authContext;
}