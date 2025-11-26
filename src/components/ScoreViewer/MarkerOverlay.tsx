import { Marker } from '../../types'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'

interface MarkerOverlayProps {
  page: number
  markers: Marker[]
}

export default function MarkerOverlay({ markers }: MarkerOverlayProps) {
  const { removeMarker } = useStore()

  return (
    <div className="absolute inset-0 pointer-events-none">
      {markers.map((marker) => {
        const isAutoDetected = marker.id.startsWith('auto-')
        const isCorrect = marker.type === 'correct'
        const isError = marker.type === 'error'
        
        let markerStyle = ''
        if (isCorrect) {
          markerStyle = 'bg-green-400 border-green-600'
        } else if (isError) {
          markerStyle = 'bg-red-400 border-red-600 animate-pulse'
        } else if (isAutoDetected) {
          markerStyle = 'bg-orange-400 border-orange-600 animate-pulse'
        } else {
          markerStyle = 'bg-yellow-400 border-yellow-600'
        }

        return (
          <div
            key={marker.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative group">
              <div
                className={`w-4 h-4 rounded-full border-2 opacity-80 hover:opacity-100 transition-opacity shadow-lg ${markerStyle}`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeMarker(marker.id)
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
              {marker.note && (
                <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap pointer-events-auto border ${
                  isCorrect 
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : isError
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-white border-gray-200'
                }`}>
                    {marker.note}
                    {isAutoDetected && (
                      <span className="ml-1 text-orange-600 text-[10px]">(Auto)</span>
                    )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

