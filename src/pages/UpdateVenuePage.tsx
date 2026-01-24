import { useParams } from 'react-router'

export default function UpdateVenuePage() {
  const { id } = useParams()

  return (
    <div>
      <h1>Update Venue {id ? `(ID: ${id})` : ''}</h1>
    </div>
  )
}
