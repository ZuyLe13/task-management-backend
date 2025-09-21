import request from 'supertest';
import express from 'express';
import * as userController from '../../controllers/user.controller';
import UserModel from '../../models/user.model';

jest.mock('../../models/user.model');

const app = express();
app.use(express.json());

// mock middleware để gắn req.user
app.use((req, _res, next) => {
  (req as any).user = { _id: '123' }; // giả lập user login
  next();
});

app.get('/user/profile', userController.getUserProfile);
app.put('/user/profile', userController.updateUserProfile);

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return 400 if userId not found in token', async () => {
      // bỏ req.user
      const appNoUser = express();
      appNoUser.use(express.json());
      appNoUser.get('/user/profile', userController.getUserProfile);

      const res = await request(appNoUser).get('/user/profile');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User ID not found in token');
    });

    it('should return 404 if user not found', async () => {
      (UserModel.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app).get('/user/profile');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return user profile successfully', async () => {
      (UserModel.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: '123', fullName: 'John Doe' }),
      });

      const res = await request(app).get('/user/profile');
      expect(res.status).toBe(200);
      expect(res.body.fullName).toBe('John Doe');
    });
  });

  describe('updateUserProfile', () => {
    it('should return 400 if userId not found in token', async () => {
      const appNoUser = express();
      appNoUser.use(express.json());
      appNoUser.put('/user/profile', userController.updateUserProfile);

      const res = await request(appNoUser).put('/user/profile').send({ fullName: 'New Name' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User ID not found in token');
    });

    it('should return 404 if user not found', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const res = await request(app).put('/user/profile').send({ fullName: 'New Name' });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should update user profile successfully', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: '123',
        fullName: 'Updated Name',
        email: 'test@example.com',
      });

      const res = await request(app).put('/user/profile').send({ fullName: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body.fullName).toBe('Updated Name');
      expect(res.body.email).toBe('test@example.com');
    });
  });
});
