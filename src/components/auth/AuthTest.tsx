"use client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthTest() {
  const { user, loading, login, register, logout } = useAuth();

  const handleTestLogin = async () => {
    const result = await login("test@example.com", "password123");
    console.log("Login result:", result);
  };

  const handleTestRegister = async () => {
    const result = await register("Test User", "test@example.com", "password123");
    console.log("Register result:", result);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Status:</strong> {user ? "Logged In" : "Not Logged In"}
        </div>
        {user && (
          <div>
            <strong>User:</strong> {user.name} ({user.email})
          </div>
        )}
        <div className="flex space-x-2">
          <Button onClick={handleTestRegister} variant="outline">
            Test Register
          </Button>
          <Button onClick={handleTestLogin} variant="outline">
            Test Login
          </Button>
          {user && (
            <Button onClick={logout} variant="destructive">
              Logout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 