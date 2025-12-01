import { useState } from 'react'
import { X, Clock, Music, AlertCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { PracticeRecord } from '../../types'

export default function PracticeRecordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { practiceRecords, removePracticeRecord } = useStore()
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set())

  if (!isOpen) {
    return null
  }

  const toggleExpand = (recordId: string) => {
    setExpandedRecords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(recordId)) {
        newSet.delete(recordId)
      } else {
        newSet.add(recordId)
      }
      return newSet
    })
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">演奏记录</h2>
              <p className="text-sm text-gray-500 mt-1">共 {practiceRecords.length} 条记录</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {practiceRecords.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">暂无演奏记录</p>
              <p className="text-gray-400 text-sm mt-2">点击"重新开始"按钮保存练习记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {practiceRecords.map((record) => {
                const isExpanded = expandedRecords.has(record.id)
                const autoMarkers = record.markers.filter(m => m.id.startsWith('auto-'))
                const manualMarkers = record.markers.filter(m => !m.id.startsWith('auto-'))

                return (
                  <div
                    key={record.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Record Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{record.scoreName}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              record.practiceMode === 'practice'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {record.practiceMode === 'practice' ? '练习模式' : '表演模式'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(record.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>错误标记: {record.totalMarkers} 个</span>
                          </div>
                          <span>页面: {record.currentPage}/{record.totalPages}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(record.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title={isExpanded ? '收起详情' : '展开详情'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('确定要删除这条记录吗？')) {
                              removePracticeRecord(record.id)
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="删除记录"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">总标记数</p>
                            <p className="text-2xl font-bold text-gray-900">{record.totalMarkers}</p>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">自动检测</p>
                            <p className="text-2xl font-bold text-orange-700">{record.autoDetectedMarkers}</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">手动标记</p>
                            <p className="text-2xl font-bold text-yellow-700">{record.manualMarkers}</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">练习模式</p>
                            <p className="text-lg font-semibold text-blue-700">
                              {record.practiceMode === 'practice' ? '练习模式' : '表演模式'}
                            </p>
                          </div>
                        </div>

                        {/* Markers List */}
                        {record.markers.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">标记详情：</p>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {record.markers.map((marker) => {
                                const isAuto = marker.id.startsWith('auto-')
                                return (
                                  <div
                                    key={marker.id}
                                    className={`flex items-center gap-2 p-2 rounded text-sm ${
                                      isAuto
                                        ? 'bg-orange-50 border border-orange-200'
                                        : 'bg-yellow-50 border border-yellow-200'
                                    }`}
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        isAuto ? 'bg-orange-400' : 'bg-yellow-400'
                                      }`}
                                    />
                                    <span className="text-gray-700">
                                      {marker.note || '标记位置'}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                      页面 {marker.page}
                                    </span>
                                    {isAuto && (
                                      <span className="text-xs px-1.5 py-0.5 bg-orange-200 text-orange-700 rounded ml-auto">
                                        自动
                                      </span>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

