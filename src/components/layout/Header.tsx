import { Button } from "@/components/ui/button";
import { Save, Share2, Eye, Edit3, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EditorState } from "@/types";

interface HeaderProps {
  editorState?: EditorState;
  onEditorStateChange?: (state: EditorState) => void;
}

export function Header({ editorState, onEditorStateChange }: HeaderProps) {
  const { user, logout } = useAuth();

  const handleModeToggle = (mode: 'edit' | 'view') => {
    if (editorState && onEditorStateChange) {
      onEditorStateChange({
        ...editorState,
        mode,
        showProperties: mode === 'view' ? false : editorState.showProperties
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

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
        {/* Project Actions - only show in editor mode */}
        {editorState && (
          <>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            {/* Edit/View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                className={editorState.mode === 'edit' ? "bg-primary text-primary-foreground" : ""}
                onClick={() => handleModeToggle('edit')}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={editorState.mode === 'view' ? "bg-primary text-primary-foreground" : ""}
                onClick={() => handleModeToggle('view')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </>
        )}

        {/* User Menu */}
        <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}