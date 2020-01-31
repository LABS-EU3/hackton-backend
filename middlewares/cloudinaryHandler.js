const cloudinary = require('cloudinary');

module.exports = {
  async deleteCloudImage(req, res, next) {
    if (req.file.public_id) {
      try {
        const deleteCloudImage = await cloudinary.uploader.destroy(
          req.file.public_id
        );
        req.deleteCloudImage = deleteCloudImage;
      } catch (error) {
        return next(error.message);
      }
    }
    return next();
  }
};
