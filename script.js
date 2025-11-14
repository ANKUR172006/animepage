
        // ==================== LOADER LOGIC WITH AUDIO ====================
        const startBtn = document.getElementById('startBtn');
        const loadingContainer = document.getElementById('loadingContainer');
        const loaderOverlay = document.getElementById('loader-overlay');
        const videoContainer = document.getElementById('videoContainer');
        const loadingVideoContainer = document.getElementById('loadingVideoContainer');
        const mainVideo = document.getElementById('mainVideo');
        const loadingVideo = document.getElementById('loadingVideo');
        const percentage = document.getElementById('percentage');
        const progressFill = document.getElementById('progressFill');
        const loadingAudio = document.getElementById('loadingAudio');

        // Try to play initial video
        mainVideo.play().catch(() => {
            console.log('Video autoplay prevented');
        });

        // Helper function: Fade out audio smoothly
        function fadeOutAudio(audio, duration) {
            if (!audio || audio.paused) return;
            
            const steps = 20;
            const stepDuration = duration / steps;
            const initialVolume = audio.volume;
            const volumeStep = initialVolume / steps;
            
            const fadeInterval = setInterval(() => {
                if (audio.volume > volumeStep) {
                    audio.volume = Math.max(0, audio.volume - volumeStep);
                } else {
                    audio.volume = 0;
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = initialVolume; // Reset for next time
                    clearInterval(fadeInterval);
                }
            }, stepDuration);
        }

        // Helper function: Show audio notification
        function showAudioNotice(message, duration = 3000) {
            const notice = document.createElement('div');
            notice.className = 'audio-notice';
            notice.textContent = message;
            document.body.appendChild(notice);
            
            setTimeout(() => {
                notice.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notice.remove(), 300);
            }, duration);
        }

        // START button click handler with audio (FIXED)
        startBtn.addEventListener('click', async () => {
            try {
                // Hide start button
                startBtn.classList.add('hidden');
                
                // Hide and pause first video
                videoContainer.classList.add('fade-out');
                mainVideo.pause();
                mainVideo.currentTime = 0;
                
                // Show loading video
                loadingVideoContainer.classList.add('active');
                
                try {
                    await loadingVideo.play();
                } catch (videoErr) {
                    console.warn('Loading video autoplay failed:', videoErr);
                }
                
                // FIXED AUDIO PLAYBACK - Multiple retry attempts
                if (loadingAudio) {
                    try {
                        loadingAudio.load(); // Force reload audio
                        loadingAudio.volume = 0.9;
                        
                        let audioStarted = false;
                        // Try 3 times with delays
                        for (let attempt = 0; attempt < 3; attempt++) {
                            try {
                                await loadingAudio.play();
                                audioStarted = true;
                                console.log('✓ Audio started successfully on attempt', attempt + 1);
                                break;
                            } catch (audioErr) {
                                console.warn(`Audio attempt ${attempt + 1} failed:`, audioErr.message);
                                
                                if (attempt < 2) {
                                    // Wait 100ms before retrying
                                    await new Promise(resolve => setTimeout(resolve, 100));
                                }
                            }
                        }
                        
                        if (!audioStarted) {
                            showAudioNotice('🔇 Audio blocked by browser - continuing without sound');
                        }
                        
                    } catch (audioErr) {
                        console.warn('Audio initialization failed:', audioErr);
                        showAudioNotice('🔇 Audio unavailable');
                    }
                } else {
                    console.warn('Audio element not found');
                }
                
                // Show loading screen
                loadingContainer.classList.add('active');

                // Loading progress animation (FASTER)
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 2; // Increment by 2 for faster loading
                    percentage.textContent = progress + '%';
                    progressFill.style.width = progress + '%';
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                        
                        // Stop loading video
                        loadingVideo.pause();
                        
                        // Fade out and stop audio
                        fadeOutAudio(loadingAudio, 300);
                        
                        // Hide loader overlay (FASTER - 300ms instead of 500ms)
                        setTimeout(() => {
                            loaderOverlay.classList.add('hidden');
                            initMainPage();
                        }, 300);
                    }
                }, 20); // 20ms * 50 = 1 second total (faster)
                
            } catch (err) {
                co6nsole.error('Critical error during loading sequence:', err);
                showAudioNotice('⚠️ Loading error occurred');
                
                // Fallback: skip to main content
                setTimeout(() => {
                    loaderOverlay.classList.add('hidden');
                    initMainPage();
                }, 2000);
            }
        });

        // GSAP animation for START button
        gsap.from(startBtn, {
            x: 800,
            duration: 1.5,
            ease: "power3",
            opacity: 0
        });

        // ==================== MAIN PAGE LOGIC (FIXED) ====================
        function initMainPage() {
            console.log('✓ Initializing main page');
            
            // IMMEDIATELY show main content
            const backElement = document.querySelector('.back');
            if (backElement) {
                backElement.classList.add('loaded');
            }
            
            try {
                // Initialize Shery effects
                Shery.imageEffect(".back", {
                    style: 5,
                    gooey: true,
                    config: {
                        a: { value: 1.15, range: [0, 30] },
                        b: { value: -0.98, range: [-1, 1] },
                        zindex: { value: 1 },
                        aspect: { value: 1.9223007063572148 },
                        ignoreShapeAspect: { value: true },
                        shapePosition: { value: { x: 0, y: 0 } },
                        shapeScale: { value: { x: 0.5, y: 0.5 } },
                        shapeEdgeSoftness: { value: 0, range: [0, 0.5] },
                        shapeRadius: { value: 0, range: [0, 2] },
                        currentScroll: { value: 0 },
                        scrollLerp: { value: 0.07 },
                        gooey: { value: true },
                        infiniteGooey: { value: true },
                        growSize: { value: 4, range: [1, 15] },
                        durationOut: { value: 1.41, range: [0.1, 5] },
                        durationIn: { value: 1.5, range: [0.1, 5] },
                        displaceAmount: { value: 0.5 },
                        masker: { value: true },
                        maskVal: { value: 1.31, range: [1, 5] },
                        scrollType: { value: 0 },
                        geoVertex: { range: [1, 64], value: 1 },
                        noEffectGooey: { value: true },
                        onMouse: { value: 1 },
                        noise_speed: { value: 0.2, range: [0, 10] },
                        metaball: { value: 0.2, range: [0, 2] },
                        discard_threshold: { value: 0.5, range: [0, 1] },
                        antialias_threshold: { value: 0, range: [0, 0.1] },
                        noise_height: { value: 0.5, range: [0, 2] },
                        noise_scale: { value: 10, range: [0, 100] }
                    }
                });

                console.log('✓ Shery effects initialized');

                // Text animation logic
                const elms = document.querySelectorAll(".elm");
                let index = 0;
                let animating = false;

                document.querySelector("main").addEventListener("click", function () {
                    if (animating) return;
                    animating = true;

                    elms.forEach(function (elm) {
                        const h1s = elm.querySelectorAll("h1");
                        const current = h1s[index];
                        const next = (index === h1s.length - 1) ? h1s[0] : h1s[index + 1];

                        gsap.set(next, { top: "100%" });

                        const tl = gsap.timeline({
                            onComplete: function () {
                                animating = false;
                            }
                        });

                        tl.to(current, {
                            top: "-100%",
                            ease: "expo.inOut",
                            duration: 1,
                            onComplete: function () {
                                gsap.set(current, { top: "100%" });
                            }
                        });

                        tl.to(next, {
                            top: "0%",
                            ease: "expo.inOut",
                            duration: 1
                        }, "-=0.8");
                    });

                    index = (index === elms[0].querySelectorAll("h1").length - 1) ? 0 : index + 1;
                });

                console.log('✓ Text animations ready');
            } catch (err) {
                console.error('Error initializing main page:', err);
                // Even if Shery fails, show the content
                if (backElement) {
                    backElement.style.opacity = '1';
                }
            }
        }
    