
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
                    audio.volume = initialVolume;
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

        // GSAP animation for START button
        gsap.from(startBtn, {
            scale: 2,
            duration: 1,
            opacity: 0,
            ease: "power3"
        });

        // START button click handler with audio
        startBtn.addEventListener('click', async () => {
            try {
                // Hide start button with GSAP
                gsap.to(startBtn, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "back.in",
                    onComplete: () => {
                        startBtn.classList.add('hidden');
                    }
                });
                
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
                
                // AUDIO PLAYBACK - Multiple retry attempts
                if (loadingAudio) {
                    try {
                        loadingAudio.load();
                        loadingAudio.volume = 0.9;
                        
                        let audioStarted = false;
                        for (let attempt = 0; attempt < 3; attempt++) {
                            try {
                                await loadingAudio.play();
                                audioStarted = true;
                                console.log('✓ Audio started successfully on attempt', attempt + 1);
                                break;
                            } catch (audioErr) {
                                console.warn(`Audio attempt ${attempt + 1} failed:`, audioErr.message);
                                
                                if (attempt < 2) {
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
                
                // Show loading screen with GSAP animation
                loadingContainer.classList.add('active');
                gsap.from(loadingContainer, {
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.5,
                    ease: "back.out"
                });

                // Loading progress animation
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 2;
                    percentage.textContent = progress + '%';
                    progressFill.style.width = progress + '%';
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                        
                        // Stop loading video
                        loadingVideo.pause();
                        
                        // Fade out and stop audio
                        fadeOutAudio(loadingAudio, 300);
                        
                        // Hide loader overlay with GSAP
                        gsap.to(loaderOverlay, {
                            opacity: 0,
                            duration: 0.8,
                            ease: "power2.inOut",
                            onComplete: () => {
                                loaderOverlay.classList.add('hidden');
                                initMainPage();
                            }
                        });
                    }
                }, 20);
                
            } catch (err) {
                console.error('Critical error during loading sequence:', err);
                showAudioNotice('⚠️ Loading error occurred');
                
                setTimeout(() => {
                    loaderOverlay.classList.add('hidden');
                    initMainPage();
                }, 2000);
            }
        });

        // ==================== MAIN PAGE LOGIC ====================
        function initMainPage() {
            console.log('✓ Initializing main page');
            
            const backElement = document.querySelector('.back');
            const navLinks = document.querySelectorAll('nav a');
            const heroButton = document.querySelector('.heroleft button');
            const heroTexts = document.querySelectorAll('.heroleft .elm h1');
            
            // GSAP Timeline for smooth page load animation
            const tl = gsap.timeline();
            
            // 1. Fade in background
            tl.to(backElement, {
                opacity: 1,
                duration: 1.5,
                ease: "power2.out",
                onStart: () => {
                    backElement.classList.add('loaded');
                }
            });
            
            // 2. Animate navigation links from top
            tl.from(navLinks, {
                y: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=1");
            
            // 3. Animate hero text lines from bottom
            tl.from(heroTexts, {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out"
            }, "-=0.5");
            
            // 4. Animate explore button
            tl.from(heroButton, {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.3");
            
            try {
                // Initialize Shery effects after animations
                setTimeout(() => {
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
                }, 500);

                // Text animation logic on click
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
                if (backElement) {
                    backElement.style.opacity = '1';
                }
            }
        }
  
