"use server"

import { PrismaClient } from "../../generated/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const prisma = new PrismaClient()

const createTaskSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().optional(),
  columnId: z.string(),
  boardId: z.string(),
})

export async function createTask(formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      dueDate: formData.get("dueDate") as string,
      columnId: formData.get("columnId") as string,
      boardId: formData.get("boardId") as string,
    }

    const validatedData = createTaskSchema.parse(rawData)

    // Get the highest position in the column to add the new task at the bottom
    const lastTask = await prisma.task.findFirst({
      where: { columnId: validatedData.columnId },
      orderBy: { position: "desc" },
    })

    const newPosition = (lastTask?.position ?? -1) + 1

    await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        columnId: validatedData.columnId,
        position: newPosition,
      },
    })

    revalidatePath(`/boards/${validatedData.boardId}`)
    
    return { success: true }
  } catch (error) {
    console.error("Failed to create task:", error)
    return { 
      success: false, 
      error: error instanceof z.ZodError 
        ? error.errors[0].message 
        : "タスクの作成に失敗しました" 
    }
  }
}