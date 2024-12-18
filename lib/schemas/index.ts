import { z } from "zod";

export const editProfileformSchema = z.object({
  display_name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  bio: z.string().min(2, {
    message: "bio must be at least 2 characters.",
  }),
});