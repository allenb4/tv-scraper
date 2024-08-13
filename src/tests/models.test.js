const mongoose = require('mongoose');
const CastMember = require('../models/CastMember');
const TvShow = require('../models/TvShow');

describe('Model schemas', () => {
  it('should create a new CastMember with the correct schema', () => {
    const castMember = new CastMember({ id: 101, name: 'Cast 1', birthday: '1990-01-01' });

    expect(castMember.id).toBe(101);
    expect(castMember.name).toBe('Cast 1');
    expect(castMember.birthday).toEqual(new Date('1990-01-01'));
  });

  it('should create a new TvShow with the correct schema', () => {
    const tvShow = new TvShow({ id: 1, name: 'Show 1', cast: [] });

    expect(tvShow.id).toBe(1);
    expect(tvShow.name).toBe('Show 1');
    expect(tvShow.cast).toEqual([]);
  });
});
