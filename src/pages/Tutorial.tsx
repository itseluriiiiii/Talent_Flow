import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TutorialItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  route: string;
}

const tutorialItems: TutorialItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Your central hub for HR insights. View real-time statistics, employee counts, recent activities, and quick access to key metrics.",
    features: [
      "View total employees and new candidates",
      "Track completed interviews and active onboarding tasks",
      "See hiring trends and department breakdowns"
    ],
    route: "/"
  },
  {
    id: "candidates",
    title: "Candidates",
    description: "Manage job applicants and track their progress through the hiring pipeline. Add, edit, and organize candidate information.",
    features: [
      "Add new candidates with resume links",
      "Filter by role, status, and department",
      "Update candidate status and track applications",
      "Search and sort candidates efficiently"
    ],
    route: "/candidates"
  },
  {
    id: "interviews",
    title: "Interviews",
    description: "Schedule and track interviews with candidates. Manage interview dates, times, interviewers, and outcomes.",
    features: [
      "Schedule new interviews with date/time picker",
      "Assign interviewers and candidates",
      "Track interview status and notes",
      "View interview history and feedback"
    ],
    route: "/interviews"
  },
  {
    id: "employees",
    title: "Employees",
    description: "Maintain your employee database. Add, update, and manage employee information including roles, departments, and contact details.",
    features: [
      "Add new employees to the system",
      "Edit employee details and assignments",
      "Filter by department and position",
      "Delete employee records when needed"
    ],
    route: "/employees"
  },
  {
    id: "onboarding",
    title: "Onboarding",
    description: "Streamline the employee onboarding process. Create tasks, assign them to new hires, and track completion progress.",
    features: [
      "Start onboarding for new employees",
      "Create and assign onboarding tasks",
      "Update task status (Pending, In Progress, Completed)",
      "Monitor onboarding progress"
    ],
    route: "/onboarding"
  },
  {
    id: "offboarding",
    title: "Offboarding",
    description: "Manage employee exit processes. Track offboarding steps like exit interviews, clearances, and asset returns.",
    features: [
      "Initiate offboarding workflows",
      "Create exit process tasks",
      "Track clearance and asset returns",
      "Document exit interviews and feedback"
    ],
    route: "/offboarding"
  },
  {
    id: "documents",
    title: "Documents",
    description: "Upload and manage HR documents. Store resumes, contracts, certifications, and other important files.",
    features: [
      "Upload documents (PDF, DOCX, etc.)",
      "Organize by document type",
      "Download and delete documents",
      "Track document metadata"
    ],
    route: "/documents"
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Deep dive into HR analytics and insights. Visualize trends, patterns, and key metrics with interactive charts.",
    features: [
      "View workforce trends over time",
      "Analyze department-wise hiring",
      "Track attrition rates and patterns",
      "Export analytics reports"
    ],
    route: "/analytics"
  }
];

export default function Tutorial() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Load checked items from localStorage on mount
  useEffect(() => {
    const savedCheckedItems = localStorage.getItem('tutorialCheckedItems');
    if (savedCheckedItems) {
      try {
        const parsed = JSON.parse(savedCheckedItems);
        setCheckedItems(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse saved tutorial items:', error);
      }
    }
  }, []);

  // Save checked items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tutorialCheckedItems', JSON.stringify(Array.from(checkedItems)));
  }, [checkedItems]);

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const toggleAll = () => {
    if (checkedItems.size === tutorialItems.length) {
      setCheckedItems(new Set());
    } else {
      setCheckedItems(new Set(tutorialItems.map(item => item.id)));
    }
  };

  const completionPercentage = Math.round((checkedItems.size / tutorialItems.length) * 100);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#CDC1FF' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" style={{ color: '#3B1E54' }} />
            <h1 className="text-4xl font-bold" style={{ color: '#3B1E54' }}>Project Walkthrough Checklist</h1>
          </div>
          <p className="text-lg" style={{ color: '#3B1E54' }}>
            Welcome! Use this checklist to explore every page in the project. Tick items as you understand them.
          </p>
        </div>

        {/* Progress Card */}
        <Card className="mb-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderColor: '#3B1E54' }}>
          <CardHeader>
            <CardTitle style={{ color: '#3B1E54' }}>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{ color: '#3B1E54' }}>Pages Explored</span>
                <span className="text-2xl font-bold" style={{ color: '#3B1E54' }}>{checkedItems.size} / {tutorialItems.length}</span>
              </div>
              <div className="w-full rounded-full h-3" style={{ backgroundColor: 'rgba(59, 30, 84, 0.2)' }}>
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%`, backgroundColor: '#3B1E54' }}
                />
              </div>
              <p className="text-sm" style={{ color: '#3B1E54' }}>{completionPercentage}% Complete</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8">
          <Button
            onClick={toggleAll}
            variant="outline"
            className="text-white ml-auto"
            style={{ borderColor: '#3B1E54', color: '#3B1E54' }}
          >
            {checkedItems.size === tutorialItems.length ? "Clear All" : "Mark All"}
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="text-white"
            style={{ backgroundColor: '#3B1E54' }}
          >
            Start Exploring <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Tutorial Items */}
        <div className="space-y-4">
          {tutorialItems.map((item) => (
            <Card
              key={item.id}
              className="transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: checkedItems.has(item.id) ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                borderColor: '#3B1E54',
              }}
              onClick={() => toggleCheck(item.id)}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <Checkbox
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleCheck(item.id)}
                      className="w-6 h-6"
                      style={{ borderColor: '#3B1E54' }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-semibold" style={{ color: '#3B1E54' }}>{item.title}</h3>
                      {checkedItems.has(item.id) && (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#3B1E54' }} />
                      )}
                    </div>

                    <p className="mb-4" style={{ color: '#3B1E54' }}>{item.description}</p>

                    {/* Features List */}
                    <div className="space-y-2 mb-4">
                      {item.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="mt-1" style={{ color: '#3B1E54' }}>•</span>
                          <span className="text-sm" style={{ color: '#3B1E54' }}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Visit Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(item.route);
                      }}
                      variant="ghost"
                      className="p-0 h-auto"
                      style={{ color: '#3B1E54' }}
                    >
                      Visit Page <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completion Message */}
        {completionPercentage === 100 && (
          <Card className="mt-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: '#3B1E54' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8" style={{ color: '#3B1E54' }} />
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#3B1E54' }}>Congratulations! 🎉</h3>
                  <p style={{ color: '#3B1E54' }}>You've explored all pages. You're ready to use the platform!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
