import { test, expect, describe } from "bun:test";
import {
  SECTION_KEYS,
  mockCreatorCourses,
  mockCourseSales,
  mockCourseProgress,
  mockChapterProgress,
  mockStudentActivity,
  mockConsultationBookings,
  mockNotifications,
  mockWeeklySchedule,
  mockTodaySessions,
  mockAIRecords,
  mockAIConsultationDetails,
} from "../data/creator-studio";

// ─── Array Non-Empty ──────────────────────────────────────────

describe("mock data arrays are non-empty", () => {
  test("mockCreatorCourses is non-empty", () => {
    expect(mockCreatorCourses.length).toBeGreaterThan(0);
  });

  test("mockCourseSales is non-empty", () => {
    expect(mockCourseSales.length).toBeGreaterThan(0);
  });

  test("mockCourseProgress is non-empty", () => {
    expect(mockCourseProgress.length).toBeGreaterThan(0);
  });

  test("mockConsultationBookings has at least 10 entries", () => {
    expect(mockConsultationBookings.length).toBeGreaterThanOrEqual(10);
  });

  test("mockNotifications is non-empty", () => {
    expect(mockNotifications.length).toBeGreaterThan(0);
  });

  test("mockWeeklySchedule is non-empty", () => {
    expect(mockWeeklySchedule.length).toBeGreaterThan(0);
  });

  test("mockTodaySessions is non-empty", () => {
    expect(mockTodaySessions.length).toBeGreaterThan(0);
  });

  test("mockAIRecords has at least 12 entries", () => {
    expect(mockAIRecords.length).toBeGreaterThanOrEqual(12);
  });
});

// ─── SECTION_KEYS ─────────────────────────────────────────────

describe("SECTION_KEYS", () => {
  test("has exactly 6 items", () => {
    expect(SECTION_KEYS.length).toBe(6);
  });

  test("contains expected keys", () => {
    expect(SECTION_KEYS).toContain("course-sales");
    expect(SECTION_KEYS).toContain("course-management");
    expect(SECTION_KEYS).toContain("consultation-scheduler");
    expect(SECTION_KEYS).toContain("available-time-settings");
    expect(SECTION_KEYS).toContain("consultation-room");
    expect(SECTION_KEYS).toContain("ai-consultation-history");
  });
});

// ─── Consultation Bookings Across Months ──────────────────────

describe("mockConsultationBookings date coverage", () => {
  test("has bookings in February 2026", () => {
    const febBookings = mockConsultationBookings.filter((b) =>
      b.date.startsWith("2026-02")
    );
    expect(febBookings.length).toBeGreaterThan(0);
  });

  test("has bookings in March 2026", () => {
    const marBookings = mockConsultationBookings.filter((b) =>
      b.date.startsWith("2026-03")
    );
    expect(marBookings.length).toBeGreaterThan(0);
  });

  test("has bookings in April 2026", () => {
    const aprBookings = mockConsultationBookings.filter((b) =>
      b.date.startsWith("2026-04")
    );
    expect(aprBookings.length).toBeGreaterThan(0);
  });
});

// ─── AI Consultation Details ──────────────────────────────────

describe("mockAIConsultationDetails", () => {
  test("is non-empty", () => {
    expect(Object.keys(mockAIConsultationDetails).length).toBeGreaterThan(0);
  });

  test("each detail has valid required fields", () => {
    const koreanRegex = /[\uAC00-\uD7AF]/;
    for (const detail of Object.values(mockAIConsultationDetails)) {
      expect(detail.id).toBeGreaterThan(0);
      expect(koreanRegex.test(detail.clientName)).toBe(true);
      expect(detail.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(koreanRegex.test(detail.summary)).toBe(true);
      expect(detail.keyPoints.length).toBeGreaterThan(0);
      expect(detail.recommendations.length).toBeGreaterThan(0);
      expect(detail.actionItems.length).toBeGreaterThan(0);
      expect(["positive", "neutral", "negative"]).toContain(detail.sentiment);
      expect(detail.keyTopics.length).toBeGreaterThan(0);
    }
  });
});

// ─── Status Values (Spot Check First Item) ────────────────────

describe("first item status values", () => {
  test("first course has valid status", () => {
    const validStatuses = ["draft", "published", "archived"];
    expect(validStatuses).toContain(mockCreatorCourses[0].status);
  });

  test("first consultation booking has valid status", () => {
    const validStatuses = ["confirmed", "pending", "completed", "cancelled"];
    expect(validStatuses).toContain(mockConsultationBookings[0].status);
  });

  test("first notification has valid type", () => {
    const validTypes = ["new_booking", "cancellation", "reminder", "review"];
    expect(validTypes).toContain(mockNotifications[0].type);
  });

  test("first today session has valid status", () => {
    const validStatuses = ["waiting", "in_progress", "completed"];
    expect(validStatuses).toContain(mockTodaySessions[0].status);
  });

  test("first AI record has valid sentiment", () => {
    const validSentiments = ["positive", "neutral", "negative"];
    expect(validSentiments).toContain(mockAIRecords[0].sentiment);
  });
});

// ─── Price/Count Fields Are Positive Numbers ──────────────────

describe("price and count fields are positive numbers", () => {
  test("course prices are positive", () => {
    for (const course of mockCreatorCourses) {
      expect(course.price).toBeGreaterThan(0);
    }
  });

  test("published courses have positive student counts", () => {
    const published = mockCreatorCourses.filter(
      (c) => c.status === "published"
    );
    for (const course of published) {
      expect(course.studentCount).toBeGreaterThan(0);
    }
  });

  test("course sales totalRevenue are positive", () => {
    for (const sale of mockCourseSales) {
      expect(sale.totalRevenue).toBeGreaterThan(0);
    }
  });

  test("consultation booking prices are positive", () => {
    for (const booking of mockConsultationBookings) {
      expect(booking.price).toBeGreaterThan(0);
    }
  });

  test("course progress totalStudents are positive", () => {
    for (const progress of mockCourseProgress) {
      expect(progress.totalStudents).toBeGreaterThan(0);
    }
  });
});

// ─── Korean Text in Title/Name Fields ─────────────────────────

describe("Korean text exists in title/name fields", () => {
  const koreanRegex = /[\uAC00-\uD7AF]/;

  test("course titles contain Korean", () => {
    for (const course of mockCreatorCourses) {
      expect(koreanRegex.test(course.title)).toBe(true);
    }
  });

  test("consultation client names contain Korean", () => {
    for (const booking of mockConsultationBookings) {
      expect(koreanRegex.test(booking.clientName)).toBe(true);
    }
  });

  test("notification messages contain Korean", () => {
    for (const notification of mockNotifications) {
      expect(koreanRegex.test(notification.message)).toBe(true);
    }
  });

  test("AI record client names contain Korean", () => {
    for (const record of mockAIRecords) {
      expect(koreanRegex.test(record.clientName)).toBe(true);
    }
  });

  test("weekly schedule days contain Korean", () => {
    for (const slot of mockWeeklySchedule) {
      expect(koreanRegex.test(slot.day)).toBe(true);
    }
  });

  test("today session product names contain Korean", () => {
    for (const session of mockTodaySessions) {
      expect(koreanRegex.test(session.productName)).toBe(true);
    }
  });
});

// ─── Chapter Progress & Student Activity ──────────────────────

describe("mockChapterProgress", () => {
  test("has data for courses with students (1, 2, 5)", () => {
    expect(mockChapterProgress[1]).toBeDefined();
    expect(mockChapterProgress[2]).toBeDefined();
    expect(mockChapterProgress[5]).toBeDefined();
  });

  test("does not have data for draft courses (3, 4)", () => {
    expect(mockChapterProgress[3]).toBeUndefined();
    expect(mockChapterProgress[4]).toBeUndefined();
  });

  test("each course has chapters with valid data", () => {
    const koreanRegex = /[\uAC00-\uD7AF]/;
    for (const courseId of [1, 2, 5]) {
      const chapters = mockChapterProgress[courseId];
      expect(chapters.length).toBeGreaterThanOrEqual(4);
      for (const chapter of chapters) {
        expect(chapter.chapterId).toBeGreaterThan(0);
        expect(koreanRegex.test(chapter.chapterTitle)).toBe(true);
        expect(chapter.completionRate).toBeGreaterThanOrEqual(0);
        expect(chapter.completionRate).toBeLessThanOrEqual(100);
        expect(chapter.totalLessons).toBeGreaterThan(0);
        expect(chapter.completedLessons).toBeLessThanOrEqual(chapter.totalLessons);
      }
    }
  });
});

describe("mockStudentActivity", () => {
  test("has data for courses with students (1, 2, 5)", () => {
    expect(mockStudentActivity[1]).toBeDefined();
    expect(mockStudentActivity[2]).toBeDefined();
    expect(mockStudentActivity[5]).toBeDefined();
  });

  test("does not have data for draft courses (3, 4)", () => {
    expect(mockStudentActivity[3]).toBeUndefined();
    expect(mockStudentActivity[4]).toBeUndefined();
  });

  test("each course has students with valid data", () => {
    const koreanRegex = /[\uAC00-\uD7AF]/;
    for (const courseId of [1, 2, 5]) {
      const students = mockStudentActivity[courseId];
      expect(students.length).toBeGreaterThanOrEqual(3);
      for (const student of students) {
        expect(student.id).toBeGreaterThan(0);
        expect(koreanRegex.test(student.studentName)).toBe(true);
        expect(student.progress).toBeGreaterThanOrEqual(0);
        expect(student.progress).toBeLessThanOrEqual(100);
        expect(student.completedLessons).toBeLessThanOrEqual(student.totalLessons);
      }
    }
  });
});
