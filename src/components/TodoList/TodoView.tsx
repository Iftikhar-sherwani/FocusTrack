import { Header } from '../Layout/Header'
import { TodoPanel } from './TodoPanel'

export function TodoView() {
  return (
    <div className="space-y-6">
      <Header title="Task Execution" subtitle="Track what must be shipped today and this week." />
      <section className="theme-card border p-4 md:p-6">
        <TodoPanel />
      </section>
    </div>
  )
}
