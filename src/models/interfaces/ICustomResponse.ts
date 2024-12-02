import { Response } from 'express';

export interface ICustomResponse extends Response {
  locals: {
    role: string;
  };
}
