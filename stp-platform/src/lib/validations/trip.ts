import { z } from "zod";

export const createTripSchema = z.object({
    origin: z.string().min(2, "Origin is required"),
    destination: z.string().min(2, "Destination is required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    time: z.string().optional(),
    mode: z.enum(["Train", "Bus", "Flight", "Cab"]),
    description: z.string().max(500, "Description is too long").optional(),
});
