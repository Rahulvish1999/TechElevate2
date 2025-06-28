import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DailyProgress {
  date: string;
  studyTime: number;
  topicsCompleted: number;
  questionsAnswered: number;
  streak: number;
}

export default function ProgressTracker() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [todayProgress, setTodayProgress] = useState<DailyProgress>({
    date: new Date().toISOString().split("T")[0],
    studyTime: 0,
    topicsCompleted: 0,
    questionsAnswered: 0,
    streak: 0,
  });

  useEffect(() => {
    if (!user) return;

    const savedProgress = localStorage.getItem(`ccna-progress-${user.id}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    const savedTodayProgress = localStorage.getItem(
      `ccna-today-progress-${user.id}`,
    );
    if (savedTodayProgress) {
      setTodayProgress(JSON.parse(savedTodayProgress));
    }
  }, [user]);

  const updateProgress = (field: keyof DailyProgress, increment: number) => {
    if (!user) return;

    const updated = {
      ...todayProgress,
      [field]: todayProgress[field] + increment,
    };
    setTodayProgress(updated);
    localStorage.setItem(
      `ccna-today-progress-${user.id}`,
      JSON.stringify(updated),
    );
  };

  const calculateStreak = () => {
    return (
      progress.filter((p) => p.studyTime > 0).length +
      (todayProgress.studyTime > 0 ? 1 : 0)
    );
  };

  const getTotalStats = () => {
    const total = progress.reduce(
      (acc, curr) => ({
        studyTime: acc.studyTime + curr.studyTime,
        topicsCompleted: acc.topicsCompleted + curr.topicsCompleted,
        questionsAnswered: acc.questionsAnswered + curr.questionsAnswered,
      }),
      { studyTime: 0, topicsCompleted: 0, questionsAnswered: 0 },
    );

    return {
      studyTime: total.studyTime + todayProgress.studyTime,
      topicsCompleted: total.topicsCompleted + todayProgress.topicsCompleted,
      questionsAnswered:
        total.questionsAnswered + todayProgress.questionsAnswered,
    };
  };

  const stats = getTotalStats();
  const currentStreak = calculateStreak();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Study Time
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayProgress.studyTime} min
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => updateProgress("studyTime", 15)}
                className="text-xs"
              >
                +15 min
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Topics Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayProgress.topicsCompleted}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => updateProgress("topicsCompleted", 1)}
                className="text-xs"
              >
                +1 Topic
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questions Answered
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayProgress.questionsAnswered}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => updateProgress("questionsAnswered", 1)}
                className="text-xs"
              >
                +1 Question
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} days</div>
            <Badge variant="secondary" className="mt-2">
              Keep it up!
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CCNA Progress Overview</CardTitle>
          <CardDescription>
            Your journey towards CCNA certification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Study Progress</span>
              <span>
                {Math.min(Math.round((stats.studyTime / 4000) * 100), 100)}%
              </span>
            </div>
            <Progress value={Math.min((stats.studyTime / 4000) * 100, 100)} />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.studyTime} / 4000 minutes (recommended study time)
            </p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Topics Mastered</span>
              <span>
                {Math.min(Math.round((stats.topicsCompleted / 50) * 100), 100)}%
              </span>
            </div>
            <Progress
              value={Math.min((stats.topicsCompleted / 50) * 100, 100)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.topicsCompleted} / 50 core topics
            </p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Practice Questions</span>
              <span>
                {Math.min(
                  Math.round((stats.questionsAnswered / 500) * 100),
                  100,
                )}
                %
              </span>
            </div>
            <Progress
              value={Math.min((stats.questionsAnswered / 500) * 100, 100)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.questionsAnswered} / 500 practice questions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
