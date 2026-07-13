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
  setPasswordResetToken(id: string, tokenHash: string, expiresAt: Date): Promise<void>;
  clearPasswordResetToken(id: string): Promise<void>;
  consumePasswordResetToken(tokenHash: string, password: string): Promise<IUser | null>;
  updatePassword(id: string, password: string): Promise<IUser | null>;

  // Admin paginated search
  getAllPaginated(page: number, limit: number, searchTerm?: string): Promise<{ users: IUser[]; total: number }>;
}

export class UserMongoRepository implements IUserRepository {
  async getUserById(id: string): Promise<IUser | null> {
    const found = await UserModel.findOne({ _id: id });
    return found;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const found = await UserModel.findOne({ email }).select("+sessionVersion");
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
      returnDocument: "after",
    });
    return updated;
  }

  async setPasswordResetToken(id: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await UserModel.findByIdAndUpdate(id, {
      $set: { resetPasswordTokenHash: tokenHash, resetPasswordExpiresAt: expiresAt },
    });
  }

  async clearPasswordResetToken(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, {
      $unset: { resetPasswordTokenHash: 1, resetPasswordExpiresAt: 1 },
    });
  }

  async consumePasswordResetToken(tokenHash: string, password: string): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { resetPasswordTokenHash: tokenHash, resetPasswordExpiresAt: { $gt: new Date() } },
      {
        $set: { password, passwordChangedAt: new Date() },
        $unset: { resetPasswordTokenHash: 1, resetPasswordExpiresAt: 1 },
        $inc: { sessionVersion: 1 },
      },
      { returnDocument: "after" },
    );
  }

  async updatePassword(id: string, password: string): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: { password, passwordChangedAt: new Date() }, $inc: { sessionVersion: 1 } },
      { returnDocument: "after" },
    );
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
