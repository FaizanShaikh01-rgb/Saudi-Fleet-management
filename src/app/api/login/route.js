// Next imports
import { NextResponse } from 'next/server'

// Mock data for demo purpose
import { users } from './users'

export async function POST(req) {
  try {
    // Parse request body
    const { email, password } = await req.json()

    // Find user
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      // Remove password from response
      const { password: _, ...filteredUserData } = user

      return NextResponse.json(filteredUserData, { status: 200 })
    } else {
      // Return 401 if not found
      return NextResponse.json(
        {
          message: ['Email or Password is invalid']
        },
        { status: 401 }
      )
    }
  } catch (error) {
    // Catch JSON parsing or unexpected errors
    return NextResponse.json(
      {
        message: ['Invalid request or server error']
      },
      { status: 500 }
    )
  }
}
