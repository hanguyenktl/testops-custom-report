'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, Settings } from 'lucide-react';
import { DatasetPanel } from './components/dataset-panel';
import { ConfigurationPanel } from './components/configuration-panel';
import { PreviewPanel } from './components/preview-panel';
import { useChartBuilder } from '@/lib/stores/chart-builder';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { DroppedField } from '@/lib/types/dataset';

export default function ChartBuilder() {
  const router = useRouter();
  const { selectedDataset, resetConfiguration, addFieldToDropZone } = useChartBuilder();

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active.data.current) return;

    const draggedItem = active.data.current;
    const dropZone = over.data.current?.type;

    if (!dropZone || !selectedDataset) return;

    // Create dropped field based on dragged item
    let droppedField: DroppedField;

    if (draggedItem.type === 'metric' && dropZone === 'metrics') {
      droppedField = {
        id: `${dropZone}-${draggedItem.metric.id}`,
        name: draggedItem.metric.name,
        type: 'metric',
        datasetId: selectedDataset.id,
        originalField: draggedItem.metric,
        dropZone: 'metrics'
      };
      addFieldToDropZone(droppedField);
    } else if (draggedItem.type === 'dimension' && dropZone === 'dimensions') {
      droppedField = {
        id: `${dropZone}-${draggedItem.dimension.id}`,
        name: draggedItem.dimension.name,
        type: 'dimension',
        datasetId: selectedDataset.id,
        originalField: draggedItem.dimension,
        dropZone: 'dimensions'
      };
      addFieldToDropZone(droppedField);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Custom Chart Builder</h1>
                {selectedDataset && (
                  <p className="text-sm text-gray-600">
                    Working with {selectedDataset.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetConfiguration}>
              <Settings className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* 3-Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL: Dataset & Field Explorer */}
          <div className="w-80 border-r border-gray-200 bg-slate-50 overflow-y-auto">
            <DatasetPanel />
          </div>
          
          {/* CENTER PANEL: Configuration Area */}
          <div className="flex-1 overflow-y-auto">
            <ConfigurationPanel />
          </div>
          
          {/* RIGHT PANEL: Live Preview */}
          <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
            <PreviewPanel />
          </div>
        </div>
      </div>
    </DndContext>
  );
}