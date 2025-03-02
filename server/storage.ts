import { IStorage } from "./storage";
import { InsertUser, User, DataPoint } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dataPoints: Map<number, DataPoint>;
  private currentUserId: number;
  private currentDataPointId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.dataPoints = new Map();
    this.currentUserId = 1;
    this.currentDataPointId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDataPoints(): Promise<DataPoint[]> {
    return Array.from(this.dataPoints.values());
  }

  async createDataPoint(data: Omit<DataPoint, "id">): Promise<DataPoint> {
    const id = this.currentDataPointId++;
    const dataPoint = { ...data, id };
    this.dataPoints.set(id, dataPoint);
    return dataPoint;
  }
}

export const storage = new MemStorage();
