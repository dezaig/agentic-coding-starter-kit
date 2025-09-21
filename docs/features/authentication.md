# Authentication Feature

## Overview
The authentication system provides secure user access to the todo application using Better Auth with Google OAuth integration. Users can sign in with their Google accounts and access their personal todo lists.

## Features

### Authentication Methods
- **Google OAuth**: Primary authentication method using Google accounts
- **Session Management**: Secure session handling with automatic expiration
- **User Profile**: Access to user name, email, and profile image

### Security Features
- **Secure Sessions**: JWT-based session tokens with expiration
- **CSRF Protection**: Built-in protection against cross-site request forgery
- **User Isolation**: Each user can only access their own todos
- **Automatic Logout**: Sessions expire after inactivity

## Technical Implementation

### Database Schema
```sql
-- User table
CREATE TABLE user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  emailVerified BOOLEAN,
  image TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Session table
CREATE TABLE session (
  id TEXT PRIMARY KEY,
  expiresAt TIMESTAMP NOT NULL,
  token TEXT NOT NULL UNIQUE,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  ipAddress TEXT,
  userAgent TEXT,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
);

-- Account table (OAuth providers)
CREATE TABLE account (
  id TEXT PRIMARY KEY,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt TIMESTAMP,
  refreshTokenExpiresAt TIMESTAMP,
  scope TEXT,
  password TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Configuration Files

#### Auth Configuration
- **Location**: `src/lib/auth.ts`
- **Provider**: Better Auth with Google OAuth
- **Session Management**: Server-side session handling
- **Database Integration**: Drizzle ORM with PostgreSQL

#### Client Configuration
- **Location**: `src/lib/auth-client.ts`
- **Purpose**: Client-side authentication utilities
- **Features**: Session hooks, user profile access

### API Endpoints

#### Authentication Routes
- **Location**: `src/app/api/auth/[...all]/route.ts`
- **Purpose**: Handle all authentication requests
- **Methods**: GET, POST for sign-in, sign-out, session management

### Components

#### UserProfile
- **Location**: `src/components/auth/user-profile.tsx`
- **Purpose**: Display user information and sign-in/sign-out controls
- **Features**: User avatar, name display, sign-out button

#### SignInButton
- **Location**: `src/components/auth/sign-in-button.tsx`
- **Purpose**: Trigger Google OAuth sign-in flow
- **Features**: Google branding, loading states

#### SignOutButton
- **Location**: `src/components/auth/sign-out-button.tsx`
- **Purpose**: Sign out the current user
- **Features**: Confirmation dialog, loading states

## Usage Examples

### Checking Authentication Status
```typescript
import { useSession } from "@/lib/auth-client";

function MyComponent() {
  const { data: session, isPending } = useSession();
  
  if (isPending) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <div>Please sign in</div>;
  }
  
  return <div>Welcome, {session.user.name}!</div>;
}
```

### Server-Side Authentication
```typescript
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // User is authenticated, proceed with request
}
```

### Protected Routes
```typescript
// In page components
export default function ProtectedPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>Please sign in to access this page.</p>
        <UserProfile />
      </div>
    );
  }

  return <div>Protected content here</div>;
}
```

## Environment Configuration

### Required Environment Variables
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database Configuration
POSTGRES_URL=your_postgresql_connection_string

# Better Auth Configuration
BETTER_AUTH_SECRET=your_secret_key_for_session_encryption
BETTER_AUTH_URL=http://localhost:3000
```

### Google OAuth Setup
1. Create a project in Google Cloud Console
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## Security Best Practices

### Session Security
- **Secure Cookies**: Sessions stored in HTTP-only cookies
- **CSRF Protection**: Built-in CSRF token validation
- **Session Expiration**: Automatic session timeout
- **Secure Headers**: Proper security headers for all responses

### Data Protection
- **User Isolation**: Database queries scoped to authenticated user
- **Input Validation**: All inputs validated server-side
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM

### OAuth Security
- **State Parameter**: CSRF protection in OAuth flow
- **Token Validation**: Proper validation of OAuth tokens
- **Scope Limitation**: Minimal required OAuth scopes

## Error Handling

### Common Error Scenarios
- **Invalid Session**: Redirect to sign-in page
- **Expired Session**: Automatic refresh or re-authentication
- **OAuth Errors**: Clear error messages for failed authentication
- **Network Errors**: Graceful handling of connection issues

### Error Recovery
- **Automatic Retry**: Retry failed authentication requests
- **Fallback UI**: Show appropriate UI for different error states
- **User Feedback**: Clear error messages and recovery options

## Future Enhancements

### Additional Providers
- **GitHub OAuth**: For developer-focused users
- **Microsoft OAuth**: For enterprise users
- **Email/Password**: Traditional authentication method

### Advanced Features
- **Two-Factor Authentication**: Additional security layer
- **Account Linking**: Link multiple OAuth providers
- **Profile Management**: Edit user profile information
- **Account Deletion**: GDPR-compliant account deletion

