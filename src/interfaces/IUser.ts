import IFollower  from "./IFollower"
import IRepo from "./IRepo"

export default interface IUser {
  name: string
  username: string
  img: string
  email: string
  followers: number
  repsCount: number
  url: string
  company: string
  creationDate: string
  bio: string
  location: number[] | null
  followersList: IFollower[] | null
  repsList: IRepo[] | null
  reposPerYears: number[] | null
}

