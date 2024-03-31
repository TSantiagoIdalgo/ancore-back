import UserModel from '../../database/sql/tables/userModel';
import UserSessionModel from '../../database/sql/tables/userSession';

export default class UserQueryRepository {
  getAll () {
    return UserModel.findAll();
  }

  getById (userId: string) {
    return UserModel.findOne({ 
      where: { email: userId }
    });
  }

  validateCSRF (csrf: string) {
    return UserSessionModel.findOne({
      where: { csrf }
    });
  }
}