import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/AuthStore'
import {
  archiveProfile,
  uploadProfilePhoto,
  updateProfile,
} from '../../services/ProfileService'
import { getApiErrorMessage } from '../../utils/apiError'

function EditProfilePage() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [photo, setPhoto] = useState<File | null>(null)
  const [socialLinks, setSocialLinks] = useState({
    github: user?.socialLinks?.github || '',
    linkedin: user?.socialLinks?.linkedin || '',
    instagram: user?.socialLinks?.instagram || '',
    website: user?.socialLinks?.website || '',
  })
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (!user) {
    return null
  }

  const submit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      let profilePhoto = user.profilePhoto
      if (photo) {
        profilePhoto = await uploadProfilePhoto(photo)
      }
      await updateProfile({
        fullName,
        username,
        bio,
        profilePhoto,
        socialLinks,
      })
      setUser({
        ...user,
        fullName,
        username,
        bio,
        profilePhoto,
        socialLinks,
      })
      navigate(`/u/${username}`)
    } catch (saveError: unknown) {
      setError(
        getApiErrorMessage(saveError, 'Unable to update profile'),
      )
    } finally {
      setIsSaving(false)
    }

  }

  const archive = async () => {
    if (!window.confirm('Archive your account?')) {
      return
    }

    try {
      await archiveProfile()
      useAuthStore.getState().clearUser()
      navigate('/')
    } catch (archiveError: unknown) {
      setError(
        getApiErrorMessage(
          archiveError,
          'Unable to archive account',
        ),
      )
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <form
        onSubmit={submit}
        className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Edit profile
        </h1>
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
        <label className="mt-6 block text-sm font-medium text-gray-700">
          Full name
          <input
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700">
          Username
          <input
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700">
          Profile photo
          <input
            className="mt-2 block w-full text-sm"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setPhoto(event.target.files?.[0] || null)
            }
          />
          <span className="mt-1 block text-xs text-gray-500">
            JPG, PNG, or WebP up to 5 MB.
          </span>
        </label>
        {Object.keys(socialLinks).map((network) => (
          <label
            key={network}
            className="mt-4 block text-sm font-medium capitalize text-gray-700"
          >
            {network}
            <input
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              value={socialLinks[network as keyof typeof socialLinks]}
              onChange={(event) =>
                setSocialLinks({
                  ...socialLinks,
                  [network]: event.target.value,
                })
              }
              type="url"
            />
          </label>
        ))}
        <label className="mt-4 block text-sm font-medium text-gray-700">
          Bio
          <textarea
            className="mt-2 min-h-32 w-full rounded-lg border border-gray-300 px-4 py-3"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={500}
          />
        </label>
        <button
          disabled={isSaving}
          className="mt-6 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save profile'}
        </button>
        <button
          type="button"
          onClick={() => void archive()}
          className="mt-4 rounded-lg border border-red-300 px-5 py-3 font-medium text-red-700"
        >
          Archive account
        </button>
      </form>
    </main>
  )
}

export default EditProfilePage
