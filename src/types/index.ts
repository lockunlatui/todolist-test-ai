export interface ProductSpecs {
  screen: string
  camera: string
  battery: string
  storage: string
  chip: string
}

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  imageUrl: string
  description: string
  specs: ProductSpecs
  badge?: "hot" | "new" | "sale"
  colors: string[]
}
