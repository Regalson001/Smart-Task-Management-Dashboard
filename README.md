
# TaskFlow — Smart Task Management Dashboard

A responsive task management dashboard built with HTML, CSS, and vanilla JavaScript. TaskFlow provides a simple workspace for organizing daily tasks, setting priorities, tracking progress, and keeping work visible.

## Features

- **Task management:** Create, edit, delete, and update tasks.
- **Status columns:** Organize work into To do, In progress, and Completed.
- **Priority levels:** Mark tasks as High, Medium, or Low priority.
- **Search and filtering:** Find tasks by title or description and filter by priority.
- **Dashboard statistics:** View task totals, active work, completed items, and outstanding high-priority tasks.
- **Due dates:** Add a due date to each task.
- **Browser persistence:** Tasks are stored in localStorage and remain available in the same browser.
- **Responsive layout:** Adapted for desktop, tablet, and mobile screens.
- **Accessible controls:** Form labels, keyboard focus styles, and status announcements.

## Built With

- HTML5 — semantic page structure
- CSS3 — responsive layout, Grid, Flexbox, and custom properties
- JavaScript (ES6+) — task operations, rendering, filtering, and event handling
- Browser localStorage — local task persistence
- Google Fonts — DM Sans and Manrope

## Project Structure

```text
smart-task-management-dashboard/
├── index.html
├── styles.css
├── script.js
├── README.md
└── .gitignore
```

## Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Regalson001/Smart-Task-Management-Dashboard.git
   ```

2. Open the folder:

   ```bash
   cd Smart-Task-Management-Dashboard
   ```

3. Open `index.html` in your browser, or use the Live Server extension in Visual Studio Code.

No build process or package installation is required.

## How to Use

1. Select **Add new task** to create a task.
2. Enter a title and optionally add a description and due date.
3. Choose a priority and status.
4. Use the task actions to edit, delete, start, complete, or reopen work.
5. Search for tasks or filter them by priority.

The initial sample tasks demonstrate the interface. You can delete them and add your own.

## Important Notes

This is a front-end portfolio project. Task data is saved only in the current browser's localStorage; it is not connected to a server and does not synchronize between devices. Project cards display illustrative sample progress and are not connected to a project-tracking backend.

## Skills Demonstrated

- Semantic HTML and accessible form design
- Responsive layouts with CSS Grid and Flexbox
- Reusable UI styling and CSS custom properties
- JavaScript DOM manipulation and event delegation
- Array filtering and state updates
- JSON serialization and localStorage
- Git and GitHub project documentation

## Future Improvements

- Drag-and-drop task movement
- Editable project cards and progress
- Task categories and sorting
- Dark mode
- Backend authentication and cross-device synchronization
- Automated tests

## Author

**Stephen Oyugi**  
Front-End Developer | HTML5 & CSS3

GitHub: [@Regalson001](https://github.com/Regalson001)

## License

This project is available for learning and portfolio demonstration. Add a formal license file if you intend to distribute it under specific reuse terms.
