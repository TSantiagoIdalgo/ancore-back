import reviewModel from '../tables/reviewModel';
import UserModel from '../tables/userModel';

UserModel.hasMany(reviewModel, {
  foreignKey: 'userId',
  sourceKey: 'email'
});
reviewModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  targetKey: 'email'
});