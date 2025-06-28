import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Target,
  ArrowRight,
  BookOpen,
  TrendingUp,
  HelpCircle,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-4 bg-blue-600 rounded-full">
            <Target className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900">TechElevate</h1>
        </div>

        <p className="text-xl text-gray-600 mb-8">
          Your comprehensive CCNA certification learning platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Study Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access organized CCNA content and post your own learning
                resources
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your daily study progress and maintain learning streaks
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <HelpCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Practice Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Test your knowledge with interactive Q&A and track performance
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => navigate("/ccna")}
            className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
          >
            Start Learning CCNA
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-sm text-gray-500">
            Join thousands of students preparing for their CCNA certification
          </p>
        </div>
      </div>
    </div>
  );
}
