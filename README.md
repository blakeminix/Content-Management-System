# Content Management System

Welcome to my [Content Management System](https://content-management-system-32ddcdcefaf8.herokuapp.com/)!

This project is built with Next.js, React, JavaScript, Tailwind CSS, and a MySQL database hosted through JawsDB. It is deployed on Heroku. JWT is used for session cookie encryption and bcrypt is used for secure password hashing. 

This project contains implemented authorization, profiles for users, groups where users can share/store posts and media, and other pages that support the profile and group functionality such as the join group page, create group page, page not found pages, and more. 

## Login

![Login](https://github.com/blakeminix/blakeminix.com/blob/main/public/login.PNG)

This is where the user can log in or redirect to the sign-up page. If the user enters an invalid username or password, an error message displays indicating such. 

## Dashboard

![Dashboard](https://github.com/blakeminix/blakeminix.com/blob/main/public/dashboard.PNG)

This is the dashboard, which is the hub of all operations for the CMS. The user's groups display in a grid-like formation showing the name of the group and the group's unique ID. The user can choose to click on an existing group, redirect to create a new group, or interact with the drop-down to access their profile, account settings, or to logout.

## Profile

![Profile](https://github.com/blakeminix/blakeminix.com/blob/main/public/profile.PNG)

Each user's profile contains a description and list of groups that they are a member of. The owner of the profile is able to simply interact and change the description directly from the location where the description is displayed, while other users will see this description as a displaying of unchangeable words.

Any attempt to access a profile for an account that has been deleted or whose username does not exist will redirect to the user not found page.

## Group
![Group](https://github.com/blakeminix/blakeminix.com/blob/main/public/group.PNG)

The group's home page consists of a description and a sidebar where a member can redirect to other pages within the group. Only the owner is able to edit the description; other members will see the description as a displaying of unchangeable words. 

If a non-member of the group attempts to access any group page, they will be redirected to a join group page where they will be able to either join the group if it is public or request to join the group if it is private. 

Any attempt to access a group page for a group that does not exist will redirect to a group not found page.

## Group Media
![Media](https://github.com/blakeminix/blakeminix.com/blob/main/public/media.PNG)

Members are able to upload pictures and short videos to the media tab. All members are able to delete their own posts, moderators are able to delete any non-moderator's post, and the group owner is able to delete any post.


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

