import { AlertTriangle } from "lucide-react"

export default function ErrorState() {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center shadow-xs">
      <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
      <h3 className="mt-4 text-lg font-bold text-foreground">Query Failure</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        We couldn't connect to the backend services. Please make sure the
        service is running.
      </p>
    </div>
  )
}
