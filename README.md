# CodeLeap Network - Frontend Challenge

This project is a solution for the CodeLeap Frontend Developer assessment. It's a simple social network interface allowing users to sign up (using a username), create, read, edit, and delete posts, closely following the provided design specifications. This implementation goes beyond the core requirements by incorporating several bonus features using React, TypeScript and Firebase.

## Link to Live Demo
[CodeLeap Front-end test](https://code-leap-bice.vercel.app/)

## Preview
<img src="./src/assets/codeleap.webp" alt="Gif demonstrating features" />

---

## Features

### Core Requirements Implemented:

*   **Signup:** Simple username entry screen, adhering to the design, with the "Enter" button disabled until a username is typed. (Enhanced with Firebase Auth - see Bonus Features).
*   **Post Creation:** Users can create new posts using a form with "Title" and "Content" fields. The "Create" button is disabled if either field is empty, matching the design specification.
*   **Post Feed:** Fetches and displays posts from the backend (Firebase).
*   **Real-time Updates:** The post list updates automatically when a new post is created.
*   **Post Sorting:** Posts are displayed with the most recent ones first.
*   **Conditional Edit/Delete Icons:** Edit (📝) and Delete (🗑️) icons are only visible on posts created by the currently logged-in user, as specified in the design.
*   **Edit Posts:** Users can edit their own posts via a modal pre-filled with the existing title and content.
*   **Delete Posts:** Users can delete their own posts, triggering a confirmation modal before proceeding.
*   **Clean & Consistent UI:** Adheres closely to the provided design mockups, focusing on layout, component appearance (modals, buttons, inputs), consistency, spacing, and usability.

### Bonus Features & Enhancements:

*   **Firebase Authentication:** Replaced simple username persistence with robust email/password authentication via Firebase Auth for a more realistic login/logout solution.
*   **Firebase Firestore:** Used as the backend database to store and retrieve posts and comments in real-time.
*   **Like/Unlike Posts:** Users can like and unlike posts, with counts updated visually.
*   **Real-time Comments:**
    *   Users can view and add comments to posts within a dedicated modal.
    *   Comments appear in real-time for all users viewing the post.
    *   Users can delete their own comments (indicated by a trash icon next to their comments).
*   **Image Uploads:** Users can optionally attach an image when creating a post. Images are uploaded and hosted on Cloudinary.
*   **"My Posts" Page:** A dedicated view showing only the posts created by the currently logged-in user.
*   **Fully Responsive Design:** The interface adapts seamlessly to various screen sizes, ensuring usability on both desktop and mobile devices.
*   **Loading Indicators:** Visual feedback (spinners/loaders) is provided during asynchronous operations like fetching data or submitting forms.
*   **User Feedback Toasts:** Non-intrusive notifications (toasts) inform the user about the success or failure of actions (e.g., post created, error deleting).
*   **Cloudinary Integration:** Efficiently handles image storage and retrieval.

---

## Technology Stack

*   **Frontend:** React
*   **Language:** TypeScript
*   **Styling:** CSS Modules
*   **State Management:** Redux Toolkit
*   **Backend & Database:** Firebase (Authentication, Firestore)
*   **Image Hosting:** Cloudinary
*   **Routing:** React Router DOM
*   **Build Tool:** Vite
*   **Package Manager:** npm

---

## Project Structure

```bash
├── .env.example # Environment variable template
├── .gitignore
├── README.md
├── index.html # Main HTML entry point
├── package.json
├── src
│ ├── App.tsx # Main application component & routing setup
│ ├── assets/ # Static assets (images, etc.)
│ ├── components/ # Reusable UI components (Button, Input, Modals, PostCard, etc.)
│ ├── pages/ # Page-level components (MainScreen, MyPosts, Signin, Signup)
│ ├── routes/ # Routing configuration
│ ├── services/ # API/external service connections (Firebase)
│ ├── store/ # Global state (Redux Toolkit)
│ ├── utils/ # Helper functions (time formatting, etc.)
│ ├── main.tsx # Application entry point
│ └── index.css # Global styles
├── tsconfig.json # Base TypeScript configuration
└── vite.config.ts # Vite build tool configuration
```

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js
*   npm or yarn
*   A Firebase project (set up Authentication with Email/Password and Firestore database)
*   A Cloudinary account (for image uploads - create an Unsigned preset)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Antonio-Savio/CodeLeap.git
    cd CodeLeap
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory, and fill in your Firebase and Cloudinary credentials.

    ```bash
    # .env.example

    # Firebase Configuration
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
    VITE_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID

    # Cloudinary Configuration
    VITE_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
    VITE_CLOUDINARY_UPLOAD_PRESET=YOUR_CLOUDINARY_UPLOAD_PRESET # Create an Unsigned preset in Cloudinary
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  **Open the application:**
    Navigate to `http://localhost:5173` in your browser.

---

## Project Highlights (Addressing Assessment Criteria)

*   **Design Adherence:** Closely matches the provided mockups, including component states (disabled buttons, modals) and layout.
*   **User Experience:** Intuitive interface with clear feedback (loaders, toasts) and conditional logic (edit/delete icons) enhancing usability.
*   **Responsiveness:** Fully responsive design ensures usability across various devices.
*   **Code Quality:** Built with React, TypeScript, and CSS Modules, emphasizing component reusability and a structured approach.
*   **Functionality:** Successfully implements all core requirements and includes several bonus features (Auth, Likes, Comments, Images) demonstrating broader skills.
*   **Attention to Detail:** Careful implementation of requirements like confirmation modals and real-time updates.
