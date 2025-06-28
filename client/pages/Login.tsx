import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Target, User, GraduationCap, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (fullName.trim().length < 2) {
      setError("Please enter a valid full name");
      return;
    }

    try {
      login(fullName.trim(), role);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">TechElevate</h1>
          </div>
          <p className="text-gray-600">CCNA Certification Learning Platform</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your CCNA learning dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Account Type</Label>
                <RadioGroup value={role} onValueChange={setRole as any}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="student" id="student" />
                    <Label
                      htmlFor="student"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Student</div>
                        <div className="text-sm text-gray-500">
                          Access your personal learning dashboard
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="faculty" id="faculty" />
                    <Label
                      htmlFor="faculty"
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <Users className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">Faculty</div>
                        <div className="text-sm text-gray-500">
                          View all student progress and analytics
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                New to TechElevate? Just enter your name to get started!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 TechElevate. Empowering network professionals through
            quality education.
          </p>
        </div>
      </div>
    </div>
  );
}
