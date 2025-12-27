// src/application/interfaces/IUserUseCase.ts

import  User from "../../entity/User";
import DecodedToken from "../../entity/Token";
import Otp from "../../entity/Otp";
import Category from "../../entity/Category";
import { UserDTO } from "../../usecase/dtos/UserDTO";
import { InstructorDTO } from "../../usecase/dtos/InstructorDTO";

export interface IUserUseCase {
  findUser(
    user: User
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    userOtp?: any;
    token?: string;
  }>;

  saveUser(
    userOtp: string,
    token: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    authToken?: string;
    refreshToken?: string;
  }>;

  verifyLogin(
    email: string,
    userPassword: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    authToken?: string;
    refreshToken?: string;
  }>;

  getCateogries(): Promise<{
    status: number;
    success: boolean;
    message: string;
    category?: Category[];
  }>;

  getUserDetails(
    token: DecodedToken
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    user?: UserDTO;
  }>;

  updateUserDetails(
    id: string,
    name: string,
    mobile: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    user?: UserDTO;
  }>;

  getInstructorDetails(
    page: number,
    limit: number,
    search: string | null,
    category: string | null
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    instructor?: InstructorDTO[];
    total?: number;
  }>;

  resendOtpByEmail(
    token: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    updatedOtp?: any;
    savedOtp?: any;
  }>;

  changeUserPassword(
    token: DecodedToken,
    current: string,
    confirm: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    updatedUser?: UserDTO;
  }>;

  getInstructorDetail(
    id: string,
    token: DecodedToken
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    instructor?: InstructorDTO;
    review?: any;
    isReview?: boolean;
    course?: any;
  }>;

  payement(
    info: any,
    token: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    res?: undefined;
  }>;

  successPayment(
    session: any
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
  }>;

  getSlotDetails(
    token: DecodedToken
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    slot?: any;
  }>;

  updateUserImg(
    token: DecodedToken,
    img: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    image?: string;
  }>;

  getUserImg(
    token: DecodedToken
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    image?: string;
  }>;

  verifyRoomId(
    roomId: string,
    userId: string
  ): Promise<{
    status: number;
    success: boolean;
  }>;

  updateRating(
    rating: number,
    slotId: string
  ): Promise<{
    status: number;
    success: boolean;
  }>;

  googleCallback(
    email: string,
    name: string,
    img: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    user?: UserDTO;
    authToken?: string;
    refreshToken?: string;
  }>;

  addInstructorReview(
    instructorId: string,
    value: string,
    token: DecodedToken
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
  }>;

  verifyRefreshToken(
    refreshToken: string
  ): Promise<{
    status: number;
    success: boolean;
    authToken?: string;
  }>;

  roomStatus(
    roomId: string
  ): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  getTestData(
    slotId: string
  ): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  getQuestionData(
    qId: string
  ): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  updateResultData(
    slotId: string,
    score: number
  ): Promise<{
    status: number;
    success: boolean;
  }>;

  getCourseDetails(
    courseId: string,
    userId: string
  ): Promise<{
    status: number;
    success: boolean;
    data?: any;
    isEnrolled?: any;
  }>;

  coursePayement(
    info: any,
    userId: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    res?: any;
  }>;

  successCoursePayment(
    session: any
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
  }>;

  getEnrolledCourses(
    userId: string
  ): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  userNotification(
    userId: string
  ): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  clearAllNotification(
    userId: string
  ): Promise<{
    status: number;
    success: boolean;
  }>;

  bannerRatingData(): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  latestCourseData(): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  popularInstructorData(): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  searchCourseData(
    page: number,
    limit: number,
    search: string | null,
    category: string | null,
    minPrice: number | null,
    maxPrice: number | null
  ): Promise<{
    status: number;
    success: boolean;
    courseData?: any;
    total?: number;
  }>;

  reportCourseIssue(
    attachments: string | null,
    description: string,
    courseId: string,
    instructorId: string,
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
    status?: number;
  }>;

  createQnaData(
    message: string,
    parentId: string | null,
    courseId: string,
    userId: string
  ): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  getAllQnADatas(
    courseId: string
  ): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  getAllAnnouncementDatas(): Promise<{
    status: number;
    success: boolean;
    data?: any;
  }>;

  sendForgotPasswordOTP(
    email: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    userOtp?: any;
    token?: string;
  }>;

  verifyPasswordOtp(
    userOtp: string,
    token: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
  }>;

  changeUser_Password(
    token: string,
    confirm: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    updatedUser?: UserDTO;
    authToken?: string;
    refreshToken?: string;
  }>;

}
