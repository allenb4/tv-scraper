const TvShow = require('../models/TvShow');

exports.getAllShows = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const shows = await TvShow.find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'cast',
          options: {
            sort: { birthday: -1 }
          }
        });
  
      const totalShows = await TvShow.countDocuments();
  
      const response = {
        page,
        limit,
        totalPages: Math.ceil(totalShows / limit),
        totalShows,
        shows: shows.map(show => ({
          id: show.id,
          name: show.name,
          cast: show.cast.map(castMember => ({
            id: castMember.id,
            name: castMember.name,
            birthday: castMember.birthday
          }))
        }))
      };
  
      res.json(response);
    } catch (error) {
      console.error('Error fetching TV shows:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching shows' });
    }
  };
  