import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Initialize Web Audio API Om Chant Synthesizer
  const startOmChantSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      
      // Multi-frequency harmonic Om drone (136.1 Hz is traditional Om pitch)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(136.1, ctx.currentTime); // C#3 Om frequency
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(272.2, ctx.currentTime); // 2nd Harmonic

      gain.gain.setValueAtTime(isMuted ? 0 : 0.15, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      oscRef.current = { osc1, osc2 };
      gainNodeRef.current = gain;
      setIsPlaying(true);
    } catch (e) {
      console.log('Audio init notice:', e);
    }
  };

  const stopOmChantSound = () => {
    if (oscRef.current) {
      try {
        oscRef.current.osc1.stop();
        oscRef.current.osc2.stop();
      } catch (e) {}
      oscRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopOmChantSound();
    } else {
      startOmChantSound();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(!isMuted ? 0 : 0.15, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopOmChantSound();
    };
  }, []);

  return (
    <div className="audio-player-widget" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(74, 14, 23, 0.95)',
      border: '1.5px solid #D4AF37',
      borderRadius: '25px',
      padding: '4px 14px',
      color: '#F3E5AB',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    }}>
      <Music size={15} style={{ color: '#D4AF37' }} />
      <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Cinzel, serif', letterSpacing: '0.5px' }}>
        Om Chanting
      </span>

      <button
        onClick={togglePlay}
        title={isPlaying ? "Pause Om Chanting" : "Play Om Chanting"}
        style={{
          background: 'var(--gold-primary)',
          color: '#380910',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
      </button>

      {isPlaying && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px', padding: '0 2px' }}>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
          <div className="soundwave-bar"></div>
        </div>
      )}

      <button
        onClick={toggleMute}
        title={isMuted ? "Unmute" : "Mute"}
        style={{ background: 'transparent', border: 'none', color: '#D4AF37', cursor: 'pointer', display: 'flex' }}
      >
        {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </div>
  );
};

export default AudioPlayer;
