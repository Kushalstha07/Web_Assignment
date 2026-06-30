import { UserModel, IUser } from "../models/user.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;

  // 5 common mandatory methods for a repository
  createUser(user: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;

  // Admin paginated search
  getAllPaginated(page: number, limit: number, searchTerm?: string): Promise<{ users: IUser[]; total: number }>;
}

export class UserMongoRepository implements IUserRepository {
  async getUserById(id: string): Promise<IUser | null> {
    const found = await UserModel.findOne({ _id: id });
    return found;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const found = await UserModel.findOne({ email });
    return found;
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    const found = await UserModel.findOne({ username });
    return found;
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    const created = await UserModel.create(user);
    return created;
  }

  async getAll(): Promise<IUser[]> {
    const found = await UserModel.find();
    return found;
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const updated = await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await UserModel.findByIdAndDelete(id);
    return !!deleted;
  }

  async getAllPaginated(
    page: number,
    limit: number,
    searchTerm?: string,
  ): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (searchTerm) {
      const regex = new RegExp(searchTerm, "i");
      filter.$or = [{ fullName: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(filter),
    ]);

    return { users, total };
  }
}
