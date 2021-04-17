var cloudinary = require("cloudinary").v2;

export const uploader = async (path) => {
  return await cloudinary.uploader.upload(path)
}

export const dstroyer = (public_id) => {
  return await cloudinary.uploader.destroy(public_id)
}