import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO, ChangePasswordDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";

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
