# FocusTrack

FocusTrack is a robust to-do application designed to enhance daily engagement and improve task accountability. Built with React, TypeScript, and Vite, it emphasizes building consistent habits through mandatory completions, scheduling features, and a daily accountability challenge.

## Key Features

*   **Robust Task Scheduling:** Define specific start and end times for tasks. Assign tasks to single or multiple days of the week, allowing for flexible yet structured routines.
*   **Mandatory Completion Workflow:** Once a task is marked as complete, it cannot be unchecked. This enforces accountability and provides a definitive sense of accomplishment. Incomplete items maintain visual prominence.
*   **Daily Accountability Challenge:** A unique daily challenge system that tracks your progress against scheduled tasks. Complete all active tasks for the day to maintain and build your streak.
*   **Streak Tracking:** Visually track your consecutive days of completing all scheduled tasks, motivating you to interact with the application daily.
*   **Local Storage Persistence:** All tasks and your current streak are saved locally in your browser, ensuring no data is lost between sessions.
*   **Modern UI:** A clean, responsive interface styled with Tailwind CSS, offering a smooth user experience.

## Technologies Used

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS, `lucide-react` for icons
*   **State Management:** Zustand
*   **Utilities:** `date-fns` for robust date manipulation

## Getting Started

### Prerequisites

*   Node.js (v16 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd FocusTrack
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).
