export type Role = "principal" | "teacher" | "student" | "admin" | "parent";

export interface User {
  email: string;
  name: string;
  role: Role;
  avatarColor: string;
}

export interface Student {
  id: string;
  name: string;
  roll: string;
  grade: number;
  section: string;
  attendance: number;
  feeStatus: "Paid" | "Pending" | "Overdue";
  parent: string;
  parentPhone: string;
  gender: "M" | "F";
  avatarColor: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  email: string;
  phone: string;
  rating: number;
  status: "Active" | "On Leave";
  avatarColor: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: "All" | "Students" | "Teachers" | "Parents";
  priority: "Normal" | "Important" | "Urgent";
  date: string;
  reads: number;
  recipients: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  submitted: number;
  total: number;
  graded: number;
}
