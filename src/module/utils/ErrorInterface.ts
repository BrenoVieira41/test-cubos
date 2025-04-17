export interface CustomError extends Error {
  status?: number;
}

export const PRISMA_ERROR = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
