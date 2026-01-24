import z from "zod";

export const password = z.string()
.min(8, "Password must be at least 8 characters long")


export const email = z.email("Please enter a valid email address")
