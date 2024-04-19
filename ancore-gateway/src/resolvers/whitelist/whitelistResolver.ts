import { ServerContext } from '../user/userResolverTypes';
import { whitelistClient } from '../../config/clients';
import { WhitelistAction } from '../../types/whitelist/whitelist';
import WhitelistGetter from '../../services/whitelist/whitelistGetter';
import WhitelistSetter from '../../services/whitelist/whitelistSetter';
import WhitelistService from '../../services/whitelist/whitelistService';
import WhitelistProxy from '../../proxies/whitelist/whitelistProxy';

const whitelistGettters = new WhitelistGetter(whitelistClient);
const whitelistSetters = new WhitelistSetter(whitelistClient);
const whitelistService = new WhitelistService(whitelistGettters, whitelistSetters);
const whitelistProxy = new WhitelistProxy(whitelistService);

interface AddOrRemoveAction {
  action: WhitelistAction;
  productId: string;
}

const whitelistResolver = {
  Query: {
    getUserWhitelist: async (_root: unknown, _args: unknown, context: ServerContext) =>
      await whitelistProxy.getAllUserProducts(context)
  },
  Mutation: {
    addOrRemoveProduct: async (_root: unknown, args: AddOrRemoveAction, context: ServerContext) =>
      await whitelistProxy.addOrRemoveProduct(context, args.productId, args.action)
  }
};

export default whitelistResolver;