import UserQueryRepository from '../models/user/userQueryRepository';
import UserQueryService from '../services/userService/userQueryService';
import UserQueryController from '../controllers/userControllers/userQueryController';
import UserCommandRepository from '../models/user/userCommandRepository';
import UserCommandService from '../services/userService/userCommandService';
import UserCommandController from '../controllers/userControllers/userCommandController';
import CartQueryRepository from '../models/userCart/CartQueryRepository';
import CartQueryService from '../services/cartService/cartQueryService';
import CartQueryController from '../controllers/cartControllers/cartQueryController';
import CartCommandRepository from '../models/userCart/cartCommandRepository';
import CartCommandService from '../services/cartService/cartCommandService';
import CartCommandController from '../controllers/cartControllers/cartCommandController';
import WhitelistQueryRepository from '../models/whiteList/whitelistQueryRepository';
import WhitelistQueryService from '../services/whitelist/whitelistQueryRepository';
import WhitelistQueryController from '../controllers/whitelist/whitelistQueryController';
import WhitelistCommandRepository from '../models/whiteList/whitelistCommandRepository';
import WhitelistCommandService from '../services/whitelist/whitelistCommandService';
import WhitelistCommandController from '../controllers/whitelist/whitelistCommandController';

const userQueryRepository = new UserQueryRepository();
const userCommandRepository = new UserCommandRepository();
const cartQueryRepository = new CartQueryRepository();
const cartCommandRepository = new CartCommandRepository();
const whitelistQueryRepository = new WhitelistQueryRepository();
const whitelistCommandRepository = new WhitelistCommandRepository();

const userQueryService = new UserQueryService(userQueryRepository, userCommandRepository);
const userCommandService = new UserCommandService(userCommandRepository);
const cartQueryService = new CartQueryService(cartQueryRepository);
const cartCommandService = new CartCommandService(cartCommandRepository);
const whitelistQueryService = new WhitelistQueryService(whitelistQueryRepository);
const whitelistCommandService = new WhitelistCommandService(whitelistCommandRepository);

export const userQueryController = new UserQueryController(userQueryService);
export const userCommandController = new UserCommandController(userCommandService);
export const cartQueryController = new CartQueryController(cartQueryService);
export const cartCommandController = new CartCommandController(cartCommandService);
export const whitelistQueryController = new WhitelistQueryController(whitelistQueryService);
export const whitelistCommandController = new WhitelistCommandController(whitelistCommandService);