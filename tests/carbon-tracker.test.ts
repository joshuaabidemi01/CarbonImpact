// carbon-tracker.test.ts
import { describe, expect, it, vi, beforeEach } from "vitest";

// Interfaces for type safety
interface ClarityResponse<T> {
  ok: boolean;
  value: T | number; // number for error codes
}

interface EmissionFactor {
  factor: number;
  unit: string;
  description: string;
  lastUpdated: number;
}

interface Activity {
  category: string;
  value: number;
  timestamp: number;
  co2: number;
}

interface CategoryStats {
  totalActivities: number;
  totalCo2: number;
}

interface ContractState {
  admin: string;
  totalActivitiesLogged: number;
  lastFactorUpdate: number;
  emissionFactors: Map<string, EmissionFactor>;
  userActivitySequences: Map<string, number>;
  activities: Map<string, Activity>; // Key: `${user}-${seq}`
  dailyAggregates: Map<string, number>; // Key: `${user}-${day}`
  categoryStatistics: Map<string, CategoryStats>;
  delegates: Map<string, boolean>; // Key: `${user}-${delegate}`
}

// Mock contract implementation
class CarbonTrackerMock {
  private state: ContractState = {
    admin: "deployer",
    totalActivitiesLogged: 0,
    lastFactorUpdate: 0,
    emissionFactors: new Map(),
    userActivitySequences: new Map(),
    activities: new Map(),
    dailyAggregates: new Map(),
    categoryStatistics: new Map(),
    delegates: new Map(),
  };

  private ERR_UNAUTHORIZED = 100;
  private ERR_INVALID_CATEGORY = 101;
  private ERR_INVALID_VALUE = 102;
  private ERR_FACTOR_NOT_FOUND = 103;
  private ERR_INVALID_FACTOR = 104;
  private ERR_MAX_ACTIVITIES_REACHED = 109;
  private MAX_ACTIVITIES_PER_USER = 10000;
  private MAX_CATEGORY_LEN = 50;

  private isAdmin(caller: string): boolean {
    return caller === this.state.admin;
  }

  private calculateCo2(category: string, value: number): ClarityResponse<number> {
    const factor = this.state.emissionFactors.get(category);
    if (!factor) {
      return { ok: false, value: this.ERR_FACTOR_NOT_FOUND };
    }
    return { ok: true, value: value * factor.factor };
  }

  private getCurrentDay(): number {
    return Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Use timestamp for mock
  }

  private updateDailyAggregate(user: string, co2: number): ClarityResponse<boolean> {
    const day = this.getCurrentDay();
    const key = `${user}-${day}`;
    const current = this.state.dailyAggregates.get(key) ?? 0;
    this.state.dailyAggregates.set(key, current + co2);
    return { ok: true, value: true };
  }

  private updateCategoryStats(category: string, co2: number): void {
    const stats = this.state.categoryStatistics.get(category) ?? { totalActivities: 0, totalCo2: 0 };
    stats.totalActivities += 1;
    stats.totalCo2 += co2;
    this.state.categoryStatistics.set(category, stats);
  }

  setAdmin(caller: string, newAdmin: string): ClarityResponse<boolean> {
    if (!this.isAdmin(caller)) {
      return { ok: false, value: this.ERR_UNAUTHORIZED };
    }
    this.state.admin = newAdmin;
    return { ok: true, value: true };
  }

  updateEmissionFactor(
    caller: string,
    category: string,
    factor: number,
    unit: string,
    description: string
  ): ClarityResponse<boolean> {
    if (!this.isAdmin(caller)) {
      return { ok: false, value: this.ERR_UNAUTHORIZED };
    }
    if (factor <= 0 || category.length > this.MAX_CATEGORY_LEN) {
      return { ok: false, value: this.ERR_INVALID_FACTOR };
    }
    const timestamp = Math.floor(Date.now() / 1000);
    this.state.emissionFactors.set(category, { factor, unit, description, lastUpdated: timestamp });
    this.state.lastFactorUpdate = timestamp;
    return { ok: true, value: true };
  }

  logActivity(caller: string, category: string, value: number): ClarityResponse<number> {
    if (value <= 0) {
      return { ok: false, value: this.ERR_INVALID_VALUE };
    }
    const currentSeq = this.state.userActivitySequences.get(caller) ?? 0;
    const newSeq = currentSeq + 1;
    if (newSeq > this.MAX_ACTIVITIES_PER_USER) {
      return { ok: false, value: this.ERR_MAX_ACTIVITIES_REACHED };
    }
    const co2Resp = this.calculateCo2(category, value);
    if (!co2Resp.ok) {
      return co2Resp as ClarityResponse<number>;
    }
    const co2 = co2Resp.value as number;
    const timestamp = Math.floor(Date.now() / 1000);
    this.state.activities.set(`${caller}-${newSeq}`, { category, value, timestamp, co2 });
    this.state.userActivitySequences.set(caller, newSeq);
    this.state.totalActivitiesLogged += 1;
    this.updateDailyAggregate(caller, co2);
    this.updateCategoryStats(category, co2);
    return { ok: true, value: newSeq };
  }

  getEmissionFactor(category: string): ClarityResponse<EmissionFactor | null> {
    return { ok: true, value: this.state.emissionFactors.get(category) ?? null };
  }

  getActivity(user: string, seq: number): ClarityResponse<Activity | null> {
    return { ok: true, value: this.state.activities.get(`${user}-${seq}`) ?? null };
  }

  getUserActivityCount(user: string): ClarityResponse<number> {
    return { ok: true, value: this.state.userActivitySequences.get(user) ?? 0 };
  }

  getFootprint(user: string, startSeq: number, endSeq: number): ClarityResponse<number> {
    const count = this.state.userActivitySequences.get(user) ?? 0;
    if (endSeq <= 0 || endSeq < startSeq || endSeq > count) {
      return { ok: false, value: this.ERR_INVALID_CATEGORY }; // Use as proxy for ERR_INVALID_PERIOD
    }
    let total = 0;
    for (let seq = startSeq; seq <= endSeq; seq++) {
      const act = this.state.activities.get(`${user}-${seq}`);
      if (act) total += act.co2;
    }
    return { ok: true, value: total };
  }

  getDailyFootprint(user: string, day: number): ClarityResponse<number> {
    return { ok: true, value: this.state.dailyAggregates.get(`${user}-${day}`) ?? 0 };
  }

  getCategoryStats(category: string): ClarityResponse<CategoryStats | null> {
    return { ok: true, value: this.state.categoryStatistics.get(category) ?? null };
  }

  initializeFactors(caller: string): ClarityResponse<boolean> {
    if (!this.isAdmin(caller)) {
      return { ok: false, value: this.ERR_UNAUTHORIZED };
    }
    this.updateEmissionFactor(caller, "car-gasoline-mile", 404, "miles", "CO2 per mile for gasoline car");
    // Add others similarly...
    return { ok: true, value: true };
  }

  // Add more methods as needed for full coverage
}

// Test setup
const accounts = {
  deployer: "deployer",
  user1: "wallet_1",
  user2: "wallet_2",
};

describe("CarbonTracker Contract", () => {
  let contract: CarbonTrackerMock;

  beforeEach(() => {
    contract = new CarbonTrackerMock();
    vi.resetAllMocks();
  });

  it("should allow admin to update emission factor", () => {
    const result = contract.updateEmissionFactor(accounts.deployer, "car-mile", 400, "miles", "Test desc");
    expect(result).toEqual({ ok: true, value: true });
    const factor = contract.getEmissionFactor("car-mile");
    expect(factor.ok).toBe(true);
    expect(factor.value?.factor).toBe(400);
  });

  it("should prevent non-admin from updating factor", () => {
    const result = contract.updateEmissionFactor(accounts.user1, "car-mile", 400, "miles", "Test");
    expect(result).toEqual({ ok: false, value: 100 });
  });

  it("should log activity and calculate CO2", () => {
    contract.updateEmissionFactor(accounts.deployer, "car-mile", 400, "miles", "Test");
    const logResult = contract.logActivity(accounts.user1, "car-mile", 10);
    expect(logResult.ok).toBe(true);
    expect(logResult.value).toBe(1);
    const activity = contract.getActivity(accounts.user1, 1);
    expect(activity.value?.co2).toBe(4000);
    const footprint = contract.getFootprint(accounts.user1, 1, 1);
    expect(footprint.value).toBe(4000);
  });

  it("should prevent logging with invalid value", () => {
    const logResult = contract.logActivity(accounts.user1, "unknown", 0);
    expect(logResult.ok).toBe(false);
    expect(logResult.value).toBe(102);
  });

  it("should get daily footprint", () => {
    contract.updateEmissionFactor(accounts.deployer, "car-mile", 400, "miles", "Test");
    contract.logActivity(accounts.user1, "car-mile", 10);
    const day = contract.getCurrentDay(); // Assuming same day
    const daily = contract.getDailyFootprint(accounts.user1, day);
    expect(daily.value).toBe(4000);
  });

  it("should initialize factors", () => {
    const initResult = contract.initializeFactors(accounts.deployer);
    expect(initResult.ok).toBe(true);
    const factor = contract.getEmissionFactor("car-gasoline-mile");
    expect(factor.value?.factor).toBe(404);
  });

});