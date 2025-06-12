export const mockAssets = [
  {
    id: '1',
    name: 'flower.png',
    url: '/mock-assets/flower.png',
    type: 'image/png',
    size: 245760, // 240KB
    thumbnail: '/mock-assets/flower-thumb.png',
    hasTransparency: true,
  },
  {
    id: '2',
    name: 'butterfly.png',
    url: '/mock-assets/butterfly.png',
    type: 'image/png',
    size: 189440, // 185KB
    thumbnail: '/mock-assets/butterfly-thumb.png',
    hasTransparency: true,
  },
  {
    id: '3',
    name: 'tree.png',
    url: '/mock-assets/tree.png',
    type: 'image/png',
    size: 512000, // 500KB
    thumbnail: '/mock-assets/tree-thumb.png',
    hasTransparency: true,
  },
];

export const mockFrameTemplates = [
  {
    id: 'frame-20x20',
    name: '20x20 cm Frame',
    width: 200,
    height: 200,
    depth: 50,
  },
  {
    id: 'frame-20x30',
    name: '20x30 cm Frame',
    width: 200,
    height: 300,
    depth: 50,
  },
];

export const mockProject = {
  id: 'project-1',
  name: 'My First Scrapbook',
  frameTemplate: mockFrameTemplates[0],
  objects: [
    {
      id: 'obj-1',
      assetId: '1',
      position: { x: 0, y: 0, z: 5 },
      scale: 1.0,
      layers: 3,
      layerSpacing: 2,
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};