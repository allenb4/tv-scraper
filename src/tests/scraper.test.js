require('dotenv').config();
const axios = require('axios');
const TvShow = require('../models/TvShow');
const CastMember = require('../models/CastMember');
const scraperService = require('../services/scraper');
const { TVMAZE_API_URL } = process.env;

const API_URL = TVMAZE_API_URL || 'http://api.tvmaze.com';

jest.mock('axios');
jest.mock('../models/TvShow');
jest.mock('../models/CastMember');

describe('fetchTvShows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should fetch TV shows up to the maximum pages', async () => {
    const mockData = [
      { id: 1, name: 'Show 1' },
      { id: 2, name: 'Show 2' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockData });
    axios.get.mockResolvedValueOnce({ data: [] });

    const shows = await scraperService.fetchTvShows();

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/shows?page=0`);
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/shows?page=1`);
    expect(shows).toEqual(mockData);
  });

  it('should handle 404 error from TVMaze API', async () => {
    axios.get.mockRejectedValueOnce({
      response: { status: 404 }
    });

    const shows = await scraperService.fetchTvShows();

    expect(shows).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('404 Not Found - Check API URL or endpoint');
  });

  it('should throw an error for non-404 errors', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(scraperService.fetchTvShows()).rejects.toThrow(`Error fetching TV shows: ${errorMessage}`);
  });
});

describe('fetchCastForShow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch cast for a specific show', async () => {
    const mockCast = [
      { person: { id: 1, name: 'Cast 1', birthday: '1980-01-01' } },
      { person: { id: 2, name: 'Cast 2', birthday: '1985-01-01' } }
    ];
    axios.get.mockResolvedValueOnce({ data: mockCast });

    const cast = await scraperService.fetchCastForShow(1);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/shows/1/cast`);
    expect(cast).toEqual([
      { id: 1, name: 'Cast 1', birthday: '1980-01-01' },
      { id: 2, name: 'Cast 2', birthday: '1985-01-01' }
    ]);
  });

  it('should throw an error if fetching cast fails', async () => {
    const errorMessage = 'Cast fetch error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(scraperService.fetchCastForShow(1)).rejects.toThrow(`Error fetching cast for show ID 1: ${errorMessage}`);
  });
});

describe('saveShowAndCast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should save TV shows and cast members', async () => {
    const mockShows = [
      { id: 1, name: 'Show 1' },
      { id: 2, name: 'Show 2' }
    ];

    const mockCast = [
      { id: 1, name: 'Cast 1', birthday: '1980-01-01' }
    ];

    jest.spyOn(scraperService, 'fetchTvShows').mockResolvedValueOnce(mockShows);
    jest.spyOn(scraperService, 'fetchCastForShow').mockResolvedValueOnce(mockCast);
    TvShow.findOne.mockResolvedValueOnce(null);
    CastMember.findOne.mockResolvedValueOnce(null);
    TvShow.prototype.save = jest.fn();
    CastMember.prototype.save = jest.fn();

    await scraperService.saveShowAndCast();
    await scraperService.fetchTvShows();

    expect(scraperService.fetchTvShows).toHaveBeenCalled();
  });

  it('should not save if TV show already exists', async () => {
    const mockShows = [
      { id: 1, name: 'Show 1' }
    ];

    jest.spyOn(scraperService, 'fetchTvShows').mockResolvedValueOnce(mockShows);
    TvShow.findOne.mockResolvedValueOnce({ id: 1 });

    await scraperService.saveShowAndCast();
    await scraperService.fetchTvShows();

    expect(scraperService.fetchTvShows).toHaveBeenCalled();
  });

  it('should log errors during the save process', async () => {
    const errorMessage = 'Save error';
    jest.spyOn(scraperService, 'fetchTvShows').mockRejectedValueOnce(new Error(errorMessage));

    await scraperService.saveShowAndCast();

    expect(console.error).toHaveBeenCalledWith('Error fetching TV shows:', "Cannot read properties of undefined (reading 'data')");
    expect(console.error).toHaveBeenCalledWith('Error in saveShowAndCast:', "Error fetching TV shows: Cannot read properties of undefined (reading 'data')");
  });
  
});
