import type { Student, Teacher, Announcement, Assignment } from "./types";

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Ananya", "Diya", "Aadhya", "Saanvi", "Aanya", "Pari", "Anaya", "Myra", "Sara", "Iraa", "Kabir", "Advait", "Dhruv", "Kiaan", "Aryan", "Ria", "Nisha", "Kavya", "Tara", "Zara"];
const lastNames = ["Sharma", "Verma", "Patel", "Kumar", "Singh", "Gupta", "Mehta", "Rao", "Iyer", "Reddy", "Joshi", "Nair", "Khan", "Das", "Kapoor"];
const subjects = ["Mathematics", "English", "Science", "Social Studies", "Hindi", "Computer Science", "Physics", "Chemistry", "Biology", "History"];
const palette = ["#667eea", "#764ba2", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];

function makeStudents(): Student[] {
  const out: Student[] = [];
  let i = 0;
  for (let grade = 1; grade <= 10; grade++) {
    for (const section of ["A", "B"]) {
      const count = 3 + (grade % 3);
      for (let n = 0; n < count; n++) {
        const fn = pick(firstNames, i * 3 + n);
        const ln = pick(lastNames, i + n);
        out.push({
          id: `S${String(i + 1).padStart(4, "0")}`,
          name: `${fn} ${ln}`,
          roll: `${grade}${section}${String(n + 1).padStart(2, "0")}`,
          grade,
          section,
          attendance: 70 + Math.floor(((i * 7) % 30)),
          feeStatus: i % 5 === 0 ? "Overdue" : i % 3 === 0 ? "Pending" : "Paid",
          parent: `${pick(firstNames, i + 5)} ${ln}`,
          parentPhone: `+91 9${String(800000000 + i * 137).slice(0, 9)}`,
          gender: i % 2 === 0 ? "M" : "F",
          avatarColor: pick(palette, i),
        });
        i++;
      }
    }
  }
  return out;
}

function makeTeachers(): Teacher[] {
  const out: Teacher[] = [];
  for (let i = 0; i < 18; i++) {
    const fn = pick(firstNames, i * 2 + 1);
    const ln = pick(lastNames, i * 3 + 2);
    out.push({
      id: `T${String(i + 1).padStart(3, "0")}`,
      name: `${fn} ${ln}`,
      subject: pick(subjects, i),
      classes: [`${(i % 10) + 1}-A`, `${((i + 3) % 10) + 1}-B`],
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@scholarii.school`,
      phone: `+91 98${String(76543210 + i * 11).slice(0, 8)}`,
      rating: 3.5 + ((i % 4) * 0.4),
      status: i % 7 === 0 ? "On Leave" : "Active",
      avatarColor: pick(palette, i + 2),
    });
  }
  return out;
}

function makeAnnouncements(): Announcement[] {
  const items = [
    { title: "Annual Sports Day on Dec 15", audience: "All" as const, priority: "Important" as const, message: "Join us for the Annual Sports Day. All students must report by 8 AM in proper sports uniform." },
    { title: "Mid-term Exam Schedule Released", audience: "Students" as const, priority: "Important" as const, message: "The mid-term examination schedule has been published. Please check your dashboard." },
    { title: "PTA Meeting — Class 10", audience: "Parents" as const, priority: "Normal" as const, message: "PTA meeting for class 10 parents on Saturday at 10 AM in the auditorium." },
    { title: "Diwali Holidays Announced", audience: "All" as const, priority: "Normal" as const, message: "The school will remain closed from Oct 28 to Nov 5 for Diwali festivities." },
    { title: "Fee Payment Deadline Extended", audience: "Parents" as const, priority: "Urgent" as const, message: "The Q3 fee payment deadline has been extended to Nov 10. Late fees will apply after." },
  ];
  return items.map((it, i) => ({
    id: `A${i + 1}`,
    ...it,
    date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    reads: 80 + (i * 35) % 200,
    recipients: 450,
  }));
}

function makeAssignments(): Assignment[] {
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `AS${i + 1}`,
    title: `${pick(subjects, i)} Worksheet ${i + 1}`,
    subject: pick(subjects, i),
    class: `${(i % 6) + 5}-A`,
    dueDate: new Date(Date.now() + (i - 2) * 86400000 * 2).toISOString(),
    submitted: 20 + i * 3,
    total: 35,
    graded: 10 + i * 2,
  }));
}

const KEY = "scholarii-data-v1";

interface StoreData {
  students: Student[];
  teachers: Teacher[];
  announcements: Announcement[];
  assignments: Assignment[];
}

export function loadData(): StoreData {
  if (typeof window === "undefined") {
    return { students: makeStudents(), teachers: makeTeachers(), announcements: makeAnnouncements(), assignments: makeAssignments() };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const fresh = { students: makeStudents(), teachers: makeTeachers(), announcements: makeAnnouncements(), assignments: makeAssignments() };
  localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
}

export function saveData(data: StoreData) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(data));
}

// Charts
export const monthlyAttendance = [
  { m: "Apr", v: 92 }, { m: "May", v: 88 }, { m: "Jun", v: 90 },
  { m: "Jul", v: 94 }, { m: "Aug", v: 91 }, { m: "Sep", v: 93 },
  { m: "Oct", v: 95 }, { m: "Nov", v: 92 },
];

export const feeCollection = [
  { m: "Apr", v: 480000 }, { m: "May", v: 520000 }, { m: "Jun", v: 610000 },
  { m: "Jul", v: 590000 }, { m: "Aug", v: 640000 }, { m: "Sep", v: 700000 },
  { m: "Oct", v: 720000 }, { m: "Nov", v: 685000 },
];

export const classPerformance = [
  { c: "1", v: 78 }, { c: "2", v: 82 }, { c: "3", v: 80 },
  { c: "4", v: 85 }, { c: "5", v: 79 }, { c: "6", v: 83 },
  { c: "7", v: 86 }, { c: "8", v: 81 }, { c: "9", v: 84 }, { c: "10", v: 88 },
];
