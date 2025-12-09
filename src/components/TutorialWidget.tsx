import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

export function TutorialWidget() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleVisitTutorial = () => {
    navigate("/tutorial");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-[#1b1833] hover:bg-white/20 hidden sm:flex"
          title="Tutorial"
        >
          <BookOpen className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-[10px] font-medium text-white flex items-center justify-center">
            ?
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" style={{ backgroundColor: '#CDC1FF', borderColor: '#3B1E54' }}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" style={{ color: '#3B1E54' }} />
              <h3 className="font-semibold" style={{ color: '#3B1E54' }}>Project Walkthrough</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-white/20"
              style={{ color: '#3B1E54' }}
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm" style={{ color: '#3B1E54' }}>
            New to the platform? Explore all pages with our interactive checklist guide.
          </p>

          <div className="space-y-2 text-sm" style={{ color: '#3B1E54' }}>
            <p>✓ Learn about each page</p>
            <p>✓ Track your progress</p>
            <p>✓ Quick navigation links</p>
          </div>

          <Button
            onClick={handleVisitTutorial}
            className="w-full text-white"
            style={{ backgroundColor: '#3B1E54' }}
          >
            Start Tutorial
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
