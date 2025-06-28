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
import {
  Book,
  Plus,
  Clock,
  User,
  Tag,
  FileText,
  Image,
  Link,
  Video,
  Upload,
  Download,
  Eye,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  contentType: "text" | "pdf" | "word" | "image" | "diagram" | "link" | "video";
  fileData?: string; // Base64 encoded file data
  fileName?: string;
  fileSize?: number;
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

const CONTENT_TYPES = [
  {
    value: "text",
    label: "Text Content",
    icon: FileText,
    description: "Written notes and explanations",
  },
  {
    value: "pdf",
    label: "PDF Document",
    icon: FileText,
    description: "Upload PDF files",
  },
  {
    value: "word",
    label: "Word Document",
    icon: FileText,
    description: "Upload Word documents",
  },
  {
    value: "image",
    label: "Image/Diagram",
    icon: Image,
    description: "Upload images and network diagrams",
  },
  {
    value: "link",
    label: "External Link",
    icon: Link,
    description: "Link to external resources",
  },
  {
    value: "video",
    label: "Video",
    icon: Video,
    description: "Upload video tutorials",
  },
];

const handleFileUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getContentIcon = (contentType: string) => {
  switch (contentType) {
    case "pdf":
    case "word":
      return FileText;
    case "image":
    case "diagram":
      return Image;
    case "link":
      return Link;
    case "video":
      return Video;
    default:
      return FileText;
  }
};

export default function ContentSection() {
  const { user } = useAuth();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);
  const [newContent, setNewContent] = useState({
    title: "",
    content: "",
    contentType: "text" as const,
    fileData: "",
    fileName: "",
    fileSize: 0,
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
          contentType: "text",
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
          contentType: "text",
          category: "Network Fundamentals",
          difficulty: "Intermediate",
          author: "TechElevate Admin",
          createdAt: new Date().toISOString(),
          tags: ["TCP", "UDP", "Protocols"],
        },
        {
          id: "3",
          title: "Cisco Documentation",
          content:
            "https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13769-5.html",
          contentType: "link",
          category: "Network Fundamentals",
          difficulty: "Intermediate",
          author: "TechElevate Admin",
          createdAt: new Date().toISOString(),
          tags: ["Cisco", "Documentation", "Reference"],
        },
      ];
      setContents(sampleContents);
      localStorage.setItem("ccna-contents", JSON.stringify(sampleContents));
    }
  }, []);

  const saveContent = () => {
    if (!newContent.title || !newContent.category || !user) {
      return;
    }

    // Validate based on content type
    if (newContent.contentType === "text" && !newContent.content) {
      return;
    }
    if (newContent.contentType === "link" && !newContent.content) {
      return;
    }
    if (
      ["pdf", "word", "image", "video"].includes(newContent.contentType) &&
      !newContent.fileData
    ) {
      return;
    }

    const contentItem: ContentItem = {
      id: Date.now().toString(),
      title: newContent.title,
      content: newContent.content,
      contentType: newContent.contentType as any,
      fileData: newContent.fileData,
      fileName: newContent.fileName,
      fileSize: newContent.fileSize,
      category: newContent.category,
      difficulty: newContent.difficulty,
      author: user.fullName,
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
      contentType: "text",
      fileData: "",
      fileName: "",
      fileSize: 0,
      category: "",
      difficulty: "Beginner",
      tags: "",
    });
    setIsDialogOpen(false);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB for localStorage)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    try {
      const fileData = await handleFileUpload(file);
      setNewContent({
        ...newContent,
        fileData,
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (error) {
      alert("Error uploading file. Please try again.");
    }
  };

  const handleDeleteContent = (contentId: string) => {
    setContentToDelete(contentId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteContent = () => {
    if (!contentToDelete) return;

    const updatedContents = contents.filter(
      (content) => content.id !== contentToDelete,
    );
    setContents(updatedContents);
    localStorage.setItem("ccna-contents", JSON.stringify(updatedContents));

    setContentToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const canDeleteContent = (content: ContentItem) => {
    if (!user) return false;
    // Users can delete their own content, faculty can delete any content
    return user.role === "faculty" || content.author === user.fullName;
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Add New Learning Content</DialogTitle>
              <DialogDescription>
                Share knowledge and resources with fellow CCNA students
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
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

              <div>
                <Label>Content Type</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {CONTENT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`p-2 border rounded-md cursor-pointer transition-all hover:shadow-sm ${
                          newContent.contentType === type.value
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          setNewContent({
                            ...newContent,
                            contentType: type.value as any,
                            content: "",
                            fileData: "",
                            fileName: "",
                            fileSize: 0,
                          })
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm block">
                              {type.label}
                            </span>
                            <p className="text-xs text-gray-500 truncate">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* File Upload for non-text content */}
              {["pdf", "word", "image", "video"].includes(
                newContent.contentType,
              ) && (
                <div className="space-y-2">
                  <Label htmlFor="fileUpload">Upload File</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="fileUpload"
                        className={`flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
                          newContent.fileName ? "h-20" : "h-32"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center p-4">
                          <Upload className="w-6 h-6 mb-2 text-gray-500" />
                          <p className="mb-1 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                            {!newContent.fileName && " or drag and drop"}
                          </p>
                          {!newContent.fileName && (
                            <p className="text-xs text-gray-500">
                              {newContent.contentType === "image"
                                ? "PNG, JPG, GIF up to 5MB"
                                : newContent.contentType === "pdf"
                                  ? "PDF files up to 5MB"
                                  : newContent.contentType === "word"
                                    ? "DOC, DOCX files up to 5MB"
                                    : "Video files up to 5MB"}
                            </p>
                          )}
                        </div>
                        <Input
                          id="fileUpload"
                          type="file"
                          className="hidden"
                          onChange={handleFileSelect}
                          accept={
                            newContent.contentType === "image"
                              ? "image/*"
                              : newContent.contentType === "pdf"
                                ? ".pdf"
                                : newContent.contentType === "word"
                                  ? ".doc,.docx"
                                  : newContent.contentType === "video"
                                    ? "video/*"
                                    : "*/*"
                          }
                        />
                      </label>
                    </div>
                    {newContent.fileName && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              {newContent.fileName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              {formatFileSize(newContent.fileSize)}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setNewContent({
                                  ...newContent,
                                  fileData: "",
                                  fileName: "",
                                  fileSize: 0,
                                })
                              }
                              className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text content or link input */}
              {(newContent.contentType === "text" ||
                newContent.contentType === "link") && (
                <div>
                  <Label htmlFor="content">
                    {newContent.contentType === "link" ? "URL" : "Content"}
                  </Label>
                  {newContent.contentType === "link" ? (
                    <Input
                      id="content"
                      value={newContent.content}
                      onChange={(e) =>
                        setNewContent({
                          ...newContent,
                          content: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                      type="url"
                    />
                  ) : (
                    <Textarea
                      id="content"
                      value={newContent.content}
                      onChange={(e) =>
                        setNewContent({
                          ...newContent,
                          content: e.target.value,
                        })
                      }
                      placeholder="Enter the learning content..."
                      rows={6}
                      className="resize-none min-h-[120px] max-h-[200px]"
                    />
                  )}
                </div>
              )}

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
            </div>
            <div className="flex-shrink-0 pt-4 border-t">
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
                    <div className="flex-1">
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
                    <div className="flex items-center gap-2">
                      <div className="flex gap-2">
                        <Badge variant="outline">{content.category}</Badge>
                        <Badge
                          className={getDifficultyColor(content.difficulty)}
                        >
                          {content.difficulty}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {(() => {
                            const Icon = getContentIcon(
                              content.contentType || "text",
                            );
                            return <Icon className="h-3 w-3" />;
                          })()}
                          {(content.contentType || "text")
                            .charAt(0)
                            .toUpperCase() +
                            (content.contentType || "text").slice(1)}
                        </Badge>
                      </div>
                      {canDeleteContent(content) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteContent(content.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Content
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {(!content.contentType ||
                      content.contentType === "text") && (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {content.content}
                      </div>
                    )}

                    {content.contentType === "link" && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Link className="h-4 w-4 text-blue-600" />
                        <a
                          href={content.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {content.content}
                        </a>
                      </div>
                    )}

                    {content.contentType === "image" && content.fileData && (
                      <div className="space-y-2">
                        <img
                          src={content.fileData}
                          alt={content.title}
                          className="max-w-full h-auto rounded-lg border"
                        />
                        <p className="text-xs text-gray-500">
                          {content.fileName}
                        </p>
                      </div>
                    )}

                    {content.contentType === "video" && content.fileData && (
                      <div className="space-y-2">
                        <video
                          controls
                          className="max-w-full h-auto rounded-lg border"
                        >
                          <source src={content.fileData} />
                          Your browser does not support the video tag.
                        </video>
                        <p className="text-xs text-gray-500">
                          {content.fileName}
                        </p>
                      </div>
                    )}

                    {(content.contentType === "pdf" ||
                      content.contentType === "word") &&
                      content.fileData && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <FileText className="h-8 w-8 text-gray-600" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {content.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {content.fileSize
                                ? formatFileSize(content.fileSize)
                                : "File"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = content.fileData!;
                                link.download = content.fileName || "download";
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            {content.contentType === "pdf" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  window.open(content.fileData, "_blank")
                                }
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot
              be undone and will permanently remove the content from the
              platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setContentToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteContent}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
