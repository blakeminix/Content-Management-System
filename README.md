# Content Management System

Welcome to my [Content Management System](https://content-management-system-32ddcdcefaf8.herokuapp.com/)!

This project is built with Next.js, React, JavaScript, Tailwind CSS, and a MySQL database hosted through JawsDB. It is deployed with Heroku. JWT is used for session cookie encryption, and bcrypt is used for secure password hashing. 

## Introduction
This Content Management System allows users to create and manage groups, share posts and media, and interact with other users. It includes user authentication, profile management, and group functionalities.

## Features
- User authentication with JWT and bcrypt
- Profile management
- Group creation and management
- Media sharing within groups
- Role-based access control

## Login

![Login](https://github.com/blakeminix/blakeminix.com/blob/main/public/login.PNG)

Users can login or redirect to the sign-up page. Invalid username or password entries display an error message.

## Dashboard

![Dashboard](https://github.com/blakeminix/blakeminix.com/blob/main/public/dashboard.PNG)

The dashboard is the hub of all operations for the CMS. It displays the user's groups, profile, account settings, and logout options. 

## Profile

![Profile](https://github.com/blakeminix/blakeminix.com/blob/main/public/profile.PNG)

Each user's profile contains a description and a list of groups they are a member of. Owners can edit their descriptions directly.

## Group
![Group](https://github.com/blakeminix/blakeminix.com/blob/main/public/group.PNG)

The group's home page includes a description and a sidebar for navigation. Only the owner can edit the description.

## Group Media
![Media](https://github.com/blakeminix/blakeminix.com/blob/main/public/media.PNG)

Members can upload pictures and videos. Posts can be deleted by their authors, moderators, or the group owner depending on permissions.

## Installation and Setup

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

