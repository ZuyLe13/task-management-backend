import z from "zod";

export const RoleEnum = z.enum(['admin', 'owner', 'member']);
export type ROLE = z.infer<typeof RoleEnum>;

export const WorkspaceMemberSchema = z.object({
  user: z.string().refine((val) => val.match(/^[a-f\d]{24}$/i), {
    message: 'Invalid ObjectId'
  }),
  role: RoleEnum,
  joinedAt: z.coerce.date()
});

export const WorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  desc: z.string().optional(),
  owner: z.string().optional(),
  members: z.array(WorkspaceMemberSchema).optional(),
});