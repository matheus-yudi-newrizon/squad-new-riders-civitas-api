import { Response } from 'express';

export interface CustomResponse extends Response {
  locals: {
    role: string;
  };
}
