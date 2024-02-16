import { cn } from "@/utils/misc";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { useFormContext, useWatch } from "react-hook-form";
import Image from "next/image";

const ImageChooser = ({
  image,
}: {
  image: { id: string; altText: string };
}) => {
  const { control } = useFormContext();
  const currentImageId = useWatch({ name: image.id, control });
  const currentAltText = useWatch({ name: image.altText, control });
  const existingImage = Boolean(currentImageId);
  const existingAltText = Boolean(currentAltText);

  const [previewImage, setPreviewImage] = useState<string | null>(
    existingImage ? `/resources/note-images/${currentImageId}` : null
  );
  const [altText, setAltText] = useState(existingAltText ? currentAltText : "");
  return (
    <fieldset>
      <div className="flex gap-3">
        <div className="w-32">
          <div className="relative h-32 w-32">
            <label
              htmlFor="image-input"
              className={cn("group absolute h-32 w-32 rounded-lg", {
                "bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100":
                  !previewImage,
                "cursor-pointer focus-within:ring-4": !existingImage,
              })}
            >
              {previewImage ? (
                <div className="relative">
                  <Image
                    height={0}
                    width={0}
                    src={previewImage}
                    alt={altText ?? ""}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                  {existingImage ? null : (
                    <div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
                      new
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
                  ➕
                </div>
              )}
              {existingImage ? (
                <input name="imageId" type="hidden" value={currentImageId} />
              ) : null}
              <input
                id="image-input"
                aria-label="Image"
                className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
                onChange={(event) => {
                  console.log(
                    "Files, values: ",
                    event.target.files,
                    event.target.value
                  );
                  const file = event.target.files?.[0];

                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewImage(null);
                  }
                }}
                name="file"
                type="file"
                accept="image/*"
              />
            </label>
          </div>
        </div>
        <div className="flex-1">
          <Label htmlFor="alt-text">Alt Text</Label>
          <Textarea
            id="alt-text"
            name="altText"
            defaultValue={altText}
            onChange={(e) => setAltText(e.currentTarget.value)}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default ImageChooser;
