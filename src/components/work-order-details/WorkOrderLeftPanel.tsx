import React, { useState } from 'react'
import { OrderDetailsTabs } from './OrderDetailsTab'
import PhotosTab from './tabs/PhotosTab'
import PhotoViewerModal from './PhotoViewerModal'
import WorkItemsTab from './tabs/WorkItemsTab'
import type { PhotoData } from './tabs/PhotosTab'

function WorkOrderLeftPanel() {
  // State for photo viewer modal
  const [photoViewerData, setPhotoViewerData] = useState<{
    photos: PhotoData[] | null
    startIndex: number
  }>({
    photos: null,
    startIndex: 0
  })

  // Handle photo click from PhotosTab
  const handlePhotoClick = (data: { photos: PhotoData[]; startIndex: number }) => {
    setPhotoViewerData({
      photos: data.photos,
      startIndex: data.startIndex
    })
  }

  // Close photo viewer
  const handleClosePhotoViewer = () => {
    setPhotoViewerData({
      photos: null,
      startIndex: 0
    })
  }

  return (
    <div>
      <OrderDetailsTabs
        photosCount={8}
        itemCount={3}
        pagesCount={0}
        filesCount={3}
        paymentsCount={2}

        PhotosComponent={<PhotosTab onPhotoClick={handlePhotoClick} />}
        ItemsComponent={<WorkItemsTab />}
        PagesComponent={"page"}
        FilesComponent={"file section"}
        PaymentsComponent={"Payment section"}
        ChecklistsComponent={"Checklist"}
        ReportsComponent={"report"}
      />

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        photos={photoViewerData.photos}
        startIndex={photoViewerData.startIndex}
        onClose={handleClosePhotoViewer}
      />
    </div>
  )
}

export default WorkOrderLeftPanel