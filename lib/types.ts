export type Post = {
  userId:number,
  id?:number,
  title:string,
  body:string
}

export type Album = {
  id: string
  title: string
}

export type User= {
  id: string
  name: string
}
export type Photo= {
  id: string
  title: string
}

export type Totals = {
  posts: number
  albums: number
  users: number
  photos: number
}