import request from 'supertest';
import express from 'express';
import * as priorityController from '../../controllers/priority.controller';
import PriorityModel from '../../models/priority.model';

jest.mock('../../models/priority.model');

const app = express();
app.use(express.json());

app.get('/priorities', priorityController.getAllPriorities);
app.get('/priorities/:id', priorityController.getPriorityById);
app.post('/priorities', priorityController.createPriority);
app.put('/priorities/:id', priorityController.updatePriority);
app.delete('/priorities/:id', priorityController.deletePriority);

describe('Priority Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all priorities', async () => {
    (PriorityModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ name: 'High', level: 1 }]),
    });

    const res = await request(app).get('/priorities');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ name: 'High', level: 1 }]);
  });

  it('should get priority by id', async () => {
    (PriorityModel.findById as jest.Mock).mockResolvedValue({ _id: '1', name: 'Low' });

    const res = await request(app).get('/priorities/1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({ _id: '1', name: 'Low' });
  });

  it('should return 404 when priority not found', async () => {
    (PriorityModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/priorities/999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Priority not found');
  });

  it('should create a priority', async () => {
    (PriorityModel.findOne as jest.Mock).mockResolvedValue(null);

    const saveMock = jest.fn().mockResolvedValue({ _id: '1', name: 'High', code: 'high' });
    (PriorityModel as any).mockImplementation(() => ({ save: saveMock }));

    const res = await request(app)
      .post('/priorities')
      .send({ name: 'High', level: 1, color: '#f00' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({ _id: '1', name: 'High', code: 'high' });
  });

  it('should update a priority', async () => {
    const saveMock = jest.fn().mockResolvedValue({ _id: '1', name: 'Updated' });

    (PriorityModel.findById as jest.Mock).mockResolvedValue({ save: saveMock });
    (PriorityModel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put('/priorities/1')
      .send({ name: 'Updated', level: 2, color: '#0f0' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated');
  });

  it('should delete a priority', async () => {
    const deleteMock = jest.fn().mockResolvedValue({});
    (PriorityModel.findById as jest.Mock).mockResolvedValue({ deleteOne: deleteMock });

    const res = await request(app).delete('/priorities/1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Priority deleted successfully');
  });
});
