"use client";
import { uploadToSupabase } from "@/lib/supabase-storage-utils";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useTransition,
} from "react";
import camera from "@/assets/images/camera.png";
import Image from "next/image";
import folder from "@/assets/images/folder.png";
import video from "@/assets/images/video (2).png";
import gallery from "@/assets/images/photo.png";
import {
  compressImage,
  createFilePreview,
  generateSupabaseFilePath,
  snapImage,
} from "@/lib/image-utils";
import { toast } from "@/hooks/use-toast";
import Webcam from "react-webcam";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Delete from "@/assets/images/delete.png";
import { useUser } from "@/lib/store/user";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/lib/types";
import { useRouter } from "next/navigation";

const CreatePost = () => {
  const { user } = useUser();
  const [text, setText] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const MAX_MEDIA_LIMIT = 3;
  const MAX_VIDEO_SIZE_MB = 10;
  const router = useRouter();
  const supabase = createClient();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const totalMedia =
      imageFiles.length + (videoFile ? 1 : 0) + selectedFiles.length;
    if (totalMedia > MAX_MEDIA_LIMIT) {
      toast({
        variant: "destructive",
        description: `Media limit exceeded! You can only upload ${MAX_MEDIA_LIMIT} items.`,
      });
      return;
    }

    const filePreviews: string[] = [];
    const selectedFileArray = Array.from(selectedFiles);

    for (const file of selectedFileArray) {
      let previewUrl = createFilePreview(file);

      if (file.type.startsWith("image/")) {
        const compressedFile = await compressImage(file, false);
        if (compressedFile) {
          previewUrl = createFilePreview(compressedFile);
        }
      }

      filePreviews.push(previewUrl);
    }

    setImageFiles((prevFiles) => [...prevFiles, ...selectedFileArray]);
    setPreviews((prevPreviews) => [...filePreviews, ...prevPreviews]);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length > 1) return;

    const file = selectedFiles[0];

    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      toast({
        variant: "destructive",
        description: `Video size exceeds ${MAX_VIDEO_SIZE_MB} MB.`,
      });
      return;
    }

    const totalMedia = imageFiles.length + (videoFile ? 1 : 0) + 1; // +1 for the new video
    if (totalMedia > MAX_MEDIA_LIMIT) {
      toast({
        variant: "destructive",
        description: `Media limit exceeded! You can only upload ${MAX_MEDIA_LIMIT} items.`,
      });
      return;
    }

    // const previewUrl = createFilePreview(file);
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    // Snapshot function to generate an image from the video
    const generateThumbnail = () => {
      const thumbnail = snapImage(video);
      if (thumbnail) {
        setPreviews((prevPreviews) => [thumbnail, ...prevPreviews]); // Set thumbnail preview
      }
    };

    // Wait for the video metadata to load before generating the thumbnail
    video.addEventListener("loadeddata", () => {
      generateThumbnail();
    });

    // Set up video element
    video.preload = "metadata";
    video.src = url;
    // video.muted = true;
    video.playsInline = true;
    video.play();

    // Set video file for upload
    setVideoFile(file);
  };

  const handleDelete = (index: number) => {
    const deletedPreview = previews[index];

    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));

    if (deletedPreview === createFilePreview(videoFile)) {
      setVideoFile(null);
    } else {
      setImageFiles((prevImageFiles) =>
        prevImageFiles.filter((_, i) => i !== index)
      );
    }
  };

  // Handle capturing the photo from webcam
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to blob
        const byteString = atob(imageSrc.split(",")[1]);
        const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });

        // Create a File object from the blob
        const fileName = `capture_${Date.now()}.jpg`;
        const imageFile = new File([blob], fileName, { type: "image/jpeg" });

        setPreviews((prevPreviews) => [imageSrc, ...prevPreviews]);
        setImageFiles((prevFiles) => [...prevFiles, imageFile]); // Add to imageFiles for upload
        setIsCameraOpen(false);
      }
    }
  }, [webcamRef]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCount(api.scrollSnapList().length);
    });
  }, [api, setPreviews]);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    const user_id = user?.id;
    startTransition(async () => {
      try {
        // Validate content
        if (!text && imageFiles.length === 0 && !videoFile) {
          toast({
            variant: "destructive",
            description:
              "Please add some content to your post (text, images, or video)",
          });
          return;
        }

        // Initialize arrays for URLs
        let imageUrls: string[] = [];
        let videoUrl: string | null = null;

        // Upload images if any
        if (imageFiles.length > 0) {
          const imageUploadPromises = imageFiles.map(async (file) => {
            const path = generateSupabaseFilePath(user?.id!, "post");
            const compressedImage = await compressImage(file, false);
            if (!compressedImage) {
              toast({
                variant: "destructive",
                description: "Error compressing image",
              });
              return null;
            }
            return uploadToSupabase(supabase, compressedImage, path);
          });

          const urls = await Promise.all(imageUploadPromises);
          imageUrls = urls.filter((url): url is string => url !== null);

          if (imageUrls.length !== imageFiles.length) {
            toast({
              variant: "destructive",
              description: "Some images failed to upload",
            });
            return;
          }
        }

        // Upload video if present
        if (videoFile) {
          const videoPath = `posts/${user?.id}/videos/${Date.now()}_video.mp4`;
          videoUrl = await uploadToSupabase(supabase, videoFile, videoPath);

          if (!videoUrl) {
            toast({
              variant: "destructive",
              description: "Failed to upload video",
            });
            return;
          }
        }

        // Create post object
        const newPost: Partial<Post> = {
          user_id,
          text: text || null,
          image_urls: imageUrls,
          video_url: videoUrl,
          likes_count: 0,
          timestamp: new Date().toISOString(),
        };

        // Insert post into database
        const { error } = await supabase
          .from("posts")
          .insert([newPost])
          .select()
          .single();

        if (error) {
          toast({
            variant: "destructive",
            description: "Error creating post",
          });
          console.error("Error creating post:", error);
          return;
        }
        // Reset form
        setText("");
        setImageFiles([]);
        setVideoFile(null);
        setPreviews([]);

        router.push("/feed");
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        toast({
          variant: "destructive",
          description: "An unexpected error occurred",
        });
      }
    });
  };

  return (
    <div className="w-full p-3 flex flex-col justify-between  relative min-h-[90vh]">
      <div>
        <div className="flex gap-2 w-fit items-center">
          <Link href={`/profile/${user?.id}`}>
            <ArrowLeft className="text-black cursor-pointer" size={27} />
          </Link>
          <p className="font-extrabold font-karla text-xl tracking-wide text-black">
            New Post
          </p>
        </div>
        {previews.length > 0 && (
          <div className="mx-auto max-w-xs my-8">
            <Carousel setApi={setApi} className="w-full max-w-xs">
              <CarouselContent>
                {previews.map((preview, index) => (
                  <CarouselItem
                    key={index}
                    className="relative w-[280px] h-[280px]"
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      className="object-cover rounded-lg"
                      fill
                      priority
                    />
                    <button
                      onClick={() => handleDelete(index)}
                      className="absolute bottom-2 right-2 bg-transparent font-bold text-white p-1 w-[30px] h-[30px] flex items-center justify-center rounded-full"
                    >
                      <Image
                        src={Delete}
                        priority
                        sizes="24px"
                        width={30}
                        height={30}
                        className=""
                        alt="delete"
                      />
                    </button>
                    <div className="px-2 py-1 absolute top-2 right-2 rounded-full  bg-white">
                      <span className="text-sm text-black">
                        {current}/{count}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        )}

        {previews && previews.length > 0 && (
          <div className="flex flex-col w-full space-y-2">
            <label
              htmlFor="imageInput"
              className="cursor-pointer hidden sm:flex gap-2 items-center w-fit"
            >
              <Image
                src={folder}
                alt="folder"
                priority
                width={20}
                height={20}
                style={{ height: "20px", width: "auto" }}
                sizes="20px"
              />
              <span className="font-semibold text-[16px]">Choose the File</span>
            </label>

            {/* Hidden file inputs */}
            <input
              type="file"
              multiple
              ref={imageInputRef}
              onChange={handleImageFileChange}
              className="hidden"
              accept="image/*"
              id="imageInput"
            />
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoFileChange}
              className="hidden"
              accept=".mp4"
              id="videoInput"
            />

            {/* File type buttons */}
            <div className="flex flex-col gap-2">
              <label
                // htmlFor="imageInput"
                className="cursor-pointer flex items-center gap-2 w-fit"
                onClick={() => setIsCameraOpen(true)}
              >
                <Image
                  src={camera}
                  alt="camera"
                  priority
                  width={20}
                  height={20}
                  style={{ height: "20px", width: "auto" }}
                  sizes="20px"
                />
                <span className="font-semibold text-[16px]">Camera</span>
              </label>

              <label
                htmlFor="videoInput"
                className="cursor-pointer flex gap-2 items-center w-fit"
              >
                <Image
                  src={video}
                  alt="video"
                  priority
                  width={20}
                  height={20}
                  style={{ height: "20px", width: "auto" }}
                  sizes="20px"
                />
                <span className="font-semibold text-[16px]">Video</span>
              </label>

              <label
                htmlFor="imageInput"
                className="cursor-pointer flex items-center  gap-2 w-fit"
              >
                <Image
                  src={gallery}
                  alt="gallery"
                  priority
                  width={20}
                  height={20}
                  style={{ height: "20px", width: "auto" }}
                  sizes="20px"
                />
                <span className="font-semibold text-[16px]">Photos</span>
              </label>
            </div>
          </div>
        )}
        {/* Text Area for the post */}
        <div className="h-60 sm:h-48  w-full font-karla border-none my-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full outline-none p-3 rounded-md bg-[#D9D9D99C]"
            placeholder="What's on your mind?"
          ></textarea>
        </div>

        {/* File Upload Section */}
        {previews.length === 0 && (
          <div className="flex flex-col w-full space-y-2">
            <label
              htmlFor="imageInput"
              className="cursor-pointer hidden sm:flex gap-2 items-center w-fit"
            >
              <Image
                src={folder}
                alt="folder"
                priority
                width={20}
                height={20}
                style={{ height: "20px", width: "auto" }}
                sizes="20px"
              />
              <span className="font-semibold text-[16px]">Choose the File</span>
            </label>

            {/* Hidden file inputs */}
            <input
              type="file"
              multiple
              ref={imageInputRef}
              onChange={handleImageFileChange}
              className="hidden"
              accept="image/*"
              id="imageInput"
            />
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoFileChange}
              className="hidden"
              accept=".mp4"
              id="videoInput"
            />

            {/* File type buttons */}
            <div className="flex flex-col gap-2">
              <label
                // htmlFor="imageInput"
                className="cursor-pointer flex items-center gap-2 w-fit"
                onClick={() => setIsCameraOpen(true)}
              >
                <Image
                  src={camera}
                  alt="camera"
                  priority
                  width={20}
                  height={20}
                  style={{ height: "20px", width: "auto" }}
                  sizes="20px"
                />
                <span className="font-semibold text-[16px]">Camera</span>
              </label>

              <label
                htmlFor="videoInput"
                className="cursor-pointer flex gap-2 items-center w-fit"
              >
                <Image
                  src={video}
                  alt="video"
                  priority
                  width={20}
                  height={20}
                  style={{ height: "20px", width: "auto" }}
                  sizes="20px"
                />
                <span className="font-semibold text-[16px]">Video</span>
              </label>

              <label
                htmlFor="imageInput"
                className="cursor-pointer flex items-center  gap-2 w-fit"
              >
                <Image
                  src={gallery}
                  alt="gallery"
                  priority
                  width={20}
                  height={20}
                  style={{ height: "20px", width: "auto" }}
                  sizes="20px"
                />
                <span className="font-semibold text-[16px]">Photos</span>
              </label>
            </div>
          </div>
        )}

        {/* Camera view when it's open */}
        {isCameraOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black flex flex-col items-center justify-center z-50">
            <Button
              onClick={() => setIsCameraOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 bg-red-500 text-white p-2 rounded-full z-50"
            >
              ✕
            </Button>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              onClick={capturePhoto}
              className="absolute bottom-10 p-4 rounded-md text-white"
            >
              Capture Photo
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center mt-5 sm:mt-8">
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="mt-5 p-2 text-lg  w-[80%] rounded-full text-white"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
