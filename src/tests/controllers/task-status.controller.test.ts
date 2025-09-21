import request from 'supertest';
import express from 'express';
import * as taskStatusController from '../../controllers/task-status.controller';
import TaskStatusModel from '../../models/task-status.model';

jest.mock('../../models/task-status.model');

const app = express();
app.use(express.json());

app.get('/task-status', taskStatusController.getTaskStatus);
app.post('/task-status', taskStatusController.createTaskStatus);
app.put('/task-status/:id', taskStatusController.updateTaskStatus);
app.delete('/task-status/:id', taskStatusController.deleteTaskStatus);

describe('Task Status Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all task statuses', async () => {
    (TaskStatusModel.find as jest.Mock).mockResolvedValue([
      { _id: '1', name: 'Open', code: 'open' },
    ]);

    const res = await request(app).get('/task-status');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ _id: '1', name: 'Open', code: 'open' }]);
  });

  it('should create a new task status', async () => { 
    (TaskStatusModel.create as jest.Mock).mockResolvedValue(null); 

    const mockInstance = {
      name: 'In Progress',
      code: 'IN_PROGRESS', 
      color: '#00f',
      isActive: true,
      isDefault: false,
      save: jest.fn().mockResolvedValue(undefined)
    };

    (TaskStatusModel as any).mockImplementation(() => mockInstance);

    const res = await request(app) 
      .post('/task-status') 
      .send({ name: 'In Progress', color: '#00f', isActive: true }); 

    expect(res.status).toBe(201); 
    expect(res.body.success).toBe(true); 
    expect(res.body.data.name).toEqual('In Progress'); 
  });

  it('should not create duplicate task status', async () => {
    (TaskStatusModel.findOne as jest.Mock).mockResolvedValue({
      _id: '1',
      name: 'Open',
      code: 'open',
    });

    const res = await request(app)
      .post('/task-status')
      .send({ name: 'Open', color: '#f00' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/);
  });

  it('should update a task status', async () => {
    const saveMock = jest.fn().mockResolvedValue({
      _id: '1',
      name: 'Updated',
      code: 'updated',
      color: '#0f0',
    });

    (TaskStatusModel.findById as jest.Mock).mockResolvedValue({
      _id: '1',
      name: 'Old',
      code: 'old',
      save: saveMock,
    });
    (TaskStatusModel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put('/task-status/1')
      .send({ name: 'Updated', color: '#0f0' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated');
  });

  it('should delete a task status', async () => {
    const deleteMock = jest.fn().mockResolvedValue({});

    (TaskStatusModel.findById as jest.Mock).mockResolvedValue({
      _id: '1',
      name: 'To Delete',
      deleteOne: deleteMock,
    });

    const res = await request(app).delete('/task-status/1');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task status deleted successfully');
  });

  it('should return 404 when deleting non-existent task status', async () => {
    (TaskStatusModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).delete('/task-status/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task status not found');
  });
});
