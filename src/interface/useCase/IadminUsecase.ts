import Messages from "../../entity/Message";
import { Ticket } from "../../entity/Ticket";

import { UserDTO } from "../../usecase/dtos/UserDTO";
import { InstructorDTO } from "../../usecase/dtos/InstructorDTO";
import Category from "../../entity/Category";

export interface IAdminUseCase {
    insertAdmin(email: string, password: string): Promise<{
        status: number;
        success: boolean;
        message: string;
        admin: any;
    }>;

    verifyLogin(email: string, adminPassword: string): Promise<{
        status: number;
        success: boolean;
        message: Messages | string;
        token?: string;
    }>;

    getUsers(): Promise<{
        status: number;
        success: boolean;
        message: string;
        userData?: UserDTO[];
    }>;

    getInstructors(): Promise<{
        status: number;
        success: boolean;
        message: string;
        instructorData?: InstructorDTO[];
        totalInstructor?: number;
        revenueSummary?: any;
    }>;

    createCat(data: string): Promise<{
        status: number;
        success: boolean;
        message: Messages | string;
        categoryData?: any;
    }>;

    getCatData(): Promise<{
        status: number;
        success: boolean;
        message: string;
        category?: Category[];
    }>;

    editCatData(name: string, id: string): Promise<{
        status: number;
        success: boolean;
        message: Messages | string;
        category?: Category[];
    }>;

    deleteCatData(id: string): Promise<{
        status: number;
        success: boolean;
        message: string;
    }>;

    blockUserId(id: string): Promise<{
        status: number;
        success: boolean;
        message: string;
        user?: UserDTO;
    }>;

    getInstructorDetaild(id: string): Promise<{
        status: number;
        success: boolean;
        message: string;
        instructor?: InstructorDTO;
    }>;

    instructorApprovel(id: string): Promise<{
        status: number;
        success: boolean;
        message: string;
    }>;

    instructorApprovelCancel(id: string): Promise<{
        status: number;
        success: boolean;
        message: string;
    }>;

    getUserDetaild(id: string): Promise<{
        status: number;
        success: boolean;
        message: string;
        user?: UserDTO;
    }>;

    reminder(): Promise<void>;

    fetchDetail(): Promise<{
        status: number;
        success: boolean;
        message: string;
        wallet?: any;
    }>;

    getTransaction(
        search: string | "",
        page: number,
        limit: number,
        start: string | "",
        end: string | ""
    ): Promise<{
        status: number;
        success: boolean;
        message: string;
        data?: any[];
        total?: number;
    }>;

    getApproveInstrcutors(): Promise<{
        status: number;
        success: boolean;
        message: string;
        instructorData?: InstructorDTO[];
    }>;

    fetchMonthyRevenue(): Promise<{
        status: number;
        success: boolean;
        message: string;
        transaction?: any;
    }>;

    getTicketData(search: string | "", page: number, limit: number): Promise<{
        status: number;
        success: boolean;
        message: string;
        ticket?: Ticket[];
        total?: number;
    }>;

    updateTicketStatus(status: string, ticketId: string): Promise<{
        status: number;
        success: boolean;
        message: string;
      }>;
    
      getAllInstructorData(): Promise<{
        status: number;
        success: boolean;
        message: string;
        instructorData?: InstructorDTO[];
      }>;
}
