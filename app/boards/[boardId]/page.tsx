import { PrismaClient } from "../../generated/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AddTaskDialog } from "./add-task-dialog"

const prisma = new PrismaClient()

interface PageProps {
  params: Promise<{ boardId: string }>
}

export default async function BoardPage({ params }: PageProps) {
  const { boardId } = await params
  
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      columns: {
        orderBy: { position: "asc" },
        include: {
          tasks: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  })

  if (!board) {
    notFound()
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{board.title}</h1>
            {board.description && (
              <p className="text-muted-foreground mt-2">{board.description}</p>
            )}
          </div>
        </header>

        <div className="flex gap-6 overflow-x-auto pb-6">
          {board.columns.map((column) => (
            <div
              key={column.id}
              className="min-w-[280px] bg-muted/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h2 className="font-semibold text-foreground">{column.title}</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-card p-3 rounded-md border shadow-sm"
                  >
                    <h3 className="font-medium text-card-foreground mb-1">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === "URGENT"
                            ? "bg-red-500 text-white"
                            : task.priority === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority === "LOW" ? "低" : 
                         task.priority === "MEDIUM" ? "中" : 
                         task.priority === "HIGH" ? "高" : "緊急"}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(task.dueDate).toLocaleDateString("ja-JP")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                {column.tasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      タスクがありません
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <AddTaskDialog columnId={column.id} boardId={board.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}