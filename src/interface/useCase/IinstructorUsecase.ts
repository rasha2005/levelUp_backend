import DecodedToken from "../../entity/Token";
import  Instructor  from "../../entity/Instructor";
import Category from "../../entity/Category";
import { InstructorDTO } from "../../usecase/dtos/InstructorDTO";
import { Session } from "../../entity/Session";
import Slot from "../../entity/Slot";

export interface IInstructorUseCase {
  findInstructor(
    instructor: Instructor
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    instructorOtp?: any;
    token?: string;
  }>;

  saveInstructor(
    instructorOtp: string,
    token: string
  ): Promise<{
    success: boolean;
    message: string;
    authToken?: string;
    refreshToken?: string;
  }>;

  verifyLogin(
    email: string,
    instructorpassword: string
  ): Promise<{
    success: boolean;
    message: string;
    authToken?: string;
    refreshToken?: string;
  }>;

  getCataData(): Promise<{
    success: boolean;
    message: string;
    res?: Category[];
  }>;

  updateInstructor(
    token: DecodedToken,
    description: string,
    experienceCategory: string,
    experienceCertificate: string,
    resume: string,
    specialization: string[]
  ): Promise<{
    success: boolean;
    message: string;
    res?: Instructor;
  }>;

  getInstructorDetails(
    token: DecodedToken
  ): Promise<{
    success: boolean;
    message: string;
    res?: InstructorDTO;
  }>;

  editInstructorDetails(
    token: DecodedToken,
    name: string,
    mobile: string
  ): Promise<{
    success: boolean;
    message: string;
    res?: InstructorDTO;
  }>;

  updateImg(
    token: DecodedToken,
    img: string
  ): Promise<{
    success: boolean;
    message: string;
    res?: InstructorDTO;
  }>;

  resendOtpByEmail(
    token: string
  ): Promise<{
    success: boolean;
    message: string;
    updatedOtp?: any;
    savedOtp?: any;
  }>;

  changeInstructorPassword(
    token: DecodedToken,
    current: string,
    confirm: string
  ): Promise<{
    success: boolean;
    message: string;
    updatedInstructor?: InstructorDTO;
  }>;

  scheduleSessionById(
    title: string,
    start: string,
    end: string,
    price: string,
    token: DecodedToken,
    isRecurring: boolean,
    recurrenceRule: string | null
  ): Promise<{
    success: boolean;
    message: string;
    session?: Session;
  }>;

  getEventsData(
    token: DecodedToken
  ): Promise<{
    success: boolean;
    message: string;
    events?: any;
    instructor?: InstructorDTO;
  }>;

  deleteEventData(
    id: string,
    token: DecodedToken
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  getSlots(
    token: DecodedToken
  ): Promise<{
    success: boolean;
    message: string;
    slot?: Slot[];
  }>;

  getWalletDetails(
    token: DecodedToken
  ): Promise<{
    success: boolean;
    message: string;
    slot?: Slot[];
    Wallet?: any;
  }>;

  getInstructorImg(
    token: DecodedToken
  ): Promise<{
    success: boolean;
    message: string;
    image?: string;
  }>;

  verifyroomId(
    roomId: string,
    instructorId: string
  ): Promise<{
    success: boolean;
  }>;

  updateRoomJoin(
    roomId: string
  ): Promise<{
    sucess: boolean;
    message: string;
  }>;

  createNewBundle(
    token: DecodedToken,
    bundleName: string
  ): Promise<{
    sucess: boolean;
    message: string;
    res?: any;
  }>;

  bundleData(
    token: DecodedToken
  ): Promise<{
    sucess: boolean;
    message: string;
    res?: any;
    isApproved?: boolean;
  }>;

  createNewQuestion(
    questionText: string,
    type: string,
    options: string[],
    answer: string,
    bundleId: string
  ): Promise<{
    sucess: boolean;
    message: string;
    data?: any;
  }>;

  getBundleQuestions(
    bundleId: string
  ): Promise<{
    sucess: boolean;
    message: string;
    data?: any;
  }>;

  createNewTest(
    activeSlotId: string,
    selectedBundle: string,
    selectedQuestions: string[]
  ): Promise<{
    sucess: boolean;
    message: string;
    data?: any;
  }>;

  deleteQuestionById(
    id: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
  }>;

  deleteBundleById(
    id: string
  ): Promise<{
    status: number;
    success: boolean;
  }>;

  updateBundleById(
    name: string,
    id: string
  ): Promise<{
    status: number;
    success: boolean;
  }>;

  createCourseBundle(
    data: any,
    token: DecodedToken
  ): Promise<{
    status?: number;
    success?: boolean;
    sucess?: boolean;
    message?: string;
    data?: any;
  }>;

  fetchCourseData(
    instructorId: string
  ): Promise<{
    sucess?: boolean;
    message?: string;
    data?: any;
    isApproved?: boolean;
    status?: number;
    success?: boolean;
  }>;

  CreateCourseSlot(
    title: string,
    date: string,
    startTime: string,
    endTime: string,
    bundleId: string,
    instructorId: string
  ): Promise<{
    status: number;
    success?: boolean;
    sucess?: boolean;
    message?: string;
    data?: any;
  }>;

  fetchCourseSlots(
    bundleId: string
  ): Promise<{
    sucess: boolean;
    message: string;
    data?: any;
  }>;

  updateBundleStatus(
    bundleId: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  createCourseAnnouncement(
    announcementTitle: string,
    announcementMessages: string,
    bundleId: string,
    insructorId: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  deleteCourseSlotById(
    slotId: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  deleteCourseById(
    courseId: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  updateCourseById(
    bundleName: string,
    description: string,
    price: number,
    participantLimit: number,
    thumbnail: string | null,
    courseId: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  sendForgotPasswordOTP(
    email: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    instructorOtp?: any;
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

  changeInstructor_Password(
    token: string,
    confirm: string
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    updatedUser?: any;
    authToken?: string;
    refreshToken?: string;
  }>;

  editQuestionById(
    questionId: string,
    ansOptions: string[],
    answer: string,
    text: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;
}
