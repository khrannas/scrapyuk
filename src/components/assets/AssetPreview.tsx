import React from 'react';
import { X, Download, Trash2, Copy, Calendar, HardDrive, Image } from 'lucide-react';
import { Asset } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AssetPreviewProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onUse: (asset: Asset) => void;
  onDelete: (assetId: number) => void;
}

export function AssetPreview({
  asset,
  isOpen,
  onClose,
  onUse,
  onDelete,
}: AssetPreviewProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUse = () => {
    onUse(asset);
    onClose();
  };

  const handleDelete = () => {
    onDelete(asset.id);
    onClose();
  };

  const handleDownload = () => {
    if (asset.url) {
      const link = document.createElement('a');
      link.href = asset.url;
      link.download = asset.filename;
      link.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate mr-4">{asset.filename}</span>
            <div className="flex items-center space-x-2">
              {asset.hasTransparency && (
                <Badge variant="secondary">
                  Transparent PNG
                </Badge>
              )}
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Image Preview */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-lg bg-muted overflow-hidden border">
              {asset.url ? (
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="w-full h-full object-contain"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Image className="h-12 w-12 mx-auto mb-2" />
                    <p>No preview available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button onClick={handleUse} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Use in 3D Scene
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Asset Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Asset Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Image className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">File Name</p>
                    <p className="text-muted-foreground break-all">{asset.filename}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <HardDrive className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">File Size</p>
                    <p className="text-muted-foreground">{formatFileSize(asset.size)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Uploaded</p>
                    <p className="text-muted-foreground">{formatDate(asset.uploaded_at)}</p>
                  </div>
                </div>

                {asset.dimensions && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Image className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Dimensions</p>
                      <p className="text-muted-foreground">
                        {asset.dimensions.width} × {asset.dimensions.height} pixels
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Properties</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Format</span>
                  <Badge variant="outline">PNG</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Transparency</span>
                  <Badge variant={asset.hasTransparency ? 'default' : 'outline'}>
                    {asset.hasTransparency ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>3D Ready</span>
                  <Badge variant={asset.hasTransparency ? 'default' : 'secondary'}>
                    {asset.hasTransparency ? 'Yes' : 'Limited'}
                  </Badge>
                </div>
              </div>
            </div>

            {asset.hasTransparency && (
              <>
                <Separator />
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Perfect for 3D
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        This PNG has transparency, making it ideal for creating layered 3D objects.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}