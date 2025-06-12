# Product Requirements & User Stories: 3D Pop-Up Scrapbook App

This document defines the functional and non-functional requirements for the Minimum Viable Product (MVP) of the 3D scrapbook design application.

## Product Vision

To create a web application that allows a creator to design, visualize, and share an interactive preview of a 3D pop-up scrapbook design with clients or buyers before the physical product is made.

## User Roles

**Creator:** The primary user of the application (for the MVP, there will be only one account). The Creator has full access to upload assets, create designs, save projects, and share them.

**Buyer:** A user who receives a preview link. The Buyer has read-only access to inspect the design interactively.

## User Stories (MVP)

These user stories are broken down by major features.

### Authentication & Project Management

**US-01 (Login):** As a Creator, I want to be able to log in to the system using predefined credentials so that I can access my project dashboard.

**US-02 (Save Project):** As a Creator, I want to be able to save my design progress as a project so that I can continue working on it later.

**US-03 (Open Project):** As a Creator, I want to be able to re-open a saved project from a project list.

### Design Canvas & 3D Interaction

**US-04 (Edit/View Mode):** As a Creator, I want to be able to toggle between "Edit Mode" and "View Mode" using a switch so that I can test the Buyer's experience without leaving the page.

**US-05 (Frame Templates):** As a Creator, I want to be able to choose a frame size from several provided templates (e.g., 20x20, 20x30) when starting a new project.

**US-06 (Asset Upload):** As a Creator, I want to be able to upload PNG image files with transparent backgrounds into my project.

**US-07 (Object Manipulation):** While in "Edit Mode", as a Creator, I want to be able to click an image object on the 3D canvas to bring up a properties panel specific to that object.

**US-08 (Layering Control):** In the properties panel, as a Creator, I want to be able to set the number of layers for an image and set the distance (thickness) between those layers to create a 3D effect.

**US-09 (Position & Size Control):** In the properties panel, as a Creator, I want to be able to set the object's height from the frame's base and change its size.

**US-10 (Camera Control):** As a Creator, I want to be able to rotate, zoom, and pan the 3D canvas view to see the design from various angles.

**US-11 (Light Simulation):** As a Creator, I want to be able to set the position of the LED light source on the frame's walls and see its shadow effects in real-time.

### Sharing & Buyer View

**US-12 (Generate Link):** As a Creator, I want to be able to generate a unique link for my project that I can share with a Buyer.

**US-13 (Expiring Link):** As a Creator, I want to be able to set an expiration date for the link I create so that it cannot be accessed after the specified time.

**US-14 (Buyer View):** As a Buyer, when I open the link, I want to see a clean, interactive 3D view without editing tools, where I can only rotate, zoom, and toggle the frame's light on and off.

## Non-Functional Requirements

**NFR-01 (Performance):** The application must be able to render the 3D canvas with a minimum of 50 image objects smoothly (above 30 FPS) on modern hardware with a standard internet connection.

**NFR-02 (Security):** Projects created by the Creator are private and can only be accessed after login. Shared links must use a random, hard-to-guess token.

**NFR-03 (Compatibility):** The web application must function correctly on the two latest versions of modern browsers (Google Chrome, Mozilla Firefox, Safari).

**NFR-04 (Usability):** The interface must be intuitive. A Creator should be able to understand the basic workflow (upload, set layers, position) in under 5 minutes without a tutorial.