# User Management Web Application

This is a full-stack web application built with **Express.js** (backend), **Vite + React** (frontend), **Bootstrap** (styling), **Sequelize** (ORM), and **PostgreSQL** (database). The application allows users to register, log in, and manage other users in an admin panel. All users have admin privileges, meaning they can block, unblock, or delete any user, including themselves.

---

## Features

1. **User Registration and Authentication**:
   - Users can register with a unique email and any non-empty password.
   - No email confirmation is required.
   - Blocked users cannot log in, and deleted users can re-register.

2. **Admin Panel**:
   - Only authenticated users can access the admin panel.
   - The admin panel displays a table of users with the following fields:
     - Selection checkbox
     - Name
     - Email
     - Last login time
     - Status (Active/Blocked)
   - Users sorted by last login time.

3. **Toolbar Actions**:
   - **Block**: Block selected users.
   - **Unblock**: Unblock selected users.
   - **Delete**: Delete selected users.

4. **Multiple Selection**:
   - Users can select multiple rows using checkboxes.
   - A "Select All" checkbox in the table header allows selecting/deselecting all users.

5. **Security**:
   - Before every request (except registration/login), the server checks if the user exists and is not blocked based on database index
   - If the user is blocked or deleted, they are redirected to the login page.

6. **Database**:
   - A unique index is created on the `email` column in the database to ensure email uniqueness.
   - The database guarantees consistency even with simultaneous data pushes from multiple sources.

---

## Technologies Used

- **Frontend**:
  - React (Vite)
  - Bootstrap (for styling)
  - Axios (for API requests)

- **Backend**:
  - Express.js
  - Sequelize (ORM)
  - PostgreSQL (database)

- **Other Tools**:
  - Git (version control)
  - Postman (API testing)

---

## Repository Structure

The repository has two branches:
1. **frontend**: Contains the React application built with Vite.
2. **backend**: Contains the Express.js server and Sequelize models.

---

## Setup Instructions

### Prerequisites
- Node.js and npm installed.
- PostgreSQL installed and running.
- Git installed.

## Acknowledgments

- This project was developed as part of **Task #4** of the internship program at **Itransition**.
- Special thanks to Itransition for providing the opportunity to work on this challenging and educational task, which helped deepen my understanding of database index and full stack development.

## Live Demo

Check out the live demo of the application: https://itask4.vercel.app/
- Wait a moment it might take a while 
