# KOKO NOTES APP

### WORK DONE SO FAR

- Created home page
- Created `/users/[userName]` dynamic route for displaying current user and added error handling page, if wrong `userName` is used the route segment.
- Created `/users/[userName]/notes` route for displaying common layout for all notes link for a user with name `userName`. Also generic note message is displayed
- Created `/users/[userName]/notes/[noteId]` for displaying common layout for all notes just like the route above and `title` and `content` of a note link. Subsequently, error handling page was created to display a generic UI when an unknown `noteId` was provided in thr route.
- Functionalites for editing form was also implemented and several Nextjs actions were created for `fetching user`, `fetching owner and notes`, `fetching, updating and deleting notes`.
- Add client side validation with zod and react-hook-form for note edit form

###### PROBLEMS YET TO BE SOLVED

- Fix issue relating to submitting empty `title or content` from the frontend
- Add better skeleton to show cool loading experience when navigating to edit route using `edit` button
- Find a more creative way of handling `error` messages thrown in server action within `error.tsx` file in all client routes or perhaps handling it without using `error.tsx` file.
- Add server-side validation for edit note form.

###### TODO

- Test if `prefetching` is enabled on links in `viewport` in production.
- Improved user experience by adding cool loading states when a user tries to edit a note and after submitting a note
- Fix typescript `no check` error on `NoteSideBarContent.tsx` and `/users/[userName]/notes/layout.tsx`
