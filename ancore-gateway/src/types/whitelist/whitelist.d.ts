export interface IWhiteList {
  id?: string;
  userId: string;
  productId: string;
}

export enum WhitelistAction {
  add = 'add',
  remove = 'remove',
}