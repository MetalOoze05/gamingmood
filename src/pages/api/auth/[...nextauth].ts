import NextAuth, { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    
    async signIn({ user, account, profile, email, credentials }: any) {
      try {
        await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            image: profile.image_url,
          },
        });

        await prisma.account.update({
          where: {
            userId: user.id
          },
          data: {
            access_token: account.access_token,
            refresh_token: account.refresh_token
          }
        });

      } catch (e) {
        console.log("new user logged in");
      }
      
      return true;
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export default NextAuth(authOptions);
