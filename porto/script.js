// MUSIC PLAYER FOR PORTFOLIO
class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.volume = 0.5; // Volume 50%
        this.currentSong = '';
        
        this.init();
    }
    
    init() {
        // Set default volume
        this.audio.volume = this.volume;
        
        // Auto loop
        this.audio.loop = true;
        
        // Event listeners
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updateUI();
        });
        
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateUI();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateUI();
        });
        
        // Create player UI
        this.createPlayerUI();
    }
    
    createPlayerUI() {
        // Create player container
        const player = document.createElement('div');
        player.id = 'music-player';
        player.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 9999;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            min-width: 250px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        `;
        
        player.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-music" style="color: #4cc9f0;"></i>
                    <h3 style="margin: 0; font-size: 16px;">Background Music</h3>
                </div>
                <button id="close-music" style="background: none; border: none; color: white; cursor: pointer; font-size: 14px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div id="song-info" style="margin-bottom: 15px; font-size: 13px; color: #aaa;">
                <div>Now Playing: <span id="current-song">-</span></div>
                <div style="font-size: 11px; margin-top: 5px;" id="song-status">Paused</div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <button id="play-pause" style="
                    background: #4cc9f0;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-play"></i>
                </button>
                
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
                        <span id="current-time">0:00</span>
                        <span id="duration">0:00</span>
                    </div>
                    <input type="range" id="progress" min="0" max="100" value="0" style="width: 100%;">
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-volume-down" style="color: #aaa;"></i>
                <input type="range" id="volume-slider" min="0" max="100" value="50" style="flex: 1;">
                <i class="fas fa-volume-up" style="color: #aaa;"></i>
            </div>
            
            <div style="margin-top: 15px; font-size: 11px; color: #888; text-align: center;">
                <i class="fas fa-info-circle"></i> Music will auto-play & loop
            </div>
        `;
        
        document.body.appendChild(player);
        
        // Add Font Awesome if not exists
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(faLink);
        }
        
        // Bind events
        this.bindEvents();
        
        // Auto start after 2 seconds
        setTimeout(() => {
            this.autoStart();
        }, 2000);
    }
    
    bindEvents() {
        // Play/Pause button
        document.getElementById('play-pause').addEventListener('click', () => {
            this.togglePlay();
        });
        
        // Volume slider
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // Progress bar
        document.getElementById('progress').addEventListener('input', (e) => {
            const time = (e.target.value / 100) * this.audio.duration;
            this.audio.currentTime = time;
        });
        
        // Close button
        document.getElementById('close-music').addEventListener('click', () => {
            document.getElementById('music-player').style.display = 'none';
        });
        
        // Update time
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
    }
    
    // Load song from URL
    loadSong(url, songName = 'Background Music') {
        this.audio.src = url;
        this.currentSong = songName;
        document.getElementById('current-song').textContent = songName;
        
        // When metadata is loaded
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });
    }
    
    // Toggle play/pause
    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play().catch(e => {
                console.log("Autoplay blocked:", e);
                // Show play button to user
                document.getElementById('song-status').textContent = "Click play to start music";
            });
        }
    }
    
    // Auto start (with user interaction requirement)
    autoStart() {
        // Try to play (might be blocked by browser)
        this.audio.play().then(() => {
            console.log("Music auto-started successfully");
        }).catch(error => {
            console.log("Auto-play blocked, waiting for user interaction");
            document.getElementById('song-status').textContent = "Click play button to start";
            
            // Start on any user interaction
            const startOnInteraction = () => {
                if (!this.isPlaying) {
                    this.audio.play();
                    document.removeEventListener('click', startOnInteraction);
                    document.removeEventListener('keydown', startOnInteraction);
                    document.removeEventListener('scroll', startOnInteraction);
                }
            };
            
            document.addEventListener('click', startOnInteraction);
            document.addEventListener('keydown', startOnInteraction);
            document.addEventListener('scroll', startOnInteraction);
        });
    }
    
    // Set volume
    setVolume(vol) {
        this.volume = vol;
        this.audio.volume = vol;
    }
    
    // Update UI
    updateUI() {
        const playPauseBtn = document.getElementById('play-pause');
        const status = document.getElementById('song-status');
        
        if (this.isPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            status.textContent = "Playing";
            status.style.color = "#4cc9f0";
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            status.textContent = "Paused";
            status.style.color = "#aaa";
        }
    }
    
    // Update progress bar
    updateProgress() {
        const progress = document.getElementById('progress');
        const currentTime = document.getElementById('current-time');
        
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            progress.value = percent;
            
            // Format time
            const minutes = Math.floor(this.audio.currentTime / 60);
            const seconds = Math.floor(this.audio.currentTime % 60);
            currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Update duration display
    updateDuration() {
        const durationEl = document.getElementById('duration');
        if (this.audio.duration) {
            const minutes = Math.floor(this.audio.duration / 60);
            const seconds = Math.floor(this.audio.duration % 60);
            durationEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// Initialize music player when page loads
window.addEventListener('DOMContentLoaded', () => {
    const musicPlayer = new MusicPlayer();
    
    // LOAD YOUR MUSIC HERE
    // Ganti URL dengan link lagu BGM lo
    const bgmUrl = 'https://ditzabcd.github.io/all/bukanaku.mp3'; // Contoh lagu
    
    musicPlayer.loadSong(bgmUrl, 'Background Music - Portfolio');
    
    // Make it accessible globally
    window.musicPlayer = musicPlayer;
});