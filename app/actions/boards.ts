"use server"

import { PrismaClient } from "../generated/prisma"
import { redirect } from "next/navigation"
import { z } from "zod"

const prisma = new PrismaClient()

const createBoardSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
})

export async function createBoard(formData: FormData) {
  const result = createBoardSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  })

  if (!result.success) {
    return {
      error: "入力内容に誤りがあります",
      fieldErrors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const board = await prisma.$transaction(async (tx) => {
      // ボードを作成
      const newBoard = await tx.board.create({
        data: {
          title: result.data.title,
          description: result.data.description,
        },
      })

      // デフォルトの3つのカラムを作成
      const defaultColumns = [
        { title: "To Do", position: 0, color: "#ef4444" }, // red-500
        { title: "In Progress", position: 1, color: "#f59e0b" }, // amber-500
        { title: "Done", position: 2, color: "#10b981" }, // emerald-500
      ]

      await tx.column.createMany({
        data: defaultColumns.map((column) => ({
          ...column,
          boardId: newBoard.id,
        })),
      })

      return newBoard
    })

    // redirect()は例外を投げるので、try-catch文の外で呼ぶ
    redirect(`/boards/${board.id}`)
  } catch (error) {
    // redirect()によるエラーの場合は再スローする
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    
    console.error("Failed to create board:", error)
    return {
      error: `ボードの作成に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}