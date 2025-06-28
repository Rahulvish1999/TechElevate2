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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, Plus, Clock, User, Tag } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  author: string;
  createdAt: string;
  tags: string[];
}

const CCNA_CATEGORIES = [
  "Network Fundamentals",
  "Network Access",
  "IP Connectivity",
  "IP Services",
  "Security Fundamentals",
  "Automation and Programmability",
];

export default function ContentSection() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    content: "",
    category: "",
    difficulty: "Beginner" as const,
    tags: "",
  });

  useEffect(() => {
    const savedContents = localStorage.getItem("ccna-contents");
    if (savedContents) {
      setContents(JSON.parse(savedContents));
    } else {
      // Initialize with sample content
      const sampleContents: ContentItem[] = [
        {
          id: "1",
          title: "OSI Model Overview",
          content:
            "The OSI (Open Systems Interconnection) model is a conceptual framework that describes the functions of a networking system. It consists of 7 layers:\n\n1. Physical Layer - Deals with physical connections\n2. Data Link Layer - Handles error detection and correction\n3. Network Layer - Manages routing and logical addressing\n4. Transport Layer - Ensures reliable data delivery\n5. Session Layer - Manages sessions between applications\n6. Presentation Layer - Handles data formatting and encryption\n7. Application Layer - Provides network services to applications",
          category: "Network Fundamentals",
          difficulty: "Beginner",
          author: "TechElevate Admin",
          createdAt: new Date().toISOString(),
          tags: ["OSI", "Networking", "Fundamentals"],
        },
        {
          id: "2",
          title: "TCP vs UDP",
          content:
            "TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are two core protocols of the Internet Protocol Suite:\n\nTCP:\n- Connection-oriented\n- Reliable delivery\n- Error checking and correction\n- Flow control\n- Slower but more reliable\n\nUDP:\n- Connectionless\n- Fast transmission\n- No error checking\n- No flow control\n- Used for time-sensitive applications",
          category: "Network Fundamentals",
          difficulty: "Intermediate",
          author: "TechElevate Admin",
          createdAt: new Date().toISOString(),
          tags: ["TCP", "UDP", "Protocols"],
        },
      ];
      setContents(sampleContents);
      localStorage.setItem("ccna-contents", JSON.stringify(sampleContents));
    }
  }, []);

  const saveContent = () => {
    if (!newContent.title || !newContent.content || !newContent.category) {
      return;
    }

    const contentItem: ContentItem = {
      id: Date.now().toString(),
      title: newContent.title,
      content: newContent.content,
      category: newContent.category,
      difficulty: newContent.difficulty,
      author: "Student",
      createdAt: new Date().toISOString(),
      tags: newContent.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    const updatedContents = [contentItem, ...contents];
    setContents(updatedContents);
    localStorage.setItem("ccna-contents", JSON.stringify(updatedContents));

    setNewContent({
      title: "",
      content: "",
      category: "",
      difficulty: "Beginner",
      tags: "",
    });
    setIsDialogOpen(false);
  };

  const filteredContents =
    selectedCategory === "all"
      ? contents
      : contents.filter((content) => content.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">CCNA Learning Content</h2>
          <p className="text-muted-foreground">
            Study materials and resources for CCNA certification
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Learning Content</DialogTitle>
              <DialogDescription>
                Share knowledge and resources with fellow CCNA students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newContent.title}
                  onChange={(e) =>
                    setNewContent({ ...newContent, title: e.target.value })
                  }
                  placeholder="Enter content title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newContent.category}
                    onValueChange={(value) =>
                      setNewContent({ ...newContent, category: value })
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
                    value={newContent.difficulty}
                    onValueChange={(value: any) =>
                      setNewContent({ ...newContent, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newContent.tags}
                  onChange={(e) =>
                    setNewContent({ ...newContent, tags: e.target.value })
                  }
                  placeholder="e.g., routing, switching, protocols"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newContent.content}
                  onChange={(e) =>
                    setNewContent({ ...newContent, content: e.target.value })
                  }
                  placeholder="Enter the learning content..."
                  rows={8}
                />
              </div>
              <Button onClick={saveContent} className="w-full">
                Save Content
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
          {filteredContents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No content available for this category yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Be the first to add some learning material!
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContents.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {content.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{content.category}</Badge>
                      <Badge className={getDifficultyColor(content.difficulty)}>
                        {content.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed mb-4">
                    {content.content}
                  </div>
                  {content.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
