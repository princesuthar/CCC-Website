import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  getPublicProfile,
  type PublicProfile,
} from '../../services/ProfileService'

function PublicProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] =
    useState<PublicProfile | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!username) {
      setError('Profile not found')
      return
    }

    void getPublicProfile(username)
      .then((loadedProfile) => {
        setProfile(loadedProfile)
        if (loadedProfile.username !== username) {
          navigate(`/u/${loadedProfile.username}`, {
            replace: true,
          })
        }
      })
      .catch(() => setError('Profile not found'))
  }, [username])

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">{error}</p>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading profile...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <article className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        {profile.profilePhoto && (
          <img
            src={profile.profilePhoto}
            alt={`${profile.fullName} profile`}
            className="h-24 w-24 rounded-full object-cover"
          />
        )}
        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          {profile.fullName}
        </h1>
        <p className="mt-1 text-gray-500">@{profile.username}</p>
        <p className="mt-4 text-gray-700">
          {profile.department}
          {profile.year ? ` · Year ${profile.year}` : ''}
        </p>
        {profile.bio && (
          <p className="mt-4 text-gray-600">{profile.bio}</p>
        )}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mt-6 text-sm font-medium text-gray-700 hover:underline"
        >
          Go to dashboard
        </button>
      </article>
    </main>
  )
}

export default PublicProfilePage
