import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export interface Context {
  prisma: PrismaClient;
  loaders: Map<string, DataLoader<unknown, unknown>>;
}

export const createContext = (prisma: PrismaClient): Context => ({
  prisma,
  loaders: new Map(),
});