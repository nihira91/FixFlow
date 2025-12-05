

const Rating = require("../models/rating.model");
const User = require("../models/user.model");

exports.addTechnicianRatingService = async (techId, userId, stars, review) => {
  const rating = await Rating.create({
    technicianId: techId,
    userId,
    stars,
    review,
  });

  
  const ratings = await Rating.find({ technicianId: techId });

  const avg =
    ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;

  await User.findByIdAndUpdate(techId, {
    rating: avg,
    totalReviews: ratings.length,
  });

  return rating;
};

exports.getTechnicianRatingsService = async (techId) => {
  return await Rating.find({ technicianId: techId })
    .populate("userId", "name email");
};
