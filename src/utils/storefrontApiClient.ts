export const storefrontApiClient = async (query: string, variables: any | null = null) => {
  const URL = `https://dj-resale.myshopify.com//api/2023-01/graphql.json`
  const options = {
    endpoint: URL,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": 'ea87d0aa34620e4b1034509b2f40d4d8',
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables })
  }

  var p = new Promise(async (resolve, reject) => {
    
    try {
      const data = await fetch(URL, options).then(response => {
        return response.json()
      })
      
      resolve(data)
    } catch (error) {
      reject (error)
    }
  }) 

  return p
}