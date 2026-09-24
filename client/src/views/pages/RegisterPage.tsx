import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegistrationViewModel } from '../../viewmodels/RegistrationViewModel'

function RegisterPage() {
  const navigate = useNavigate()

  const {
    registerUser,
    isLoading,
    error,
    response,
  } = useRegistrationViewModel()

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'teacher'>(
    'student',
  )
  const [collegeId, setCollegeId] = useState('')
  const [facultyId, setFacultyId] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const data = {
      fullName,
      username,
      email,
      password,
      role,
      department,
      ...(role === 'student'
        ? {
            collegeId,
            year: Number(year),
          }
        : {
            facultyId,
          }),
    }

    const success = await registerUser(data)

    if (success) {
      setFullName('')
      setUsername('')
      setEmail('')
      setPassword('')
      setCollegeId('')
      setFacultyId('')
      setDepartment('')
      setYear('')
    }
  }

  if (response) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Registration Successful
          </h1>

          <p className="mt-4 text-gray-600">
            {response.message}
          </p>

          <p className="mt-4 text-sm text-gray-500">
            Check your college email and click the
            verification link to activate your email.
          </p>

          {role === 'teacher' && (
            <p className="mt-3 text-sm text-gray-500">
              Teacher accounts require admin approval
              after email verification.
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500">
            Join the Core Coding Committee
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Choose a username"
              minLength={3}
              maxLength={30}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />

            <p className="mt-1 text-xs text-gray-500">
              Your username will be used for your public profile.
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              College Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="yourname@vcet.edu.in"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />

            <p className="mt-1 text-xs text-gray-500">
              Only VCET college email addresses are allowed.
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Create a password"
              minLength={8}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Account Type
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as
                    | 'student'
                    | 'teacher',
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
            >
              <option value="student">
                Student
              </option>

              <option value="teacher">
                Teacher
              </option>
            </select>
          </div>

          {role === 'student' ? (
            <>
              <div>
                <label
                  htmlFor="collegeId"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  College / Student ID
                </label>

                <input
                  id="collegeId"
                  type="text"
                  value={collegeId}
                  onChange={(event) =>
                    setCollegeId(event.target.value)
                  }
                  placeholder="Enter your college ID"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Year
                </label>

                <select
                  id="year"
                  value={year}
                  onChange={(event) =>
                    setYear(event.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
                >
                  <option value="">
                    Select your year
                  </option>

                  <option value="1">
                    1st Year
                  </option>

                  <option value="2">
                    2nd Year
                  </option>

                  <option value="3">
                    3rd Year
                  </option>

                  <option value="4">
                    4th Year
                  </option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="facultyId"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Faculty / Employee ID
              </label>

              <input
                id="facultyId"
                type="text"
                value={facultyId}
                onChange={(event) =>
                  setFacultyId(event.target.value)
                }
                placeholder="Enter your faculty ID"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="department"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Department
            </label>

            <input
              id="department"
              type="text"
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
              placeholder="e.g. Computer Engineering"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium text-gray-900 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  )
}

export default RegisterPage