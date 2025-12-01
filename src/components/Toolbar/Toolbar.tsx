import { useState } from 'react'
import { Home, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause, RotateCcw, Settings, Mic, RefreshCw, History } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import ModeToggle from './ModeToggle'
import VoiceControl from './VoiceControl'
import PracticeRecordModal from '../PracticeRecord/PracticeRecordModal'

interface ToolbarProps {
  isListening?: boolean
  error?: string | null
  currentNoteIndex?: number
  totalNotes?: number
}

export default function Toolbar({ 
  isListening, 
  error, 
  currentNoteIndex, 
  totalNotes 
}: ToolbarProps = {}) {
  const navigate = useNavigate()
  const [showRecordModal, setShowRecordModal] = useState(false)
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    isPlaying,
    setIsPlaying,
    practiceSettings,
    setPracticeSettings,
    markers,
    saveCurrentPracticeAndReset,
    practiceRecords,
  } = useStore()

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    const hasMarkers = markers.length > 0
    const message = hasMarkers
      ? '确定要重新开始吗？当前练习记录将被保存到演奏记录中。'
      : '确定要重新开始吗？将重置所有练习状态。'
    
    if (window.confirm(message)) {
      saveCurrentPracticeAndReset()
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Navigation and home */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Home"
          >
            <Home className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-700 min-w-[80px] text-center">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Mode toggle and playback controls */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {practiceSettings.mode === 'practice' && (
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </>
              )}
            </button>
          )}
          
          {practiceSettings.mode === 'practice' && (
            <button
              onClick={handleRestart}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                markers.length > 0
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={markers.length > 0 ? '重新开始（保存当前记录并清空标记）' : '重新开始（重置练习状态）'}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">重新开始</span>
            </button>
          )}
          
          {practiceSettings.mode === 'practice' && practiceSettings.loopStart && (
            <button
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Reset Loop"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          )}
        </div>

        {/* Right: Settings and voice control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRecordModal(true)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="查看演奏记录"
          >
            <History className="w-5 h-5" />
            {practiceRecords.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                {practiceRecords.length > 99 ? '99+' : practiceRecords.length}
              </span>
            )}
          </button>
          
          <VoiceControl 
            isListening={isListening} 
            error={error}
            currentNoteIndex={currentNoteIndex}
            totalNotes={totalNotes}
          />
          
          <button
            onClick={() => setPracticeSettings({ autoTurnPage: !practiceSettings.autoTurnPage })}
            className={`p-2 rounded-lg transition-colors ${
              practiceSettings.autoTurnPage
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Auto Turn Page"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <PracticeRecordModal 
        isOpen={showRecordModal} 
        onClose={() => setShowRecordModal(false)} 
      />
    </div>
  )
}

