import type { Request, Response, NextFunction } from 'express';
export declare const transferPoints: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCurrentUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const clerkWebhook: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map