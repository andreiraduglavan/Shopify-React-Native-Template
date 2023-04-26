export type Product = {
  id: string
  title: string
  description: string
  vendor: string
  availableForSale: boolean
  compareAtPriceRange: {
    minVariantPrice: {
      amount: number
      currencyCode: string
    }
  }
  priceRange: {
    minVariantPrice: {
      amount: number
      currencyCode: string
    }
  }
  images: {
    nodes: {
      url: string
      width: number
      height: number
    }[]
  }
  options: {
    id: string
    name: string
    values: string[]
  }[]
  variants: {
    nodes: {
      availableForSale: boolean
      selectedOptions: {
        value: string
      }[]
    }[]
  }
}

export type CartItem = {
  id: string
  title: string
  image: {
    url: string
    width: number
    height: number
  }
  product: {
    title: string
  }
  price: {
    amount: number
    currencyCode: string
  }
  compareAtPrice: {
    amount: number
    currencyCode: string
  }
  quantityAvailable: number
  availableForSale: boolean
  selectedOptions: {value: string}[]
  quantity?: number
}


export type ShippingRateType = {
  handle: string
  title: string
  price: {
    amount: number
    currencyCode: string
  }
}

export type AvailableShippingRatesType = {
  ready: boolean
  shippingRates: ShippingRateType[] 
}

export type Order = {
  id: string
  customerUrl: string
  fulfillmentStatus: string
  processedAt: string
  name: string
  totalPrice: {
    amount: number
    currencyCode: string
  }
}