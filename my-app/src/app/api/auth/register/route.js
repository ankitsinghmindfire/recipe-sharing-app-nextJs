import { connectDB } from '@/app/lib/db/connection';
import { userSchema } from '@/app/lib/models/userModel';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    connectDB();
    const { username, password, fullName } = await req.json();
    const user = await userSchema.findOne({ username });

    if (user) {
      return NextResponse.json({ error: 'User already exists' });
    }
    const hashedPassowrd = await bcrypt.hash(password, 10);
    const newUser = new userSchema({
      username,
      fullName,
      password: hashedPassowrd,
    });
    await newUser.save();
    return NextResponse.json({ message: 'User Registered Successfully' });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
