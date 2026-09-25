import { v2 as cloudinary } from 'cloudinary'

const getCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary configuration is incomplete')
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })

  return cloudinary
}

export const uploadProfilePhoto = async (
  buffer: Buffer,
  mimeType: string,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const uploader = getCloudinary().uploader.upload_stream(
      {
        folder: 'ccc/profile-photos',
        resource_type: 'image',
        format: mimeType.split('/')[1],
        transformation: [
          {
            width: 800,
            height: 800,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Profile photo upload failed'))
          return
        }

        resolve(result.secure_url)
      },
    )

    uploader.end(buffer)
  })
