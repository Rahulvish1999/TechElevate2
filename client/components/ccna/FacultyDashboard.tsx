import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, TrendingUp, Award, Clock, Target } from "lucide-react";

interface User {
  id: string;
  fullName: string;
  role: "student" | "faculty";
  loginTime: string;
}

interface UserProgress {
  userId: string;
  totalStudyTime: number;
  topicsCompleted: number;
  questionsAnswered: number;
  correctAnswers: number;
  streak: number;
  lastActive: string;
}

export default function FacultyDashboard() {
  const [students, setStudents] = useState<User[]>([]);
  const [allProgress, setAllProgress] = useState<UserProgress[]>([]);
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    // Load all users and filter students
    const allUsers: User[] = JSON.parse(
      localStorage.getItem("ccna-users") || "[]",
    );
    const studentUsers = allUsers.filter((user) => user.role === "student");
    setStudents(studentUsers);

    // Load progress for all students
    const progressData: UserProgress[] = [];

    studentUsers.forEach((student) => {
      const userProgress = JSON.parse(
        localStorage.getItem(`ccna-progress-${student.id}`) || "[]",
      );
      const todayProgress = JSON.parse(
        localStorage.getItem(`ccna-today-progress-${student.id}`) ||
          '{"studyTime": 0, "topicsCompleted": 0, "questionsAnswered": 0}',
      );
      const userAnswers = JSON.parse(
        localStorage.getItem(`ccna-user-answers-${student.id}`) || "[]",
      );

      const totalStats = userProgress.reduce(
        (acc: any, curr: any) => ({
          studyTime: acc.studyTime + curr.studyTime,
          topicsCompleted: acc.topicsCompleted + curr.topicsCompleted,
          questionsAnswered: acc.questionsAnswered + curr.questionsAnswered,
        }),
        { studyTime: 0, topicsCompleted: 0, questionsAnswered: 0 },
      );

      const correctAnswers = userAnswers.filter((a: any) => a.isCorrect).length;
      const streak =
        userProgress.filter((p: any) => p.studyTime > 0).length +
        (todayProgress.studyTime > 0 ? 1 : 0);

      progressData.push({
        userId: student.id,
        totalStudyTime: totalStats.studyTime + todayProgress.studyTime,
        topicsCompleted:
          totalStats.topicsCompleted + todayProgress.topicsCompleted,
        questionsAnswered:
          totalStats.questionsAnswered + todayProgress.questionsAnswered,
        correctAnswers,
        streak,
        lastActive: student.loginTime,
      });
    });

    setAllProgress(progressData);
  }, []);

  const getStudentName = (userId: string) => {
    const student = students.find((s) => s.id === userId);
    return student?.fullName || "Unknown Student";
  };

  const getStudentInitials = (userId: string) => {
    const name = getStudentName(userId);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAccuracy = (correct: number, total: number) => {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.min((completed / total) * 100, 100);
  };

  const sortedStudents = [...allProgress].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return getStudentName(a.userId).localeCompare(getStudentName(b.userId));
      case "studyTime":
        return b.totalStudyTime - a.totalStudyTime;
      case "progress":
        return b.topicsCompleted - a.topicsCompleted;
      case "accuracy":
        return (
          getAccuracy(b.correctAnswers, b.questionsAnswered) -
          getAccuracy(a.correctAnswers, a.questionsAnswered)
        );
      default:
        return 0;
    }
  });

  const overallStats = {
    totalStudents: students.length,
    activeStudents: allProgress.filter((p) => p.totalStudyTime > 0).length,
    averageStudyTime:
      allProgress.length > 0
        ? Math.round(
            allProgress.reduce((sum, p) => sum + p.totalStudyTime, 0) /
              allProgress.length,
          )
        : 0,
    averageAccuracy:
      allProgress.length > 0
        ? Math.round(
            allProgress.reduce(
              (sum, p) =>
                sum + getAccuracy(p.correctAnswers, p.questionsAnswered),
              0,
            ) / allProgress.length,
          )
        : 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Faculty Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor student progress and engagement across the CCNA program
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.totalStudents}
            </div>
            <p className="text-xs text-muted-foreground">
              {overallStats.activeStudents} active learners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Study Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.averageStudyTime} min
            </div>
            <p className="text-xs text-muted-foreground">per student total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Class Accuracy
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.averageAccuracy}%
            </div>
            <p className="text-xs text-muted-foreground">average quiz score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.totalStudents > 0
                ? Math.round(
                    (overallStats.activeStudents / overallStats.totalStudents) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              students actively learning
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student Progress Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Student Progress Overview</CardTitle>
              <CardDescription>
                Individual student performance and engagement metrics
              </CardDescription>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="studyTime">Sort by Study Time</SelectItem>
                <SelectItem value="progress">Sort by Progress</SelectItem>
                <SelectItem value="accuracy">Sort by Accuracy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {sortedStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No student data available yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Students will appear here once they start using the platform.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Study Time</TableHead>
                  <TableHead>Topics Progress</TableHead>
                  <TableHead>Quiz Performance</TableHead>
                  <TableHead>Streak</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map((progress) => (
                  <TableRow key={progress.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getStudentInitials(progress.userId)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {getStudentName(progress.userId)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Last active:{" "}
                            {new Date(progress.lastActive).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {progress.totalStudyTime} min
                      </div>
                      <div className="w-24 mt-1">
                        <Progress
                          value={getProgressPercentage(
                            progress.totalStudyTime,
                            400,
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {progress.topicsCompleted}/50
                      </div>
                      <div className="w-24 mt-1">
                        <Progress
                          value={getProgressPercentage(
                            progress.topicsCompleted,
                            50,
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {progress.correctAnswers}/{progress.questionsAnswered}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getAccuracy(
                          progress.correctAnswers,
                          progress.questionsAnswered,
                        )}
                        % accuracy
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Award className="h-3 w-3" />
                        {progress.streak} days
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          progress.totalStudyTime > 0 ? "default" : "secondary"
                        }
                      >
                        {progress.totalStudyTime > 0 ? "Active" : "Not Started"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
