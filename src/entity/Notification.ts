export default interface Notification {
    id: string;             // Unique identifier for the notification
    userId: string;         // The user who receives the notification
    title: string;          // Short title for the notification
    message: string;        // Full message of the notification
    isRead: boolean;        // Whether the notification has been read
    createdAt: Date;        // When the notification was created
  }