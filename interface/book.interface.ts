import { IUser } from "./user.interface";

export interface IBook {
  _id: string;
  title: string;
  description: string;
  rating: number;
  image: string;
  user: IUser;
  createdAt: string;
  updatedAt: string;
}
