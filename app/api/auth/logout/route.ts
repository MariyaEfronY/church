import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Session cleared successfully",
      },
      { status: 200 },
    );

    // 🔒 Secure structural clearing for HttpOnly Session Cookies down the line
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Instantly forces expiration on the client browser
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout engine processing crash:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
