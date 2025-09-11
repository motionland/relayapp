import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface ResponseApi<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | undefined;
  auth_token: string;
  phone: string | undefined;
  code: string;
  role: string[];
}

interface PreferredDeliveryHub {
  hub_name: string;
  hub_address: string;
  operating_hours: string;
  current_packages: number;
  last_delivery: string | null;
}

interface UserInformation {
  first_name: string;
  last_name: string;
  user_shipping_code: string;
  id_verification: string;
}

interface ContactInformation {
  address: string | null;
  email_address: string;
  phone_numbers: string | null;
  phone_country_code: string;
}

interface UserProfile {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  shipping_code: string;
  verification: string;
  packages: number;
  admin_note: string | null;
  user_information: UserInformation;
  contact_information: ContactInformation;
  preferred_delivery_hub: PreferredDeliveryHub;
  id_verified: boolean;
}

interface UserProfileApiResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

interface LoginVerifyResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

declare module "next-auth" {
  interface Session {
    auth_token: string;
    user: {
      id: string;
      name: string;
      email: string;
      picture: string | undefined;
      auth_token: string;
      phone: string | undefined;
      code: string;
      role: string[];
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string | undefined;
    auth_token: string;
    phone: string | undefined;
    code: string;
    role: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    auth_token: string;
    id: string;
    name: string;
    email: string;
    phone: string | undefined;
    code: string;
    role: string[];
    picture: string | undefined;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        token_magiclink: { label: "Magic Link Token", type: "text" },
        login_token: { label: "Login Token", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        // Handle OTP login verification
        if (credentials?.login_token && credentials?.otp) {
          try {
            // Verify OTP login
            const loginVerifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login-verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${credentials.login_token}`,
                },
                body: JSON.stringify({
                  login_token: credentials.login_token,
                  otp: credentials.otp,
                }),
              }
            );

            const loginVerifyData =
              (await loginVerifyRes.json()) as LoginVerifyResponse;
            if (!loginVerifyRes.ok) {
              throw new Error(
                loginVerifyData.message || "Login verification failed"
              );
            }

            // Get user profile
            const profileRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${loginVerifyData.data.token}`,
                },
              }
            );

            const profileData =
              (await profileRes.json()) as UserProfileApiResponse;
            if (!profileRes.ok) {
              throw new Error(
                profileData.message || "Failed to fetch user profile"
              );
            }

            return {
              id: profileData.data.id.toString(),
              name: profileData.data.full_name,
              email: profileData.data.email,
              image: undefined,
              auth_token: loginVerifyData.data.token,
              phone:
                profileData.data.contact_information.phone_numbers || undefined,
              code: profileData.data.shipping_code,
              role: [],
            } as AuthUser;
          } catch (error) {
            console.error("OTP login authentication error:", error);
            throw new Error(
              error instanceof Error
                ? error.message
                : "OTP login authentication failed"
            );
          }
        }
        // Handle magic link
        else if (credentials?.token_magiclink) {
          try {
            // Verifikasi magic link
            const magicLinkRes = await fetch(
              `${
                process.env.NEXT_PUBLIC_API_BASE_URL
              }/auth/magic-link?token=${encodeURIComponent(
                credentials.token_magiclink
              )}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );

            const magicLinkData = (await magicLinkRes.json()) as ResponseApi<{
              token: string;
              type: string;
            }>;
            if (!magicLinkRes.ok) {
              throw new Error(
                magicLinkData.message || "Magic link verification failed"
              );
            }

            // Ambil profil pengguna
            const profileRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${magicLinkData.data.token}`,
                },
              }
            );

            const profileData =
              (await profileRes.json()) as UserProfileApiResponse;
            if (!profileRes.ok) {
              throw new Error(
                profileData.message || "Failed to fetch user profile"
              );
            }

            return {
              id: profileData.data.id.toString(),
              name: profileData.data.full_name,
              email: profileData.data.email,
              image: undefined,
              auth_token: magicLinkData.data.token,
              phone:
                profileData.data.contact_information.phone_numbers || undefined,
              code: profileData.data.shipping_code,
              role: [],
            } as AuthUser;
          } catch (error) {
            console.error("Magic link authentication error:", error);
            throw new Error(
              error instanceof Error
                ? error.message
                : "Magic link authentication failed"
            );
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.auth_token = user.auth_token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.code = user.code;
        token.role = user.role;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.code = token.code;
        session.user.role = token.role;
        session.user.picture = token.picture;
        session.auth_token = token.auth_token;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
