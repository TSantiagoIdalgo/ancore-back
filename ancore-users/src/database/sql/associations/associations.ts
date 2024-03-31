import reviewModel from '../tables/reviewModel';
import UserModel from '../tables/userModel';
import WhiteList from '../tables/whitelistSchema';

UserModel.hasMany(reviewModel, {
  foreignKey: 'userId',
  sourceKey: 'email'
});
reviewModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  targetKey: 'email'
});

UserModel.hasMany(WhiteList, {
  foreignKey: 'userId',
  sourceKey: 'email'
});

WhiteList.belongsTo(UserModel, {
  foreignKey: 'userId',
  targetKey: 'email'
});