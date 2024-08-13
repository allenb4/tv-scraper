const axios = require('axios');
const TvShow = require('../models/TvShow');
const CastMember = require('../models/CastMember');
const { TVMAZE_API_URL } = process.env;

const MAX_PAGES = 5;

const fetchTvShows = async () => {
  let page = 0;
  let shows = [];

  while (page <= MAX_PAGES) {
    try {
      console.log(`Fetching shows from page ${page}`);
      const response = await axios.get(`${TVMAZE_API_URL}/shows?page=${page}`);

      if (response.data.length === 0) break;

      shows = [...shows, ...response.data];
      page++;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('404 Not Found - Check API URL or endpoint');
        break;
      } else {
        console.error('Error fetching TV shows:', error.message);
        throw new Error('Error fetching TV shows: ' + error.message);
      }
    }
  }

  return shows;
};

const fetchCastForShow = async (showId) => {
  try {
    console.log(`Fetching cast for show ID ${showId}`);
    const response = await axios.get(`${process.env.TVMAZE_API_URL}/shows/${showId}/cast`);
    return response.data.map(member => ({
      id: member.person.id,
      name: member.person.name,
      birthday: member.person.birthday
    }));
  } catch (error) {
    throw new Error(`Error fetching cast for show ID ${showId}: ${error.message}`);
  }
};

/* istanbul ignore next */
const saveShowAndCast = async () => {
  try {
    console.log('Starting to fetch TV shows...');
    const shows = await fetchTvShows();
    console.log(`Fetched ${shows.length} shows`);

    for (const show of shows) {
      try {
        console.log(`Processing show: ${show.name} (ID: ${show.id})`);
        
        let tvShow = await TvShow.findOne({ id: show.id });
        if (!tvShow) {
          const castData = await fetchCastForShow(show.id);
          const castIds = [];

          for (const cast of castData) {
            let castMember = await CastMember.findOne({ id: cast.id });

            if (!castMember) {
              console.log(`Saving new cast member: ${cast.name}`);
              castMember = new CastMember(cast);
              await castMember.save();
            }

            castIds.push(castMember._id);
          }

          console.log(`Saving TV show: ${show.name}`);
          tvShow = new TvShow({
            id: show.id,
            name: show.name,
            cast: castIds
          });

          await tvShow.save();
        } else {
          console.log(`TV show ${show.name} (ID: ${show.id}) already exists`);
        }
      } catch (error) {
        console.error(`Error processing show ${show.name} (ID: ${show.id}):`, error.message);
      }
    }

    console.log('Finished saving all shows and cast members');
  } catch (error) {
    console.error('Error in saveShowAndCast:', error.message);
  }
};

module.exports = {
  saveShowAndCast,
  fetchTvShows,
  fetchCastForShow
};
