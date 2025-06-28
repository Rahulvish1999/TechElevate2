import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressTracker from "@/components/ccna/ProgressTracker";
import ContentSection from "@/components/ccna/ContentSection";
import QnASection from "@/components/ccna/QnASection";
import FacultyDashboard from "@/components/ccna/FacultyDashboard";
import {
  BookOpen,
  TrendingUp,
  HelpCircle,
  Target,
  Users,
  Award,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">TechElevate</h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">
              CCNA Certification Learning Platform
            </p>
            <Badge variant="secondary" className="text-sm">
              {user.role === "faculty"
                ? "Faculty Dashboard"
                : "Student Dashboard"}
            </Badge>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-full">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.fullName}</p>
                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Role-based Content */}
        {user.role === "faculty" ? (
          <FacultyDashboard />
        ) : (
          <>
            {/* Welcome Cards for Students */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Access comprehensive CCNA study materials and resources
                    organized by exam topics
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Track Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Monitor your daily study progress and maintain your learning
                    streak
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <HelpCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Test your knowledge with practice questions and track your
                    performance
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Student Learning Tabs */}
            <Tabs defaultValue="progress" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="progress"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Progress Tracker
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Learn CCNA
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Q&A Practice
                </TabsTrigger>
              </TabsList>

              <TabsContent value="progress">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Your Learning Progress
                    </CardTitle>
                    <CardDescription>
                      Track your daily study activities and monitor your
                      progress towards CCNA certification
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProgressTracker />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      CCNA Learning Materials
                    </CardTitle>
                    <CardDescription>
                      Browse and contribute study materials organized by CCNA
                      exam objectives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContentSection />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Practice Questions & Answers
                    </CardTitle>
                    <CardDescription>
                      Test your knowledge with practice questions and review
                      explanations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QnASection />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Community Driven</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>CCNA Focused</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Exam Ready</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            © 2024 TechElevate. Empowering network professionals through
            quality education.
          </p>
        </div>
      </div>
    </div>
  );
}
