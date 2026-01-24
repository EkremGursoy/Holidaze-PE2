import { useParams } from 'react-router'

export default function VenueDetailsPage() {
  const { id } = useParams()

  return (
    <div>
      <h1>Venue Details {id ? `(ID: ${id})` : ''}</h1>
    </div>
  )
}
