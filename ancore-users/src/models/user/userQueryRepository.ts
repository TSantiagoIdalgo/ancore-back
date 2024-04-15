import UserModel from '../../database/sql/tables/userModel';

export default class UserQueryRepository {
  getAll () {
    return UserModel.findAll();
  }

  getById (userId: string) {
    return UserModel.findOne({ 
      where: { email: userId }
    });
  }
}