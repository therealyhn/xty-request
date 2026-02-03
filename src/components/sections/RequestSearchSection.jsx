import Container from '../ui/Container.jsx'
import Panel from '../ui/Panel.jsx'
import DeezerSearchInput from '../shared/DeezerSearchInput.jsx'
import TrackResultsList from '../shared/TrackResultsList.jsx'
import SelectedTrackCard from '../shared/SelectedTrackCard.jsx'
import RequestForm from '../shared/RequestForm.jsx'

export default function RequestSearchSection() {
  return (
    <section className="relative z-10 pb-16">
      <Container>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-7">
            <Panel className="p-6">
              <DeezerSearchInput />
            </Panel>
            <Panel className="relative p-6">
              <div className="absolute left-6 right-6 top-0 h-px overflow-hidden">
                <div className="h-px w-1/3 animate-scan bg-primary/40" />
              </div>
              <TrackResultsList items={[]} />
            </Panel>
          </div>
          <div className="flex flex-col gap-6 md:col-span-5">
            <Panel className="p-6">
              <SelectedTrackCard />
            </Panel>
            <Panel className="p-6">
              <RequestForm />
            </Panel>
          </div>
        </div>
      </Container>
    </section>
  )
}
