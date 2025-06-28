import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle,
  Plus,
  CheckCircle,
  XCircle,
  User,
  Clock,
  MessageCircle,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  author: string;
  createdAt: string;
}

interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: string;
}

const CCNA_CATEGORIES = [
  "Network Fundamentals",
  "Network Access",
  "IP Connectivity",
  "IP Services",
  "Security Fundamentals",
  "Automation and Programmability",
];

export default function QnASection() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    category: "",
    difficulty: "Easy" as const,
  });

  useEffect(() => {
    const savedQuestions = localStorage.getItem("ccna-questions");
    const savedAnswers = localStorage.getItem("ccna-user-answers");

    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Initialize with sample questions
      const sampleQuestions: Question[] = [
        {
          id: "1",
          question: "How many layers does the OSI model have?",
          options: ["5", "6", "7", "8"],
          correctAnswer: 2,
          explanation:
            "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.",
          category: "Network Fundamentals",
          difficulty: "Easy",
          author: "TechElevate Admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          question: "Which protocol operates at Layer 4 of the OSI model?",
          options: ["HTTP", "TCP", "IP", "Ethernet"],
          correctAnswer: 1,
          explanation:
            "TCP (Transmission Control Protocol) operates at Layer 4 (Transport Layer) of the OSI model.",
          category: "Network Fundamentals",
          difficulty: "Medium",
          author: "TechElevate Admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          question: "What is the default subnet mask for a Class C network?",
          options: [
            "255.0.0.0",
            "255.255.0.0",
            "255.255.255.0",
            "255.255.255.255",
          ],
          correctAnswer: 2,
          explanation:
            "Class C networks use a default subnet mask of 255.255.255.0 or /24 in CIDR notation.",
          category: "IP Connectivity",
          difficulty: "Medium",
          author: "TechElevate Admin",
          createdAt: new Date().toISOString(),
        },
      ];
      setQuestions(sampleQuestions);
      localStorage.setItem("ccna-questions", JSON.stringify(sampleQuestions));
    }

    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const saveQuestion = () => {
    if (
      !newQuestion.question ||
      !newQuestion.category ||
      newQuestion.options.some((opt) => !opt.trim())
    ) {
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer,
      explanation: newQuestion.explanation,
      category: newQuestion.category,
      difficulty: newQuestion.difficulty,
      author: "Student",
      createdAt: new Date().toISOString(),
    };

    const updatedQuestions = [question, ...questions];
    setQuestions(updatedQuestions);
    localStorage.setItem("ccna-questions", JSON.stringify(updatedQuestions));

    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      category: "",
      difficulty: "Easy",
    });
    setIsDialogOpen(false);
  };

  const submitAnswer = (questionId: string, selectedAnswer: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const userAnswer: UserAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
    };

    const updatedAnswers = [
      ...userAnswers.filter((a) => a.questionId !== questionId),
      userAnswer,
    ];
    setUserAnswers(updatedAnswers);
    localStorage.setItem("ccna-user-answers", JSON.stringify(updatedAnswers));
  };

  const filteredQuestions =
    selectedCategory === "all"
      ? questions
      : questions.filter((question) => question.category === selectedCategory);

  const getUserAnswer = (questionId: string) => {
    return userAnswers.find((answer) => answer.questionId === questionId);
  };

  const getStats = () => {
    const totalAnswered = userAnswers.length;
    const correctAnswers = userAnswers.filter((a) => a.isCorrect).length;
    const accuracy =
      totalAnswered > 0
        ? Math.round((correctAnswers / totalAnswered) * 100)
        : 0;

    return { totalAnswered, correctAnswers, accuracy };
  };

  const stats = getStats();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">CCNA Practice Questions</h2>
          <p className="text-muted-foreground">
            Test your knowledge with practice questions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Practice Question</DialogTitle>
              <DialogDescription>
                Create a multiple choice question for CCNA practice
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                  placeholder="Enter your question"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {newQuestion.options.map((option, index) => (
                  <div key={index}>
                    <Label htmlFor={`option-${index}`}>
                      Option {String.fromCharCode(65 + index)}
                    </Label>
                    <Input
                      id={`option-${index}`}
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...newQuestion.options];
                        updatedOptions[index] = e.target.value;
                        setNewQuestion({
                          ...newQuestion,
                          options: updatedOptions,
                        });
                      }}
                      placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                ))}
              </div>
              <div>
                <Label>Correct Answer</Label>
                <RadioGroup
                  value={newQuestion.correctAnswer.toString()}
                  onValueChange={(value) =>
                    setNewQuestion({
                      ...newQuestion,
                      correctAnswer: parseInt(value),
                    })
                  }
                  className="flex gap-4 mt-2"
                >
                  {newQuestion.options.map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`correct-${index}`}
                      />
                      <Label htmlFor={`correct-${index}`}>
                        {String.fromCharCode(65 + index)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newQuestion.category}
                    onValueChange={(value) =>
                      setNewQuestion({ ...newQuestion, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CCNA_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={newQuestion.difficulty}
                    onValueChange={(value: any) =>
                      setNewQuestion({ ...newQuestion, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  id="explanation"
                  value={newQuestion.explanation}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      explanation: e.target.value,
                    })
                  }
                  placeholder="Explain the correct answer"
                  rows={3}
                />
              </div>
              <Button onClick={saveQuestion} className="w-full">
                Save Question
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalAnswered}
              </div>
              <p className="text-sm text-muted-foreground">
                Questions Answered
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats.correctAnswers}
              </div>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.accuracy}%
              </div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          {CCNA_CATEGORIES.slice(0, 6).map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No questions available for this category yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Be the first to add some practice questions!
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredQuestions.map((question) => {
              const userAnswer = getUserAnswer(question.id);
              const hasAnswered = userAnswer !== undefined;

              return (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {question.question}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {question.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge
                          className={getDifficultyColor(question.difficulty)}
                        >
                          {question.difficulty}
                        </Badge>
                        {hasAnswered && (
                          <Badge
                            variant={
                              userAnswer.isCorrect ? "default" : "destructive"
                            }
                          >
                            {userAnswer.isCorrect ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {userAnswer.isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={
                        currentAnswers[question.id]?.toString() ||
                        (hasAnswered
                          ? userAnswer.selectedAnswer.toString()
                          : "")
                      }
                      onValueChange={(value) => {
                        if (!hasAnswered) {
                          setCurrentAnswers({
                            ...currentAnswers,
                            [question.id]: parseInt(value),
                          });
                        }
                      }}
                      disabled={hasAnswered}
                      className="space-y-2"
                    >
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`${question.id}-${index}`}
                            disabled={hasAnswered}
                          />
                          <Label
                            htmlFor={`${question.id}-${index}`}
                            className={`flex-1 ${
                              hasAnswered
                                ? index === question.correctAnswer
                                  ? "text-green-700 font-medium"
                                  : index === userAnswer.selectedAnswer &&
                                      !userAnswer.isCorrect
                                    ? "text-red-700 line-through"
                                    : ""
                                : ""
                            }`}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </Label>
                          {hasAnswered && index === question.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {hasAnswered &&
                            index === userAnswer.selectedAnswer &&
                            !userAnswer.isCorrect && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                        </div>
                      ))}
                    </RadioGroup>

                    {!hasAnswered &&
                      currentAnswers[question.id] !== undefined && (
                        <Button
                          onClick={() =>
                            submitAnswer(
                              question.id,
                              currentAnswers[question.id],
                            )
                          }
                          className="mt-4"
                        >
                          Submit Answer
                        </Button>
                      )}

                    {hasAnswered && question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">
                            Explanation
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
