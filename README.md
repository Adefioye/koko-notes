# KOKO NOTES APP

This application is motivated by Epic web dev course by Kent C Dodds. It was originally built using Remix. However, Since I am not interested in learning Remix. I instead developed the application entirely using Nextjs App Router in order to solidify my knowledge of building a professional-grade website with form validation and security, accessibility, role-based authentication and authorization, testing(including unit, integration and end-to-end testing).

## What makes this different

- Most of the implementations `page routing`, `user search`
- Form validation was done using `react-hook-form` and `zod` instead of `conform`
- Implemented honeypot to prevent spam bots from submitting **signup form**.
- Implemented user search with Nextjs-specific feature

### WORK DONE SO FAR

- Created home page
- Created `/users/[userName]` dynamic route for displaying current user and added error handling page, if wrong `userName` is used the route segment.
- Created `/users/[userName]/notes` route for displaying common layout for all notes link for a user with name `userName`. Also generic note message is displayed
- Created `/users/[userName]/notes/[noteId]` for displaying common layout for all notes just like the route above and `title` and `content` of a note link. Subsequently, error handling page was created to display a generic UI when an unknown `noteId` was provided in the route.
- Built functionalites for editing form and created several server actions for `fetching user`, `fetching owner and notes`, `fetching, updating and deleting notes`.
- Add client and server side validation with zod and react-hook-form for note edit form
- Add search for user and added index to increase user search speed by **850%** for average of `15000 users`, and `250 notes per users`

###### PROBLEMS YET TO BE SOLVED

- Add better skeleton to show cool loading experience when navigating to edit route using `edit` button
- Find a more creative way of handling `error` messages thrown in server action within `error.tsx` file in all client routes or perhaps handling it without using `error.tsx` file.
- Implement CSRF using `Next-auth`
- Implement **rate limit** on the API routes
- Implement authentication and authorization using `Next-Auth`
