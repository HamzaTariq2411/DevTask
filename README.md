DevTask: Next.js Dashboard Application
A dashboard application built with Next.js that interacts with the JSONPlaceholder API to manage posts. The project includes an admin dashboard for full CRUD operations and a public site for viewing posts, styled with Tailwind CSS and shadcn/ui components, with data fetching powered by React Query and a rich text editor for post content.
Features

Admin Dashboard (/admin):
Create, read, update, and delete (CRUD) posts
Rich text editor for post body (using Quill)
Responsive and intuitive UI with shadcn/ui components


Public Site (/):
Displays a list of posts with title and excerpt
Post details page (/posts/[id]) for full post content


Tech Stack:
Next.js 15.3.2 with React 19
Tailwind CSS with shadcn/ui for styling
React Query (@tanstack/react-query) for API data fetching and caching
Quill for rich text editing



Prerequisites
Ensure the following are installed:

Node.js: Version 18 or higher
npm: Version 8 or higher (included with Node.js)
Git: For cloning the repository

Setup and Running Locally

Clone the Repository:
git clone repo
cd devtask


Install Dependencies:Install all required packages listed in package.json:
npm install

This installs Next.js, Tailwind CSS, shadcn/ui components, React Query, Quill, and other dependencies.

Run the Development Server:Start the Next.js development server with Turbopack for faster development:
npm run dev

The application will be available at http://localhost:3000. Navigate to:

/ for the public site
/admin for the admin dashboard


Build for Production (optional):Create an optimized production build:
npm run build


Start the Production Server (optional):Run the production server after building:
npm run start


Linting (optional):Check code quality and formatting:
npm run lint

