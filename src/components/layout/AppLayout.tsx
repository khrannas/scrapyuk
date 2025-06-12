import { ReactNode } from "react";
import { Header } from "./Header";
import { LeftPanel } from "./LeftPanel";
import { MainCanvas } from "./MainCanvas";
import { RightPanel } from "./RightPanel";
import { EditorState } from "@/types";

interface AppLayoutProps {
  children?: ReactNode;
  editorState?: EditorState;
  onEditorStateChange?: (state: EditorState) => void;
}

export function AppLayout({ children, editorState, onEditorStateChange }: AppLayoutProps) {
  return (
    <div className="h-screen bg-background flex flex-col">
      <Header
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
      <div className="flex-1 flex overflow-hidden">
        {children ? (
          // Dashboard content mode
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        ) : (
          // 3D Editor mode
          <>
            <LeftPanel editorState={editorState} />
            <MainCanvas editorState={editorState} />
            <RightPanel editorState={editorState} />
          </>
        )}
      </div>
    </div>
  );
}