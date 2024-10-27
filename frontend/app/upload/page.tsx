"use client";
import { useState } from "react";
import { Upload, PlayCircle, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function UploadPage() {
  // const [file, setFile] = useState(null);
  // const [isUploading, setIsUploading] = useState(false);
  // const [progress, setProgress] = useState(0);
  // const [error, setError] = useState("");
  // const [processedVideoUrl, setProcessedVideoUrl] = useState("");
  // const [isProcessing, setIsProcessing] = useState(false);
  // const [title, setTitle] = useState("");
  // const [category, setCategory] = useState("");
  // const [language, setLanguage] = useState("");
  // const [thumbnail, setThumbnail] = useState(null);
  // const router = useRouter();
  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (
  //     selectedFile &&
  //     (selectedFile.type === "video/mp4" ||
  //       selectedFile.type === "video/quicktime")
  //   ) {
  //     setFile(selectedFile);
  //     setError("");
  //   } else {
  //     setError("対応している動画形式は MP4 または MOV のみです");
  //     setFile(null);
  //   }
  // };
  // const handleThumbnailChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile && selectedFile.type.startsWith("image/")) {
  //     setThumbnail(selectedFile);
  //     setError("");
  //   } else {
  //     setError("サムネイル画像は画像ファイルである必要があります");
  //     setThumbnail(null);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!file) return;

  //   setIsUploading(true);
  //   setIsProcessing(true);
  //   setError("");

  //   const formData = new FormData();
  //   formData.append("video", file);

  //   try {
  //     // Flask エンドポイントへの送信
  //     const flaskResponse = await fetch("http://127.0.0.1:5000/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const flaskData = await flaskResponse.json();

  //     if (flaskResponse.ok) {
  //       setProcessedVideoUrl(
  //         `http://127.0.0.1:5000/download/${flaskData.output_path
  //           .split("/")
  //           .pop()}`
  //       );

  //       // PHP エンドポイントへの送信
  //       const phpFormData = new FormData();
  //       phpFormData.append("video", file);
  //       phpFormData.append("title", title);
  //       phpFormData.append("category", category);
  //       phpFormData.append("language", language);
  //       if (thumbnail) {
  //         phpFormData.append("thumbnail", thumbnail);
  //       }

  //       const phpResponse = await fetch(
  //         "https://devesion.main.jp/jphacks/api/main.php",
  //         {
  //           method: "POST",
  //           body: phpFormData,
  //         }
  //       );

  //       const phpData = await phpResponse.json();

  //       if (!phpResponse.ok) {
  //         throw new Error(phpData.error || "PHPサーバーでエラーが発生しました");
  //       }
  //     } else {
  //       throw new Error(
  //         flaskData.error || "Flaskサーバーでエラーが発生しました"
  //       );
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setIsUploading(false);
  //     setIsProcessing(false);
  //   }
  // };

  // const handleTop = () => {
  //   router.push("/");
  // };

  // const handleReset = () => {
  //   setFile(null);
  //   setProcessedVideoUrl("");
  //   setError("");
  //   setProgress(0);
  // };
  // return (
  //   <div className="min-h-screen bg-background">
  //     <Header />
  //     <div className="max-w-3xl mx-auto py-8 px-4 lg:px-0 mt-12">
  //       <div className="bg-white rounded-lg shadow-lg p-6">
  //         <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
  //           動画をアップロード
  //         </h1>

  //         {!processedVideoUrl ? (
  //           <form onSubmit={handleSubmit} className="space-y-6">
  //             <div className="space-y-4">
  //               <label className="block text-sm font-medium text-gray-700">
  //                 動画ファイルを選択
  //               </label>
  //               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
  //                 <div className="space-y-1 text-center">
  //                   <svg
  //                     className="mx-auto h-12 w-12 text-gray-400"
  //                     stroke="currentColor"
  //                     fill="none"
  //                     viewBox="0 0 48 48"
  //                     aria-hidden="true"
  //                   >
  //                     <path
  //                       d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
  //                       strokeWidth={2}
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     />
  //                   </svg>
  //                   <div className="flex text-sm text-gray-600">
  //                     <label
  //                       htmlFor="file-upload"
  //                       className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
  //                     >
  //                       <span>動画ファイルをアップロード</span>
  //                       <input
  //                         id="file-upload"
  //                         name="file-upload"
  //                         type="file"
  //                         className="sr-only"
  //                         onChange={handleFileChange}
  //                         accept="video/mp4,video/quicktime"
  //                       />
  //                     </label>
  //                     <p className="pl-1">またはドラッグ＆ドロップ</p>
  //                   </div>
  //                   <p className="text-xs text-gray-500">MP4またはMOV形式</p>
  //                 </div>
  //               </div>
  //               {file && (
  //                 <p className="mt-2 text-sm text-gray-500">
  //                   選択されたファイル: {file.name}
  //                 </p>
  //               )}
  //             </div>

  //             <div className="space-y-4">
  //               <input
  //                 type="text"
  //                 placeholder="タイトル"
  //                 value={title}
  //                 onChange={(e) => setTitle(e.target.value)}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
  //               />
  //               <input
  //                 type="text"
  //                 placeholder="カテゴリ"
  //                 value={category}
  //                 onChange={(e) => setCategory(e.target.value)}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
  //               />
  //               <input
  //                 type="text"
  //                 placeholder="言語"
  //                 value={language}
  //                 onChange={(e) => setLanguage(e.target.value)}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
  //               />
  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700">
  //                   サムネイル画像
  //                 </label>
  //                 <input
  //                   type="file"
  //                   onChange={handleThumbnailChange}
  //                   accept="image/*"
  //                   className="mt-1"
  //                   required
  //                 />
  //               </div>
  //             </div>

  //             {error && (
  //               <div className="rounded-md bg-red-50 p-4">
  //                 <div className="flex">
  //                   <div className="ml-3">
  //                     <h3 className="text-sm font-medium text-red-800">
  //                       エラーが発生しました
  //                     </h3>
  //                     <div className="mt-2 text-sm text-red-700">
  //                       <p>{error}</p>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             )}

  //             <button
  //               type="submit"
  //               disabled={!file || isUploading}
  //               className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
  //                 !file || isUploading
  //                   ? "bg-gray-400 cursor-not-allowed"
  //                   : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  //               }`}
  //             >
  //               {isUploading ? (
  //                 <div className="flex items-center">
  //                   <RefreshCcw className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
  //                   処理中...
  //                 </div>
  //               ) : (
  //                 "変換を開始"
  //               )}
  //             </button>
  //           </form>
  //         ) : (
  //           <div className="space-y-6">
  //             <div className="aspect-w-16 aspect-h-9">
  //               <video
  //                 className="rounded-lg w-full"
  //                 controls
  //                 src={processedVideoUrl}
  //               >
  //                 お使いのブラウザは動画の再生に対応していません。
  //               </video>
  //             </div>

  //             <div className="flex space-x-4">
  //               <a
  //                 href={processedVideoUrl}
  //                 download
  //                 className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
  //               >
  //                 <PlayCircle className="-ml-1 mr-2 h-5 w-5" />
  //                 ダウンロード
  //               </a>
  //               <button
  //                 onClick={handleTop}
  //                 className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  //               >
  //                 <RefreshCcw className="-ml-1 mr-2 h-5 w-5" />
  //                 トップへ
  //               </button>
  //             </div>
  //           </div>
  //         )}

  //         {isProcessing && (
  //           <div className="mt-6">
  //             <div className="relative pt-1">
  //               <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
  //                 <div
  //                   className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
  //                   style={{ width: `${progress}%` }}
  //                 ></div>
  //               </div>
  //               <div className="text-center text-sm text-gray-600">
  //                 音声を処理中...
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div></div>
  );
}
