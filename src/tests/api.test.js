const request = require('supertest');
const express = require('express');
const apiRouter = require('../routes/api');
const tvShowController = require('../controllers/tvShowController');

jest.mock('../controllers/tvShowController');

const app = express();
app.use('/api', apiRouter);

describe('API Routes', () => {
  it('GET /api/shows should call getAllShows controller', async () => {
    tvShowController.getAllShows.mockImplementation((req, res) => {
      res.json({ message: 'All Shows' });
    });

    const response = await request(app).get('/api/shows');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'All Shows' });
    expect(tvShowController.getAllShows).toHaveBeenCalled();
  });
});
