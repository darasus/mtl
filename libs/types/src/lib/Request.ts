import { FastifyRequest } from 'fastify';

export type Request = FastifyRequest & { user?: any };
