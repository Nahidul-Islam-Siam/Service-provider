export interface TBlog {
  image: {
    url: string;
    altText: string;
  };
  _id?: string;
  title?: string;
  content?: string;
  author?: string;
  email?: string;
  isPublished?: boolean;
  postDate?: string; // ISO date string
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  __v?: number;
  admin: {
    name?: string;
    email?: string;
  };
}

export interface TProvider {
  _id?: string;
  name?: string;
  email?: string;
  message?: string;
  image?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  success?: boolean;
  description?: string;
  assignedUser?: string;
  providerService?: string;
  sProviderId?: string;
  phone?: string;
  status?: string;
  role?: string;
  id?: string; // Optional ID for existing providers
  data?: string;
}

export interface Tuser {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  __v?: number;
  success?: boolean;
  data: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    isAdmin?: boolean;
    isVerified?: boolean;
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
    __v?: number;
    role?: string;
  };


  id?: string; // Add the 'id' property explicitly
}

export interface TServiceProvider {
  _id?: string;
  name?: string;
  email?: string;
  message?: string;
  image?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  success?: boolean;
  description?: string;
  assignedUser?: string;
  providerService?: string;
  sProviderId?: string;
  phone?: string;
  status?: string;
  id?: string; // Optional ID for existing providers
}

export interface Tcontact {
  _id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  message?: string;
}

export interface BundleDiscount {
  sProviderId: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  isBundle: number;
}
