document.addEventListener("DOMContentLoaded", () => {
    // 1. Intro Sequence Typing
    const introTextElement = document.getElementById("intro-text");
    const targetIntro = "WELCOME USER";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    
    async function typeWithErrors(element, text, speed = 100, errorChance = 0.15) {
        element.textContent = "";
        for (let i = 0; i < text.length; i++) {
            // Chance for error
            if (Math.random() < errorChance && i > 0 && i < text.length - 1) {
                // Type wrong character
                const wrongChar = chars[Math.floor(Math.random() * chars.length)];
                element.textContent += wrongChar;
                await new Promise(r => setTimeout(r, speed * 1.5));
                
                // Backspace
                element.textContent = element.textContent.slice(0, -1);
                await new Promise(r => setTimeout(r, speed * 2));
            }
            
            // Type correct character
            element.textContent += text[i];
            await new Promise(r => setTimeout(r, speed + (Math.random() * 50 - 25))); // slight variance
        }
    }

    async function initIntro() {
        if(introTextElement) {
            await typeWithErrors(introTextElement, targetIntro, 150, 0.2);
            document.querySelector('.scroll-prompt').classList.add('visible');
        }
    }

    initIntro();

    // 2. Scroll Animations with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // Trigger when section is 40% visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, header, footer').forEach(sec => {
        sectionObserver.observe(sec);
    });

    const typeAnimObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                entry.target.classList.add('typed');
                const originalText = entry.target.getAttribute('data-original-text');
                if (originalText) {
                    typeWithErrors(entry.target, originalText, 30, 0.05); // faster typing for body, fewer errors
                }
            }
        });
    }, observerOptions);

    // Save original text and clear before observing
    document.querySelectorAll('.js-type-anim').forEach(el => {
        el.setAttribute('data-original-text', el.textContent);
        el.textContent = ""; 
        typeAnimObserver.observe(el);
    });

    // 3. Target Reticle Movement
    const reticle = document.querySelector('.target-reticle');
    if (reticle) {
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let tx = x;
        let ty = y;

        // Move target randomly every 2 seconds
        setInterval(() => {
            tx = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
            ty = Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1;
        }, 2000);

        // Interpolate position
        function updateReticle() {
            x += (tx - x) * 0.02;
            y += (ty - y) * 0.02;
            reticle.style.left = `${x}px`;
            reticle.style.top = `${y}px`;
            requestAnimationFrame(updateReticle);
        }
        updateReticle();
        
        // Also slightly follow mouse
        document.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
        });
    }

    // 4. AI Background Streams
    const aiContainer = document.getElementById('ai-background-container');
    const aiPhrases = [
        "SYS.INIT: OK",
        "LOADING MODULES...",
        "DECRYPTING...",
        "ACCESS GRANTED",
        "SCANNING...",
        "0x000F4A2",
        "OVERRIDE: FALSE",
        "SYNC: ESTABLISHED",
        "ANALYZING BIOMETRICS...",
        "UPLINK SECURE"
    ];

    function spawnAIStream() {
        if (!aiContainer) return;
        const el = document.createElement('div');
        el.className = 'ai-stream-text';
        
        // Random position
        el.style.left = `${Math.random() * 90}%`;
        el.style.top = `${Math.random() * 90}%`;
        
        const phrase = aiPhrases[Math.floor(Math.random() * aiPhrases.length)];
        aiContainer.appendChild(el);

        typeWithErrors(el, phrase, 20, 0).then(() => {
            setTimeout(() => {
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 2000);
            }, Math.random() * 2000 + 1000);
        });

        // Spawn next
        setTimeout(spawnAIStream, Math.random() * 800 + 400);
    }

    spawnAIStream();
    spawnAIStream(); // start a couple
});
