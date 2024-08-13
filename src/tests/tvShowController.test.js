const TvShow = require('../models/TvShow');
const { getAllShows } = require('../controllers/tvShowController');

jest.mock('../models/TvShow');

describe('getAllShows', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  it('should return paginated TV shows with cast sorted by birthday', async () => {
    const mockShows = [
      {
        id: '1',
        name: 'Show 1',
        cast: [
          { id: '1', name: 'Cast 1', birthday: '1980-01-01' },
          { id: '2', name: 'Cast 2', birthday: '1975-01-01' }
        ]
      },
      {
        id: '2',
        name: 'Show 2',
        cast: [
          { id: '3', name: 'Cast 3', birthday: '1990-01-01' },
          { id: '4', name: 'Cast 4', birthday: '1985-01-01' }
        ]
      }
    ];

    TvShow.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(mockShows)
    });

    TvShow.countDocuments.mockResolvedValue(2);

    await getAllShows(req, res);

    expect(TvShow.find).toHaveBeenCalled();
    expect(TvShow.countDocuments).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      totalPages: 1,
      totalShows: 2,
      shows: [
        {
          id: '1',
          name: 'Show 1',
          cast: [
            { id: '1', name: 'Cast 1', birthday: '1980-01-01' },
            { id: '2', name: 'Cast 2', birthday: '1975-01-01' }
          ]
        },
        {
          id: '2',
          name: 'Show 2',
          cast: [
            { id: '3', name: 'Cast 3', birthday: '1990-01-01' },
            { id: '4', name: 'Cast 4', birthday: '1985-01-01' }
          ]
        }
      ]
    });
  });

  it('should handle pagination parameters', async () => {
    req.query.page = '2';
    req.query.limit = '5';

    const mockShows = [
      {
        id: '3',
        name: 'Show 3',
        cast: [
          { id: '5', name: 'Cast 5', birthday: '1982-01-01' }
        ]
      }
    ];

    TvShow.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(mockShows)
    });

    TvShow.countDocuments.mockResolvedValue(6);

    await getAllShows(req, res);

    expect(TvShow.find).toHaveBeenCalled();
    expect(TvShow.countDocuments).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      totalPages: 2,
      totalShows: 6,
      shows: [
        {
          id: '3',
          name: 'Show 3',
          cast: [
            { id: '5', name: 'Cast 5', birthday: '1982-01-01' }
          ]
        }
      ]
    });
  });

  it('should handle errors', async () => {
    const errorMessage = 'Test Error';
    TvShow.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockRejectedValue(new Error(errorMessage))
    });

    await getAllShows(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching shows' });
  });
});
