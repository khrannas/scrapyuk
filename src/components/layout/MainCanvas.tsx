import { Card } from "@/components/ui/card";
import { Box, MousePointer2 } from "lucide-react";

export function MainCanvas() {
  return (
    <div className="flex-1 p-4">
      <Card className="h-full bg-background border-2 border-dashed border-border/50">
        <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
            <Box className="w-12 h-12 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-semibold text-foreground">
              3D Canvas
            </h3>
            <p className="text-muted-foreground max-w-md">
              Your 3D scrapbook will appear here. Upload PNG images and start creating layered objects within your frame template.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-secondary-text">
            <MousePointer2 className="w-4 h-4" />
            <span>Click, drag, and rotate to interact with 3D objects</span>
          </div>

          {/* Placeholder frame indicator */}
          <div className="mt-8 p-4 border border-border rounded-lg bg-card/50">
            <div className="text-sm text-muted-foreground mb-2">Frame Template</div>
            <div className="w-48 h-32 border-2 border-primary/20 rounded bg-primary/5 flex items-center justify-center">
              <span className="text-xs text-primary">20x20 cm Frame</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}