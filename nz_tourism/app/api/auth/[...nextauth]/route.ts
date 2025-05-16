import { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请输入邮箱和密码');
        }

        try {
          const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const data = await response.json();
          
          if (data.success) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: `${data.user.firstName} ${data.user.lastName}`,
              image: data.user.profileImage,
              accessToken: data.token
            };
          }
          throw new Error(data.error || '登录失败');
        } catch (error) {
          console.error('Login error:', error);
          throw new Error('登录失败，请稍后重试');
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("OAuth signIn callback called with:", { 
        provider: account?.provider,
        email: user.email,
        name: user.name
      });
      
      if (account?.provider === 'google' && user.email) {
        try {
          console.log("Attempting Google sign in with backend API");
          const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ')[1] || '',
              avatar: user.image || ''
            })
          });
          
          // 记录完整响应
          const responseText = await response.text();
          console.log("Backend API response:", {
            status: response.status,
            body: responseText
          });

          if (!response.ok) {
            console.error('Google login failed:', responseText);
            return false;
          }
          
          try {
            const data = JSON.parse(responseText);
            console.log("Parsed backend response:", data);
            
            // 保存数据到用户对象
            (user as any).accessToken = data.token;
            (user as any).id = data.user?.id;
            
            return true;
          } catch (e) {
            console.error("Failed to parse JSON response:", e);
            return false;
          }
        } catch (error) {
          console.error('Google sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // 如果是新登录，将令牌添加到JWT
      if (user) {
        token.accessToken = (user as any).accessToken || account?.access_token;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      // 将令牌信息传递给会话
      (session as any).accessToken = token.accessToken;
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth',
    error: '/auth/error'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };