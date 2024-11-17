import React, { Suspense } from "react";
import VideoPageContent from "../../components/VideoPageContent"

export default function VideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPageContent />
    </Suspense>
  );
}
