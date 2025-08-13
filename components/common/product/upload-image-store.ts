import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface UploadedImage {
  id: string | number;
  url: string;
  image: File | null;
  filename: string | null;
}

export type UploadedImageStore = {
  uploadedImages: UploadedImage[];
  setUploadedImages: (
    imageOrFunction:
      | UploadedImage[]
      | ((prev: UploadedImage[]) => UploadedImage[]),
  ) => void;
};

export const useUploadedImageStore = create<UploadedImageStore>()(
  immer((set) => ({
    uploadedImages: [],
    setUploadedImages: (imageOrFunction) =>
      set((state) => ({
        uploadedImages:
          typeof imageOrFunction === "function"
            ? imageOrFunction(state.uploadedImages)
            : imageOrFunction,
      })),
  })),
);
