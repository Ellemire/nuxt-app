// user.ts

export interface User {
  id: number
  name: string
  email: string
}

// User interface based on https://jsonplaceholder.typicode.com/users
export interface RawUser {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}
