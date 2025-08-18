'use client';
import { FaMusic, FaChevronUp, FaChevronDown } from "react-icons/fa";
import React, { useRef, useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { FaPlay, FaPause, FaForward, FaBackward, FaRandom, FaRedo, FaVolumeUp, FaVolumeMute, FaVolumeDown } from 'react-icons/fa';
import { motion } from "framer-motion";
// Hapus import FaChevronLeft/FaChevronRight jika tak dipakai lagi (opsional)
import { FaChevronRight } from "react-icons/fa";

type Song = {
    title: string;
    artist: string;
    youtubeId: string;
    skipSegments?: Array<[number, number]>;
};

const playlist: Song[] = [
    { title: 'The Four Seasons, Spring in E Major, RV.269: I.Allegro', artist: '', youtubeId: 'RRhg0IGFTYQ', skipSegments: [] },
    { title: '5 Years Time', artist: 'Noah and The Whale', youtubeId: 'Ap9SbbGkncg', skipSegments: [] },
    { title: 'Houdini', artist: 'Eminem', youtubeId: 'fTMEMPA7eeA', skipSegments: [] },
];

function formatTime(sec: number) {
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

const MusicPlayer: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [repeat, setRepeat] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(80);
    const [showPanel, setShowPanel] = useState(true);

    const playerRef = useRef<any>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const PlaylistButton = (
        <button
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full shadow font-bold text-xs tracking-wide
                border transition-all
                ${showPlaylist
                    ? 'bg-gradient-to-r from-[#4267b2] to-[#e71d36] text-white border-white scale-105'
                    : 'bg-white/20 text-blue-300 border-transparent hover:bg-white/30 hover:text-blue-400'}`}
            onClick={() => setShowPlaylist(!showPlaylist)}
            style={{ minWidth: 120, margin: '0 auto' }}
        >
            <FaMusic className="text-base" />
            <span>{showPlaylist ? "Tutup Playlist" : "Tampilkan Playlist"}</span>
            <span
                className="inline-block bg-white/60 text-blue-800 rounded-full px-2 py-0.5 ml-1 font-mono text-xs font-bold"
                style={{ minWidth: 24, textAlign: "center" }}
            >{playlist.length}</span>
            {showPlaylist ? <FaChevronDown className="ml-1" /> : <FaChevronUp className="ml-1" />}
        </button>
    );

    // === Progress & Skip Segment ===
    useEffect(() => {
        if (isPlaying && playerRef.current) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(async () => {
                const player = playerRef.current;
                if (!player || typeof player.getCurrentTime !== 'function') return;
                const time = await player.getCurrentTime();
                const dur = await player.getDuration();
                setCurrentTime(time);
                setDuration(dur);
                setProgress((time / dur) * 100 || 0);

                const segments = playlist[currentIndex].skipSegments || [];
                for (const [start, end] of segments) {
                    if (time >= start && time < end) {
                        if (typeof player.seekTo === 'function') player.seekTo(end, true);
                        break;
                    }
                }
            }, 500);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isPlaying, currentIndex]);


    const handlePlayPause = () => {
        if (!playerRef.current) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
            setIsPlaying(false);
        } else {
            playerRef.current.playVideo();
            setIsPlaying(true);
        }
    };

    const handleSelect = (index: number) => {
        setCurrentIndex(index);
        setProgress(0);
        setCurrentTime(0);
        setTimeout(() => {
            if (playerRef.current) {
                playerRef.current.playVideo();
                playerRef.current.setVolume(volume);
            }
            setIsPlaying(true);
        }, 300);
    };

    const handleNext = () => {
        setCurrentIndex(prev => shuffle ? Math.floor(Math.random() * playlist.length) : (prev + 1) % playlist.length);
        setProgress(0);
        setCurrentTime(0);
        setTimeout(() => {
            if (playerRef.current) {
                playerRef.current.playVideo();
                playerRef.current.setVolume(volume);
            }
            setIsPlaying(true);
        }, 300);
    };

    const handlePrevious = () => {
        setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length);
        setProgress(0);
        setCurrentTime(0);
        setTimeout(() => {
            if (playerRef.current) {
                playerRef.current.playVideo();
                playerRef.current.setVolume(volume);
            }
            setIsPlaying(true);
        }, 300);
    };

    const handleEnded = () => {
        if (repeat && playerRef.current && typeof playerRef.current.seekTo === 'function') {
            playerRef.current.seekTo(0, true);
            setProgress(0);
            setCurrentTime(0);
            setIsPlaying(true);
        } else {
            handleNext();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const percent = parseFloat(e.target.value);
        if (duration && playerRef.current && typeof playerRef.current.seekTo === 'function') {
            const newTime = (percent / 100) * duration;
            playerRef.current.seekTo(newTime, true);
            setProgress(percent);
            setCurrentTime(newTime);
        }
    };

    // === Volume Handler ===
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseInt(e.target.value);
        setVolume(vol);
        if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
            playerRef.current.setVolume(vol);
        }
    };

    const onReady: YouTubeProps['onReady'] = async (event) => {
        playerRef.current = event.target;
        event.target.setVolume(volume);
        const dur = await event.target.getDuration();
        setDuration(dur);
        event.target.playVideo();
    };

    const onStateChange: YouTubeProps['onStateChange'] = (event) => {
        if (event.data === 1) setIsPlaying(true);
        if (event.data === 2) setIsPlaying(false);
        if (event.data === 0) handleEnded();
    };

    const currentSong = playlist[currentIndex];

    let volumeIcon = <FaVolumeUp />;
    if (volume === 0) volumeIcon = <FaVolumeMute />;
    else if (volume <= 40) volumeIcon = <FaVolumeDown />;

    const panelOffset = 24;

    // === SATU TOMBOL SAJA (FAB) ===
    const ToggleOpenCloseButton = (
        <button
            className="absolute bottom-4 right-4 z-[60] rounded-full p-3 shadow-lg bg-gradient-to-br from-[#4267b2] to-[#e71d36] text-white hover:scale-105 transition"
            onClick={() => setShowPanel(prev => !prev)}
            aria-label={showPanel ? "Tutup music player" : "Buka music player"}
            title={showPanel ? "Tutup music player" : "Buka music player"}
        >
            {showPanel ? <FaChevronRight size={18} /> : <FaMusic size={18} />}
        </button>
    );

    return (
        <>
            {/* Satu tombol global untuk buka/tutup */}
            {ToggleOpenCloseButton}

            {/* PANEL PLAYER (slide tetap ada; handle & tombol close dihapus) */}
            <motion.div
                className={`
                    absolute bottom-4 right-0 z-50
                    w-11/12 max-w-xs md:max-w-md
                    md:bottom-10
                    p-0 md:p-0
                    rounded-2xl shadow-lg
                    border border-white/10
                    bg-[rgba(30,16,32,0.97)]
                    flex flex-col
                    transition-all
                `}
                style={{
                    boxShadow: "0 2px 24px #000c",
                    // sisakan "sliver" saat tertutup supaya bisa di-drag buka
                    right: showPanel ? 0 : `-${panelOffset - 4}px`,
                    cursor: 'grab'
                }}
                animate={{ x: showPanel ? 0 : `calc(100% - ${panelOffset}px)` }}
                initial={{ x: "100%" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(e, info) => {
                    // geser kanan untuk menutup
                    if (showPanel && info.offset.x > 80) setShowPanel(false);
                    // geser kiri saat tertutup untuk membuka
                    if (!showPanel && info.offset.x < -40) setShowPanel(true);
                }}
            >
                {/* --- Music Player Content --- */}
                <div className="p-4">
                    <div
                        className="
      w-full max-w-xs md:max-w-md mx-auto
      relative               /* ⬅️ untuk waveform absolut */
      px-4 pb-4 pt-1         /* ⬅️ p-4 → px-4 pb-4 pt-1 (top lebih tipis) */
      rounded-2xl shadow-lg
    "
                        style={{
                            background: 'rgba(30, 16, 32, 0.97)',
                            backdropFilter: 'blur(2px)',
                            color: '#fff',
                            border: '1px solid rgba(200,200,200,0.09)'
                        }}
                    >
                        {/* waveform dijadikan overlay agar tidak menambah tinggi */}
                        <div className="absolute inset-x-0 top-0 h-5 bg-repeat-x bg-[url('/waveform.svg')] bg-contain opacity-60 pointer-events-none" />

                        <h2 className="text-lg font-bold !text-red-500 leading-tight mt-2">
                            My Fav Song:
                        </h2>
                        {/* judul — tanpa margin-top bawaan, rapat ke atas */}
                        <h3 className="text-lg font-bold text-white leading-tight mt-2 mb-2">
                            {currentSong.title}
                        </h3>

                        <YouTube
                            videoId={currentSong.youtubeId}
                            opts={{ height: '0', width: '0', playerVars: { autoplay: 0 } }}
                            onReady={onReady}
                            onStateChange={onStateChange}
                        />


                        {/* Progress + Time */}
                        <div className="flex items-center justify-between px-1 mb-1">
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: 1, minWidth: 38 }}>
                                {formatTime(currentTime)}
                            </span>
                            <input
                                type="range"
                                className="flex-1 mx-2 accent-rose-500"
                                min={0}
                                max={100}
                                value={progress}
                                onChange={handleSeek}
                                style={{
                                    background: 'linear-gradient(90deg, #e71d36 0%, #4267b2 100%)',
                                    height: 4,
                                    borderRadius: 8,
                                    outline: 'none',
                                }}
                            />
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: 1, minWidth: 38 }}>
                                {formatTime(duration)}
                            </span>
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-2 mb-2 mt-0.5 px-2">
                            {volumeIcon}
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="accent-rose-500 flex-1 cursor-pointer"
                                style={{
                                    width: 100,
                                    height: 8,
                                    borderRadius: 8,
                                    background: 'linear-gradient(90deg,#fff 0%,#e71d36 80%)',
                                    appearance: 'none',
                                }}
                            />
                            <span style={{ fontFamily: 'monospace', fontSize: 13, width: 32, textAlign: 'right' }}>{volume}%</span>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center items-center gap-5 mt-1 mb-2">
                            <button
                                onClick={() => setShuffle(!shuffle)}
                                title="Shuffle"
                                className={`rounded-full p-2 transition ${shuffle ? 'bg-[#4267b2]/70 scale-110 shadow' : 'hover:bg-white/20'}`}
                            >
                                <FaRandom className={shuffle ? 'text-white' : 'text-gray-300'} />
                            </button>
                            <button onClick={handlePrevious} title="Previous" className="rounded-full p-2 hover:bg-white/20 transition">
                                <FaBackward />
                            </button>
                            <button
                                className="bg-white/90 text-rose-700 p-3 rounded-full border-2 border-white shadow-lg hover:scale-105 focus:outline-none"
                                onClick={handlePlayPause}
                                title="Play/Pause"
                                style={{ fontSize: 32 }}
                            >
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            <button onClick={handleNext} title="Next" className="rounded-full p-2 hover:bg-white/20 transition">
                                <FaForward />
                            </button>
                            <button
                                onClick={() => setRepeat(!repeat)}
                                title="Repeat"
                                className={`rounded-full p-2 transition ${repeat ? 'bg-[#e71d36]/80 scale-110 shadow' : 'hover:bg-white/20'}`}
                            >
                                <FaRedo className={repeat ? 'text-white' : 'text-gray-300'} />
                            </button>
                        </div>

                        <div className="w-full flex justify-center mt-1 mb-1.5">
                            {PlaylistButton}
                        </div>

                        {/* Playlist panel */}
                        <div
                            className={`
                                fixed md:static left-0 bottom-0 w-full md:w-auto
                                z-40 transition-all duration-500 ease-in-out
                                bg-[#1e1020] md:bg-transparent 
                                shadow-2xl md:shadow-none
                                rounded-t-2xl md:rounded-2xl
                                border-t border-white/10 md:border-none
                                overflow-hidden
                                ${showPlaylist ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'}
                            `}
                            style={{
                                margin: showPlaylist ? "0 auto" : "",
                                boxShadow: showPlaylist ? "0 -2px 32px 0 #e71d36cc" : "",
                                padding: showPlaylist ? "20px 0 0" : "0",
                            }}
                        >
                            <h3 className="font-bold mb-2 text-base text-white/80 text-center">Playlist</h3>
                            <ul className="space-y-1 px-4 pb-4">
                                {playlist.map((song, index) => (
                                    <li
                                        key={index}
                                        className={`
                                            cursor-pointer flex items-center gap-2 px-2 py-2 rounded-xl
                                            transition
                                            ${index === currentIndex
                                                ? 'bg-gradient-to-r from-[#e71d36]/80 to-[#4267b2]/90 text-white font-bold shadow'
                                                : 'hover:bg-white/10 text-gray-200 font-semibold'}
                                        `}
                                        onClick={() => handleSelect(index)}
                                    >
                                        <span className="text-rose-400">🎵</span> {song.title}
                                        <span className="ml-auto text-xs text-blue-200 italic">{song.artist}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default MusicPlayer;
