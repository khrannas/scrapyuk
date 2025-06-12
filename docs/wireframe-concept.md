# Wireframe Concept: Creator Editor Page

This document describes the wireframe layout for the main interface of the 3D scrapbook design application. Its purpose is to visualize the structure and placement of functional components.

## Main Layout Structure

The application interface is divided into three primary, responsive columns: a Left Panel (Assets & Objects), a Main Canvas (3D Area), and a Right Panel (Properties), with a Header at the top.

## Header (Top)

A horizontal bar at the very top of the screen, serving as the main navigation and project control area.

### Left Side

**Project Title:** An editable title text (e.g., "Mom's Birthday Gift").

### Right Side

**"Save" Button:** A diskette icon or a button with text.

**"Share" Button:** An arrow-out icon or a button with text. When clicked, it will open a pop-up to set the expiration and copy the link.

**"Mode" Toggle:** A toggle switch with two options: "Edit" ✏️ and "View" 👁️.

## Left Panel: Assets & Objects

A vertical panel on the left side of the screen that serves as the asset library and list of objects currently in use.

### Top Area: Asset Gallery

- A grid displaying thumbnails of all PNG images uploaded by the creator.
- A clear "+ Upload Image" button to open the file selection dialog.

### Bottom Area: Objects on Canvas List

- A vertical list containing the filenames of each object that has been added to the 3D frame (e.g., tree.png, cloud_1.png, heart.png).
- Clicking a name here will select the corresponding object on the 3D canvas.

## Main Canvas: 3D Area

The largest part of the screen, where all visual work happens.

**3D Frame View:** Displays the scrapbook frame in 3D. The user can rotate, zoom, and pan the view in this area.

**Interactive Objects:** All added images will be visible here. In "Edit Mode", hovering over an object will highlight it with an outline to indicate it's clickable.

**Light Control:** A small lightbulb icon 💡 in one corner of the frame that can be clicked to toggle the light simulation on and off.

## Right Panel: Properties Panel (Contextual)

A vertical panel on the right side. This panel is contextual, meaning it only appears when a Creator is in "Edit Mode" and has clicked an object on the 3D canvas.

**Panel Header:** Displays the filename of the selected object (e.g., tree.png).

### "Transform" Group

**Size:** A slider or number input to change the object's scale.

**Position (X, Y):** Inputs to move the object on the flat plane (left-right, forward-backward).

### "Layer & Height" Group

**Layer Count:** A number input (e.g., from 1 to 10) to define how many times the image is stacked.

**Layer Spacing (mm):** A small number input to set the thickness of the stack.

**Height from Base (cm):** A slider and number input to set how high the entire object stack is from the frame's base.