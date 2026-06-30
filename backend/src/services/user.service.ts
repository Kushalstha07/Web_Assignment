import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO, ChangePasswordDTO } from "../dtos/user.dto";
import { AdminCreateUserDTO, AdminUpdateUserDTO } from "../dtos/admin.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { PaginationMeta } from "../uttils/apihelper.util";

const userRepository = new UserMongoRepository();

export type SafeUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  studyLevel: string;
  destination: string;
  fieldOfStudy: string;
  intake: string;
  budget: string;
  role: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
};

function toSafeUser(user: IUser): SafeUser {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    studyLevel: user.studyLevel,
    destination: user.destination,
    fieldOfStudy: user.fieldOfStudy,
    intake: user.intake,
    budget: user.budget,
    role: user.role,
    profileImage: user.profileImage || null,
    createdAt: user.createdAt?.toISOString?.() || String(user.createdAt),
    updatedAt: user.updatedAt?.toISOString?.() || String(user.updatedAt),
  };
}

export class UserService {
  async createUser(userData: CreateUserDTO): Promise<SafeUser> {
    const existingEmail = await userRepository.getUserByEmail(userData.email);

    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }

    const existingUsername = await userRepository.getUserByUsername(
      userData.username,
    );

    if (existingUsername) {
      throw new HttpException(400, "Username already exists");
    }

    const hashedPassword = await bcryptjs.hash(userData.password, 10);

    const user = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    return toSafeUser(user);
  }

  async loginUser(loginData: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(loginData.email);

    if (!user) {
      throw new HttpException(400, "Invalid email");
    }

    const isPasswordValid = await bcryptjs.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(400, "Invalid password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      {
        expiresIn: "30d",
      },
    );

    return {
      user: toSafeUser(user),
      token,
    };
  }

  async getUserById(id: string): Promise<SafeUser> {
    const user = await userRepository.getUserById(id);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return toSafeUser(user);
  }

  async updateUser(
    id: string,
    updateData: UpdateUserDTO,
    profileImage?: string,
  ): Promise<SafeUser> {
    const user = await userRepository.getUserById(id);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const updateFields: Partial<IUser> = { ...updateData };

    if (profileImage) {
      updateFields.profileImage = profileImage;
    }

    const updatedUser = await userRepository.update(id, updateFields);

    if (!updatedUser) {
      throw new HttpException(500, "Failed to update user");
    }

    return toSafeUser(updatedUser);
  }

  // ──────────────────────────────────────────────
  // Admin methods
  // ──────────────────────────────────────────────

  async getAllUsers(
    page: number,
    limit: number,
    searchTerm?: string,
  ): Promise<{ data: SafeUser[]; meta: PaginationMeta }> {
    const { users, total } = await userRepository.getAllPaginated(page, limit, searchTerm);

    return {
      data: users.map(toSafeUser),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserByIdAdmin(id: string): Promise<SafeUser> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    return toSafeUser(user);
  }

  async createUserByAdmin(data: AdminCreateUserDTO): Promise<SafeUser> {
    const existingEmail = await userRepository.getUserByEmail(data.email);
    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }

    const existingUsername = await userRepository.getUserByUsername(data.username);
    if (existingUsername) {
      throw new HttpException(400, "Username already exists");
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const user = await userRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return toSafeUser(user);
  }

  async updateUserByAdmin(id: string, data: AdminUpdateUserDTO): Promise<SafeUser> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    // If email is being changed, check uniqueness
    if (data.email && data.email !== user.email) {
      const existingEmail = await userRepository.getUserByEmail(data.email);
      if (existingEmail) {
        throw new HttpException(400, "Email already exists");
      }
    }

    // If username is being changed, check uniqueness
    if (data.username && data.username !== user.username) {
      const existingUsername = await userRepository.getUserByUsername(data.username);
      if (existingUsername) {
        throw new HttpException(400, "Username already exists");
      }
    }

    const updateFields: Partial<IUser> = { ...data };

    // Hash password if provided
    if (data.password) {
      updateFields.password = await bcryptjs.hash(data.password, 10);
    }

    const updatedUser = await userRepository.update(id, updateFields);
    if (!updatedUser) {
      throw new HttpException(500, "Failed to update user");
    }

    return toSafeUser(updatedUser);
  }

  async deleteUserByAdmin(id: string): Promise<void> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const deleted = await userRepository.delete(id);
    if (!deleted) {
      throw new HttpException(500, "Failed to delete user");
    }
  }

  async changePassword(
    id: string,
    changePasswordData: ChangePasswordDTO,
  ): Promise<void> {
    const user = await userRepository.getUserById(id);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const isPasswordValid = await bcryptjs.compare(
      changePasswordData.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(400, "Current password is incorrect");
    }

    const hashedNewPassword = await bcryptjs.hash(
      changePasswordData.newPassword,
      10,
    );

    await userRepository.update(id, { password: hashedNewPassword });
  }
}
