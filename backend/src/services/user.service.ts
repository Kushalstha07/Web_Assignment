import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
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
}
