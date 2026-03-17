import { test, expect, describe } from "bun:test";
import {
  SECTION_KEYS,
  mockCreatorCourses,
  mockCourseSales,
  mockCourseProgress,
  mockConsultationBookings,
  mockNotifications,
  mockWeeklySchedule,
  mockTodaySessions,
  mockAIRecords,
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

  test("mockConsultationBookings is non-empty", () => {
    expect(mockConsultationBookings.length).toBeGreaterThan(0);
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

  test("mockAIRecords is non-empty", () => {
    expect(mockAIRecords.length).toBeGreaterThan(0);
  });
});

// ─── SECTION_KEYS ─────────────────────────────────────────────

describe("SECTION_KEYS", () => {
  test("has exactly 9 items", () => {
    expect(SECTION_KEYS.length).toBe(9);
  });

  test("contains expected keys", () => {
    expect(SECTION_KEYS).toContain("course-create");
    expect(SECTION_KEYS).toContain("course-sales");
    expect(SECTION_KEYS).toContain("course-progress");
    expect(SECTION_KEYS).toContain("course-management");
    expect(SECTION_KEYS).toContain("consultation-scheduler");
    expect(SECTION_KEYS).toContain("consultation-notifications");
    expect(SECTION_KEYS).toContain("available-time-settings");
    expect(SECTION_KEYS).toContain("consultation-room");
    expect(SECTION_KEYS).toContain("ai-consultation-history");
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
