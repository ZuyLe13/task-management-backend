import request from 'supertest';
import express from 'express';
import * as taskController from '../../controllers/task.controller';
import TaskModel from '../../models/task.model';

// Mock TaskModel methods
jest.mock('../../models/task.model');

const app = express();
app.use(express.json());
app.get('/tasks', taskController.getAllTask);
app.post('/tasks', taskController.createTask);
app.put('/tasks/:id', taskController.updateTask);
app.delete('/tasks/:taskKey', taskController.deleteTask);
app.patch('/tasks/:taskKey/status', taskController.updateTaskStatus);

describe('Task Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all tasks', async () => {
    (TaskModel.find as jest.Mock).mockResolvedValue([{ taskKey: 'ZT-1' }]);
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ taskKey: 'ZT-1' }]);
  });

  it('should create a task', async () => {
    (TaskModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });

    // Mock save method
    TaskModel.prototype.save = jest.fn().mockResolvedValue({ taskKey: 'ZT-1', name: 'Test' });

    const res = await request(app).post('/tasks').send({ name: 'Test' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.taskKey).toBe('ZT-1');
  });

  it('should update a task', async () => {
    (TaskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: '1', name: 'Updated' });
    const res = await request(app).put('/tasks/1').send({ name: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should delete a task', async () => {
    (TaskModel.findOneAndDelete as jest.Mock).mockResolvedValue({ taskKey: 'ZT-1' });
    const res = await request(app).delete('/tasks/ZT-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should update task status', async () => {
    (TaskModel.findOneAndUpdate as jest.Mock).mockResolvedValue({ taskKey: 'ZT-1', status: 'done' });
    const res = await request(app).patch('/tasks/ZT-1/status').send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});