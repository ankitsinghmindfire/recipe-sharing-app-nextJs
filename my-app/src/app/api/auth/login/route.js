import { connectDB } from '@/app/lib/db/connection';
import { userSchema } from '@/app/lib/models/userModel';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    connectDB();
    const { username, password } = await req.json();
    const user = await userSchema.findOne({ username });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: 'Username or Password is Incorrect!',
        },
        { status: 401 },
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    return NextResponse.json(
      {
        token,
        userId: user._id,
        userName: user.fullName,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
