
export interface Roles { 
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
 }
  
export interface User {
    uid: string;
    dateAdded?: Date,
    dateUpdated?: Date,
    lastLogin?: Date,
    email: string;
    roles: Roles;
    nom: string;
    avatar?: string;
}
