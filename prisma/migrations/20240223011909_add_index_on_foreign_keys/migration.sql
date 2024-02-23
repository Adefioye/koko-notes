-- CreateIndex
CREATE INDEX "Note_ownerId_idx" ON "Note"("ownerId");

-- CreateIndex
CREATE INDEX "NoteImage_noteId_idx" ON "NoteImage"("noteId");

-- CreateIndex
CREATE INDEX "UserImage_userId_idx" ON "UserImage"("userId");
