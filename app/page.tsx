import { BoardCreateDialog } from "@/components/board-create-dialog"

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kanban App</h1>
            <p className="text-muted-foreground mt-2">
              プロジェクトを効率的に管理しましょう
            </p>
          </div>
          <BoardCreateDialog />
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-dashed border-border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              ボードがありません
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              新しいボードを作成して始めましょう
            </p>
            <BoardCreateDialog />
          </div>
        </div>
      </div>
    </div>
  )
}
