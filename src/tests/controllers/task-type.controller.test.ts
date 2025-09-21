import request from 'supertest';
import express from 'express';
import * as taskTypeController from '../../controllers/task-type.controller';
import TaskTypeModel from '../../models/task-type.model';

jest.mock('../../models/task-type.model');

const app = express();
app.use(express.json());

app.get('/task-types', taskTypeController.getAllTaskType);
app.post('/task-types', taskTypeController.createTaskType);
app.put('/task-types/:id', taskTypeController.updateTaskType);
app.delete('/task-types/:id', taskTypeController.deleteTaskType);

describe('TaskType Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all task types', async () => {
    (TaskTypeModel.find as jest.Mock).mockResolvedValue([
      { _id: '1', name: 'Bug', code: 'BUG' }
    ]);

    const res = await request(app).get('/task-types');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ _id: '1', name: 'Bug', code: 'BUG' }]);
  });

  it('should create a new task type', async () => {
    (TaskTypeModel.findOne as jest.Mock).mockResolvedValue(null);

    const saveMock = jest.fn().mockResolvedValue({
      _id: '1',
      name: 'Feature',
      code: 'FEATURE',
      icon: '⚡',
      isActive: true,
      isSubTask: false,
    });

    (TaskTypeModel as unknown as jest.Mock).mockImplementation(() => ({
      save: saveMock,
    }));

    const res = await request(app).post('/task-types').send({
      name: 'Feature',
      icon: '⚡',
      isActive: true,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Feature');
  });

  it('should not create duplicate task type', async () => {
    (TaskTypeModel.findOne as jest.Mock).mockResolvedValue({ _id: '1', name: 'Bug' });

    const res = await request(app).post('/task-types').send({
      name: 'Bug',
      icon: '🐞',
      isActive: true,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should update a task type', async () => {
    (TaskTypeModel.findById as jest.Mock).mockResolvedValue({
      _id: '1',
      name: 'Bug',
      code: 'BUG',
      icon: '🐞',
      isActive: true,
      isSubTask: false,
    });

    (TaskTypeModel.findOne as jest.Mock).mockResolvedValue(null);

    (TaskTypeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      _id: '1',
      name: 'Issue',
      code: 'BUG',
      icon: '🐞',
      isActive: true,
      isSubTask: false,
    });

    const res = await request(app).put('/task-types/1').send({
      name: 'Issue',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Issue');
  });

  it('should delete a task type', async () => {
    (TaskTypeModel.findById as jest.Mock).mockResolvedValue({
      _id: '1',
      name: 'Bug',
    });

    (TaskTypeModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});

    const res = await request(app).delete('/task-types/1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 when deleting non-existing task type', async () => {
    (TaskTypeModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).delete('/task-types/999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
