interface Announcement {
    id: string;
    courseId: string | null;
    instructorId: string | null;
    title: string;
    message: string;
    createdAt: Date;
    course: {
      name: string;
    } | null;
    instructor: {
      name: string;
    } | null;
  }
  
  export default Announcement;
  