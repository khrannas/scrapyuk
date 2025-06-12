import { Button } from "@/components/ui/button";
import { Save, Share2, Eye, Edit3 } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold font-heading text-foreground">
          ScrapYuk
        </h1>
        <div className="text-sm text-muted-foreground">
          3D Pop-up Scrapbook Creator
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <div className="flex items-center bg-muted rounded-md p-1">
          <Button variant="ghost" size="sm" className="bg-primary text-primary-foreground">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </div>
      </div>
    </header>
  );
}