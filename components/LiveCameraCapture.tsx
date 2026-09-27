"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import CameraAltRounded from "@mui/icons-material/CameraAltRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import VideocamRounded from "@mui/icons-material/VideocamRounded";

type Props = {
  title: string;
  description: string;
  mode: "photo" | "video";
  facingMode: "user" | "environment";
  completed: boolean;
  onCapture: (blob: Blob) => void;
};

export default function LiveCameraCapture({ title, description, mode, facingMode, completed, onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    setError("");
    setLoading(true);
    setOpen(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("secure-context");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: mode === "video",
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (reason) {
      const name = reason instanceof DOMException ? reason.name : "";
      setError(name === "NotAllowedError" ? "اجازه دسترسی به دوربین داده نشد. دسترسی Camera را در تنظیمات مرورگر فعال کنید." : "دوربین فقط در اتصال امن HTTPS یا localhost قابل استفاده است و باید روی گوشی در دسترس مرورگر باشد.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      onCapture(blob);
      stopCamera();
      setOpen(false);
    }, "image/jpeg", .9);
  };

  const startRecording = () => {
    if (!streamRef.current || typeof MediaRecorder === "undefined") return setError("ضبط ویدئو در این مرورگر پشتیبانی نمی‌شود.");
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => {
      onCapture(new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" }));
      stopCamera();
      setOpen(false);
      setRecording(false);
    };
    recorder.start();
    setRecording(true);
  };

  const close = () => {
    if (recording) recorderRef.current?.stop();
    else { stopCamera(); setOpen(false); }
  };

  return <Box sx={{ border: "1px solid", borderColor: completed ? "success.light" : "divider", borderRadius: 3, p: 1.5 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
      <Box><Typography fontWeight={850}>{title}</Typography><Typography variant="caption" color="text.secondary">{description}</Typography></Box>
      {completed && <Chip size="small" color="success" icon={<CheckCircleRounded />} label="ثبت شد" />}
    </Stack>
    {!open ? <Button fullWidth variant={completed ? "text" : "outlined"} startIcon={mode === "photo" ? <CameraAltRounded /> : <VideocamRounded />} sx={{ mt: 1.25 }} onClick={startCamera}>{completed ? "ثبت مجدد با دوربین" : "باز کردن دوربین"}</Button> : <Stack spacing={1.25} sx={{ mt: 1.5 }}>
      <Box sx={{ position: "relative", bgcolor: "#07111f", borderRadius: 2.5, overflow: "hidden", aspectRatio: mode === "photo" && facingMode === "environment" ? "1.58" : "3/4", display: "grid", placeItems: "center" }}>
        {loading && <CircularProgress sx={{ position: "absolute" }} />}
        <Box component="video" ref={videoRef} muted playsInline sx={{ width: "100%", height: "100%", objectFit: "cover", transform: facingMode === "user" ? "scaleX(-1)" : "none" }} />
        {mode === "video" && recording && <Chip label="در حال ضبط زنده" color="error" size="small" sx={{ position: "absolute", top: 10, right: 10 }} />}
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {!error && (mode === "photo" ? <Button variant="contained" onClick={takePhoto}>ثبت همین تصویر</Button> : !recording ? <Button color="error" variant="contained" onClick={startRecording}>شروع ضبط ویدئوی زنده</Button> : <Button color="error" variant="outlined" onClick={() => recorderRef.current?.stop()}>پایان و ثبت ویدئو</Button>)}
      <Button color="inherit" onClick={close}>انصراف</Button>
    </Stack>}
  </Box>;
}
