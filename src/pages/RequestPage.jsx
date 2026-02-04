import RequestFlowSection from '../components/sections/RequestFlowSection.jsx'
import SuggestedMixesSection from '../components/sections/SuggestedMixesSection.jsx'

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-surface text-primary">
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <RequestFlowSection />
        <SuggestedMixesSection />
      </div>
    </div>
  )
}
