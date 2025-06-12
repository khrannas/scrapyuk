import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image, Folder } from "lucide-react";

export function LeftPanel() {
  return (
    <div className="w-80 bg-panel-surface border-r border-border p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center">
            <Image className="w-5 h-5 mr-2" />
            Assets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload PNG Images
          </Button>
          
          <div className="text-sm text-secondary-text">
            Upload PNG images with transparency to create 3D objects
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Recent Assets</div>
            <div className="grid grid-cols-2 gap-2">
              {/* Placeholder asset thumbnails */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded-md border border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  <Folder className="w-6 h-6 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading">Frame Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            20x20 cm Frame
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            20x30 cm Frame
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}